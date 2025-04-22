import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SellsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSell(data: {
    userId: string;
    clientId: string;
    productIds: string[];
    type: string;
    date?: Date;
  }) {
    const { userId, clientId, productIds, type, date } = data;

    // Verifica se o cliente existe
    const client = await this.prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId,
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Verifica se todos os produtos existem e pertencem ao usuário
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        userId: userId,
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Um ou mais produtos não foram encontrados');
    }

    // Cria a venda
    const sell = await this.prisma.sell.create({
      data: {
        userId,
        clientId,
        type,
        date: date ?? new Date(),
        sellProducts: {
          create: productIds.map((productId) => ({
            productId,
            userId,
          })),
        },
      },
      include: {
        sellProducts: true,
      },
    });

    return sell;
  }
}
