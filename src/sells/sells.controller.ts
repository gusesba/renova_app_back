import { Body, Controller, Post, BadRequestException, UseGuards, Request, Get, Query } from '@nestjs/common';
import { SellsService } from './sells.service';
import { AuthGuard } from 'src/auth/auth.guard';

type CreateSellBody = {
  clientId: string;
  productIds: string[];
  type: string;
  date?: string;
};

@Controller('sells')
export class SellsController {
  constructor(private readonly sellsService: SellsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createSell(@Request() request,@Body() body: CreateSellBody) {
    const userId = request.user.userId;
    const {clientId, productIds, type, date} = body;

    if (!userId || !clientId || !Array.isArray(productIds) || !type) {
      throw new BadRequestException('Parâmetros obrigatórios ausentes ou inválidos');
    }

    return this.sellsService.createSell({
      userId,
      clientId,
      productIds,
      type,
      date: date ? new Date(date) : undefined,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Request() request,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('orderByField') orderByField?: 'id' | 'type' | 'date',
    @Query('orderByDirection') orderByDirection?: 'asc' | 'desc',
    @Query('id') id?: string,
    @Query('type') type?: string,
    @Query('clientName') clientName?: string,
  ) {
    const userId = request.user.userId;

    return this.sellsService.findAll(userId, {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      orderBy: orderByField && orderByDirection
        ? { field: orderByField, direction: orderByDirection }
        : undefined,
      filters: {
        ...(id && { id }),
        ...(type && { type }),
        ...(clientName && { clientName }),
      },
    });
  }
}
