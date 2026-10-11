import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindMenuQueryDto } from './dto/find-menu-query.dto';
import { MenuItem } from './entities/menu-item.entity';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;
  const queryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(MenuItem),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(() => queryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('filters, sorts and paginates menu items with metadata', async () => {
    const item = { id: 1, nombre: 'Hamburguesa' } as MenuItem;
    queryBuilder.getManyAndCount.mockResolvedValue([[item], 11]);

    const query = Object.assign(new FindMenuQueryDto(), {
      search: 'hambur',
      categoria: 'Hamburguesas',
      sede: 'Manta',
      minPrecio: 5,
      maxPrecio: 10,
      page: 2,
      limit: 5,
      sortBy: 'precio',
      order: 'DESC',
    });

    await expect(service.findAll(query)).resolves.toEqual({
      data: [item],
      meta: {
        page: 2,
        limit: 5,
        total: 11,
        totalPages: 3,
        hasNext: true,
        hasPrevious: true,
      },
    });

    expect(queryBuilder.orderBy).toHaveBeenCalledWith(
      'menuItem.precio',
      'DESC',
    );
    expect(queryBuilder.skip).toHaveBeenCalledWith(5);
    expect(queryBuilder.take).toHaveBeenCalledWith(5);
  });

  it('rejects an inverted price range', async () => {
    const query = Object.assign(new FindMenuQueryDto(), {
      minPrecio: 10,
      maxPrecio: 5,
    });

    await expect(service.findAll(query)).rejects.toThrow(
      'minPrecio no puede ser mayor que maxPrecio',
    );
  });
});
