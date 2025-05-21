import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    phone: string;
    name: string;
    codeRef?: string;
    obs?: string;
    userId: string;
  }) {
    if (data.codeRef != '' && data.codeRef != undefined) {
      const client = await this.prisma.client.findFirst({
        where: { codeRef: data.codeRef, userId: data.userId },
      });

      if (client) {
        throw new ConflictException('Client already exists');
      }
      // Find client with latest codeRef
    } else {
      const result = await this.prisma.$queryRawUnsafe<{ maxCode: number }[]>(
        `
  SELECT MAX(CAST("codeRef" AS INTEGER)) as "maxCode"
  FROM "Client"
  WHERE "userId" = $1 AND "codeRef" ~ '^\\d+$'
`,
        data.userId,
      );

      const maxCode = result[0]?.maxCode ?? 0;

      data.codeRef = (maxCode + 1).toString();
    }

    try {
      return await this.prisma.client.create({ data });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Client already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(userId: string, id: string) {
    return this.prisma.client.delete({ where: { userId, id } });
  }

  async edit(
    userId: string,
    id: string,
    data: { phone?: string; name?: string },
  ) {
    return this.prisma.client.update({
      where: { userId, id },
      data,
    });
  }

  async findOne(userId: string, id: string) {
    return this.prisma.client.findUnique({ where: { userId, id } });
  }

  async findAll(
    userId: string,
    options: {
      page?: number;
      pageSize?: number;
      orderBy?: {
        field: 'id' | 'name' | 'phone' | 'codeRef' | 'obs';
        direction: 'asc' | 'desc';
      };
      filters?: {
        id?: string;
        name?: string;
        phone?: string;
        codeRef?: string;
        obs?: string;
      };
    },
  ) {
    const { page = 1, pageSize = 10, orderBy, filters = {} } = options;

    const where = {
      userId,
      AND: Object.entries(filters).map(([key, value]) => ({
        [key]: { contains: value, mode: 'insensitive' },
      })),
    };

    const [items, totalCount] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      items,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }
}
