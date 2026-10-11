import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import {
  FindMenuQueryDto,
  MenuSortField,
} from './dto/find-menu-query.dto';
import { MenuItem } from './entities/menu-item.entity';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

export interface PaginatedMenuResponse {
  data: MenuItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuRepository: Repository<MenuItem>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const menuItem = this.menuRepository.create(createMenuItemDto);

    return this.menuRepository.save(menuItem);
  }
  async findAll(query: FindMenuQueryDto = new FindMenuQueryDto()): Promise<PaginatedMenuResponse> {
    const {
      search,
      categoria,
      sede,
      minPrecio,
      maxPrecio,
      page,
      limit,
      sortBy,
      order,
    } = query;

    if (minPrecio !== undefined && maxPrecio !== undefined && minPrecio > maxPrecio) {
      throw new BadRequestException('minPrecio no puede ser mayor que maxPrecio');
    }

    const sortColumns: Record<MenuSortField, string> = {
      id: 'menuItem.id',
      nombre: 'menuItem.nombre',
      precio: 'menuItem.precio',
      categoria: 'menuItem.categoria',
      sede: 'menuItem.sede',
    };

    const queryBuilder = this.menuRepository.createQueryBuilder('menuItem');
    const normalizedSearch = search?.trim();

    if (normalizedSearch) {
      queryBuilder.andWhere(
        '(menuItem.nombre ILIKE :search OR menuItem.categoria ILIKE :search OR menuItem.descripcion ILIKE :search)',
        { search: `%${normalizedSearch}%` },
      );
    }

    if (categoria?.trim()) {
      queryBuilder.andWhere('menuItem.categoria ILIKE :categoria', {
        categoria: categoria.trim(),
      });
    }

    if (sede?.trim()) {
      queryBuilder.andWhere('menuItem.sede ILIKE :sede', {
        sede: sede.trim(),
      });
    }

    if (minPrecio !== undefined) {
      queryBuilder.andWhere('menuItem.precio >= :minPrecio', { minPrecio });
    }

    if (maxPrecio !== undefined) {
      queryBuilder.andWhere('menuItem.precio <= :maxPrecio', { maxPrecio });
    }

    const currentPage = page ?? 1;
    const pageSize = limit ?? 10;
    const [data, total] = await queryBuilder
      .orderBy(sortColumns[sortBy ?? 'id'], order ?? 'ASC')
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

    return {
      data,
      meta: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrevious: currentPage > 1 && totalPages > 0,
      },
    };
  }
  async findOne(id: number): Promise<MenuItem> {
    const menuItem = await this.menuRepository.findOneBy({ id });

    if (!menuItem) {
      throw new NotFoundException('Producto del menú no encontrado');
    }

    return menuItem;
  }

  async update(
    id: number,
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    const menuItem = await this.menuRepository.preload({
      id,
      ...updateMenuItemDto,
    });

    if (!menuItem) {
      throw new NotFoundException('Producto del menú no encontrado');
    }

    return this.menuRepository.save(menuItem);
  }

  async remove(id: number): Promise<void> {
    const menuItem = await this.findOne(id);

    await this.menuRepository.remove(menuItem);
  }
}
