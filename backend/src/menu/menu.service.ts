import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

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
  async findAll(): Promise<MenuItem[]> {
    return this.menuRepository.find({
      order: {
        id: 'ASC',
      },
    });
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
