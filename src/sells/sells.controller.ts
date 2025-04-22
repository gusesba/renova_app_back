import { Body, Controller, Post, BadRequestException, UseGuards, Request } from '@nestjs/common';
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
}
