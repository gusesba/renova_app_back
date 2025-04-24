import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId: string;
    price: number;
    type: string;
    brand: string;
    size: string;
    color: string;
    providerId: string;
    description: string;
    entryDate?: Date;
  }) {
    try {
      return await this.prisma.product.create({ data });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Erro ao criar produto');
    }
  }

  async edit(
    userId: string,
    id: string,
    data: {
      price?: number;
      type?: string;
      brand?: string;
      size?: string;
      color?: string;
      providerId?: string;
      description?: string;
      entryDate?: Date;
    },
  ) {
    try {
      return await this.prisma.product.update({
        where: { id, userId },
        data,
      });
    } catch (e) {
      throw new NotFoundException('Produto não encontrado');
    }
  }

  async remove(userId: string, id: string) {
    try {
      return await this.prisma.product.delete({
        where: { id, userId },
      });
    } catch (e) {
      throw new NotFoundException('Produto não encontrado');
    }
  }

  async findOne(userId: string, id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id, userId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async findOneUnsold(userId: string, id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        sellsProducts: true,
      },
    });

    if (!product || product.userId !== userId) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.sellsProducts.length > 0) {
      throw new BadRequestException('Produto já vendido');
    }

    return product;
  }

  async findAll(
    userId: string,
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: {
        field:
          | 'id'
          | 'price'
          | 'type'
          | 'brand'
          | 'size'
          | 'color'
          | 'entryDate';
        direction: 'asc' | 'desc';
      };
      filters?: {
        id?: string;
        price?: string;
        type?: string;
        brand?: string;
        size?: string;
        color?: string;
        description?: string;
        providerName?: string;
        entryDateStart?: string;
        entryDateEnd?: string;
      };
      soldStatus?: 'sold' | 'unsold' | 'all';
    },
  ) {
    const {
      page = 1,
      pageSize = 10,
      orderBy,
      filters = {},
      soldStatus = 'all',
    } = options;

    const where: any = {
      userId,
      AND: [],
    };

    // Filtros diretos (exceto data e providerName)
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value &&
        !['providerName', 'entryDateStart', 'entryDateEnd'].includes(key)
      ) {
        if (key === 'price') {
          const numericValue = parseFloat(value as string);
          if (!isNaN(numericValue)) {
            where.AND.push({
              [key]: numericValue,
            });
          }
        } else {
          where.AND.push({
            [key]: { contains: value, mode: 'insensitive' },
          });
        }
      }
    });

    // Filtro por nome do fornecedor (relacionamento com Client)
    if (filters.providerName) {
      where.AND.push({
        provider: {
          name: { contains: filters.providerName, mode: 'insensitive' },
        },
      });
    }

    // Filtro por intervalo de datas
    if (filters.entryDateStart || filters.entryDateEnd) {
      const dateFilter: any = {};
      if (filters.entryDateStart) {
        dateFilter.gte = new Date(filters.entryDateStart);
      }
      if (filters.entryDateEnd) {
        // Para incluir o dia inteiro, adiciona 1 dia e filtra por menor que o próximo dia
        const endDate = new Date(filters.entryDateEnd);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(23, 59, 59, 999); // Define o horário para o final do dia
        dateFilter.lt = endDate;
      }
      where.AND.push({ entryDate: dateFilter });
    }

    // Filtro por status de venda
    if (soldStatus === 'sold') {
      where.AND.push({
        sellsProducts: {
          some: {}, // pelo menos uma venda associada
        },
      });
    } else if (soldStatus === 'unsold') {
      where.AND.push({
        sellsProducts: {
          none: {}, // nenhuma venda associada
        },
      });
    }

    const [items, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
        include: { provider: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        providerName: item.provider.name,
        provider: undefined,
      })),
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }
}
