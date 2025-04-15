import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { phone: string; name: string; userId: string }) {
    return this.prisma.client.create({ data });
  }

  async remove(userId: string, id:string) {
    return this.prisma.client.delete({ where: { userId,id } });
  }

  async edit(userId: string, id:string, data: { phone?: string; name?: string }) {
    return this.prisma.client.update({
      where: { userId, id },
      data,
    });
  }

  async findOne(userId: string,id:string) {
    return this.prisma.client.findUnique({ where: { userId,id } });
  }

  async findAll(userId: string) {
    return this.prisma.client.findMany({where: { userId } });
  }
}
