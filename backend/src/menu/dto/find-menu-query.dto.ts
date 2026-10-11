import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export const MENU_SORT_FIELDS = [
  'id',
  'nombre',
  'precio',
  'categoria',
  'sede',
] as const;

export type MenuSortField = (typeof MENU_SORT_FIELDS)[number];
export type SortOrder = 'ASC' | 'DESC';

export class FindMenuQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  sede?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrecio?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrecio?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsIn(MENU_SORT_FIELDS)
  sortBy: MenuSortField = 'id';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: SortOrder = 'ASC';
}
