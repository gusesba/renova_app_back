import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface Sell {
  id: string;
  type: string;
  clientName: string;
  totalProducts: number;
  date: Date;
}

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

  async findAll(
    userId: string,
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: {
        field: 'id' | 'type' | 'date';
        direction: 'asc' | 'desc';
      };
      filters?: {
        id?: string;
        type?: string;
        clientName?: string;
      };
    },
  ): Promise<{
    items: Sell[];
    totalPages: number;
  }> {
    const { page = 1, pageSize = 10, orderBy, filters = {} } = options;

    const where: any = {
      userId,
      AND: [],
    };

    // Filtros diretos
    if (filters.id) {
      where.AND.push({
        id: { contains: filters.id, mode: 'insensitive' },
      });
    }

    if (filters.type) {
      where.AND.push({
        type: { contains: filters.type, mode: 'insensitive' },
      });
    }

    if (filters.clientName) {
      where.AND.push({
        client: {
          name: { contains: filters.clientName, mode: 'insensitive' },
        },
      });
    }

    const [sells, totalCount] = await Promise.all([
      this.prisma.sell.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy
          ? { [orderBy.field]: orderBy.direction }
          : { date: 'desc' },
        include: {
          client: true,
          sellProducts: { include: { product: true } },
        },
      }),
      this.prisma.sell.count({ where }),
    ]);

    const items: Sell[] = sells.map((sell) => ({
      id: sell.id,
      type: sell.type,
      clientName: sell.client.name,
      totalProducts: sell.sellProducts.length,
      date: sell.date,
      products: sell.sellProducts.map((sp) => sp.product),
    }));

    return {
      items,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  async findSellProducts(userId: string, id: string) {
    const sellWithProducts = await this.prisma.sell.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        sellProducts: {
          include: {
            product: { include: { provider: true } },
          },
        },
      },
    });

    if (!sellWithProducts) {
      throw new NotFoundException('Venda não encontrada');
    }

    return {
      items: sellWithProducts.sellProducts.map((sp) => ({
        ...sp.product,
        providerName: sp.product.provider.name,
        provider: undefined,
      })),
    };
  }
}
