import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(AuthGuard)
  @Post('color')
  createColor(@Request() request, @Body() input: { value: string }) {
    const userId = request.user.userId;
    return this.configService.createColor({ ...input, userId });
  }

  @UseGuards(AuthGuard)
  @Post('size')
  createSize(@Request() request, @Body() input: { value: string }) {
    const userId = request.user.userId;
    return this.configService.createSize({ ...input, userId });
  }

  @UseGuards(AuthGuard)
  @Post('brand')
  createBrand(@Request() request, @Body() input: { value: string }) {
    const userId = request.user.userId;
    return this.configService.createBrand({ ...input, userId });
  }

  @UseGuards(AuthGuard)
  @Post('type')
  createType(@Request() request, @Body() input: { value: string }) {
    const userId = request.user.userId;
    return this.configService.createType({ ...input, userId });
  }

  @Get('color')
  findAllColors(
    @Query('userId') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('orderByField') orderByField?: 'id' | 'value',
    @Query('orderByDirection') orderByDirection?: 'asc' | 'desc',
    @Query('id') id?: string,
    @Query('value') value?: string,
  ) {
    return this.configService.findAllProductConfig('color', userId, {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      orderBy:
        orderByField && orderByDirection
          ? { field: orderByField, direction: orderByDirection }
          : undefined,
      filters: { id, value },
    });
  }

  @Get('type')
  findAllTypes(
    @Query('userId') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('orderByField') orderByField?: 'id' | 'value',
    @Query('orderByDirection') orderByDirection?: 'asc' | 'desc',
    @Query('id') id?: string,
    @Query('value') value?: string,
  ) {
    return this.configService.findAllProductConfig('type', userId, {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      orderBy:
        orderByField && orderByDirection
          ? { field: orderByField, direction: orderByDirection }
          : undefined,
      filters: { id, value },
    });
  }

  @Get('brand')
  findAllBrands(
    @Query('userId') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('orderByField') orderByField?: 'id' | 'value',
    @Query('orderByDirection') orderByDirection?: 'asc' | 'desc',
    @Query('id') id?: string,
    @Query('value') value?: string,
  ) {
    return this.configService.findAllProductConfig('brand', userId, {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      orderBy:
        orderByField && orderByDirection
          ? { field: orderByField, direction: orderByDirection }
          : undefined,
      filters: { id, value },
    });
  }

  @Get('size')
  findAllSizes(
    @Query('userId') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('orderByField') orderByField?: 'id' | 'value',
    @Query('orderByDirection') orderByDirection?: 'asc' | 'desc',
    @Query('id') id?: string,
    @Query('value') value?: string,
  ) {
    return this.configService.findAllProductConfig('size', userId, {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      orderBy:
        orderByField && orderByDirection
          ? { field: orderByField, direction: orderByDirection }
          : undefined,
      filters: { id, value },
    });
  }
}
