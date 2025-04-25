import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service'; // ajuste o caminho conforme necessários

type CreateProductConfig = {
  value: string;
  userId: string;
};

@Injectable()
export class ConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async createColor(data: CreateProductConfig) {
    return this.prisma.color.create({ data });
  }

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
    const { page = 1, pageSize = 10, orderBy, filters = {} } = options;

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
    const [items, totalCount] = await Promise.all([
      // @ts-ignore
      this.prisma[type].findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
      }),
      // @ts-ignore
      this.prisma[type].count({ where }),
    ]);

    return {
      items,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  async createSize(data: CreateProductConfig) {
    return this.prisma.size.create({ data });
  }

  async createBrand(data: CreateProductConfig) {
    return this.prisma.brand.create({ data });
  }

  async createType(data: CreateProductConfig) {
    return this.prisma.type.create({ data });
  }
}
