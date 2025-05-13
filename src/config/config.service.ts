import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // ajuste o caminho conforme necessários

type CreateProductConfig = {
  value: string;
  userId: string;
};

@Injectable()
export class ConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProductConfig(
    type: 'color' | 'size' | 'brand' | 'type',
    userId: string,
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: {
        field: 'id' | 'value';
        direction: 'asc' | 'desc';
      };
      filters?: {
        id?: string;
        value?: string;
      };
    },
  ) {
    const { page = 1, pageSize, orderBy, filters = {} } = options;

    const where: any = {
      userId,
      AND: [],
    };

    // Filtros diretos
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        where.AND.push({
          [key]: { contains: value, mode: 'insensitive' },
        });
      }
    });
    const take = pageSize ? Number(pageSize) : undefined;
    const [items, totalCount] = await Promise.all([
      // @ts-ignore
      this.prisma[type].findMany({
        where,
        skip: take ? (page - 1) * take : undefined,
        take: take,
        orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
      }),
      // @ts-ignore
      this.prisma[type].count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        value: item.value.charAt(0).toUpperCase() + item.value.slice(1),
      })),
      totalPages: pageSize ? Math.ceil(totalCount / pageSize) : 1,
    };
  }

  async createConfig(
    data: CreateProductConfig,
    type: 'color' | 'size' | 'brand' | 'type',
  ) {
    data.value = data.value.toLocaleLowerCase('pt-BR');
    const exists = await this.verifyIfExists(type, data.userId, data.value);

    if (exists) {
      throw new Error(`A configuração já existe!`);
    }

    // @ts-ignore
    return this.prisma[type].create({ data });
  }

  async deleteConfig(
    type: 'color' | 'size' | 'brand' | 'type',
    userId: string,
    id: string,
  ) {
    // @ts-ignore
    return this.prisma[type].delete({
      where: {
        userId,
        id,
      },
    });
  }

  async verifyIfExists(
    type: 'color' | 'size' | 'brand' | 'type',
    userId: string,
    value: string,
  ) {
    const where: any = {
      userId,
      value,
    };
    // @ts-ignore
    const exists = await this.prisma[type].findFirst({ where });
    return !!exists;
  }
}
