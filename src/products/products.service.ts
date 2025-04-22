import {
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
      console.log(e)
      throw new InternalServerErrorException('Error creating product');
    }
  }

  async edit(userId: string, id: string, data: {
    price?: number;
    type?: string;
    brand?: string;
    size?: string;
    color?: string;
    providerId?: string;
    description?: string;
    entryDate?: Date;
  }) {
    try {
      return await this.prisma.product.update({
        where: { id, userId },
        data,
      });
    } catch (e) {
      throw new NotFoundException('Product not found');
    }
  }

  async remove(userId: string, id: string) {
    try {
      return await this.prisma.product.delete({
        where: { id, userId },
      });
    } catch (e) {
      throw new NotFoundException('Product not found');
    }
  }

  async findOne(userId: string, id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id, userId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findAll(userId: string, options: {
    page?: number;
    pageSize?: number;
    orderBy?: { field: 'id' | 'price' | 'type' | 'brand' | 'size' | 'color' | 'entryDate'; direction: 'asc' | 'desc' };
    filters?: {
      id?: string;
      type?: string;
      brand?: string;
      size?: string;
      color?: string;
      description?: string;
      providerName?: string;
    };
  }) {
    const {
      page = 1,
      pageSize = 10,
      orderBy,
      filters = {},
    } = options;

    const where: any = {
  userId,
  AND: [],
};

// Filtros diretos
Object.entries(filters).forEach(([key, value]) => {
  if (key !== 'providerName') {
    where.AND.push({
      [key]: { contains: value, mode: 'insensitive' },
    });
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
    provider: undefined,   // Remove o objeto inteiro se quiser só o nome
  })),
  totalPages: Math.ceil(totalCount / pageSize),
};
}
}
