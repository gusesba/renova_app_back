import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() request, @Body() input: {
    price: number;
    type: string;
    brand: string;
    size: string;
    color: string;
    providerId: string;
    description: string;
    entryDate?: Date;
  }) {
    const userId = request.user.userId;
    return this.productsService.create({ ...input, userId });
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() request, @Param('id') id: string) {
    const userId = request.user.userId;
    return this.productsService.remove(userId, id);
  }

  @UseGuards(AuthGuard)
  @Put()
  edit(@Request() request, @Body() input: {
    id: string;
    price?: number;
    type?: string;
    brand?: string;
    size?: string;
    color?: string;
    providerId?: string;
    description?: string;
    entryDate?: Date;
  }) {
    const userId = request.user.userId;
    const { id, ...data } = input;
    return this.productsService.edit(userId, id, data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Request() request, @Param('id') id: string) {
    const userId = request.user.userId;
    return this.productsService.findOne(userId, id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Request() request,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('orderByField') orderByField?: 'id' | 'price' | 'type' | 'brand' | 'size' | 'color' | 'entryDate',
    @Query('orderByDirection') orderByDirection?: 'asc' | 'desc',
    @Query('id') id?: string,
    @Query('type') type?: string,
    @Query('brand') brand?: string,
    @Query('size') size?: string,
    @Query('color') color?: string,
    @Query('description') description?: string,
    @Query('providerId') providerId?: string,
  ) {
    const userId = request.user.userId;
    return this.productsService.findAll(userId, {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      orderBy: orderByField && orderByDirection
        ? { field: orderByField, direction: orderByDirection }
        : undefined,
      filters: {
        ...(id && { id }),
        ...(type && { type }),
        ...(brand && { brand }),
        ...(size && { size }),
        ...(color && { color }),
        ...(description && { description }),
        ...(providerId && { providerId }),
      },
    });
  }
}
