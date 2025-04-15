import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() request, @Body() input: { phone: string; name: string }) {
    const userId = request.user.userId;
    return this.clientsService.create({ ...input, userId });
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  remove(@Request() request, @Query() id:string) {
    const userId = request.user.userId;
    return this.clientsService.remove(userId, id);
  }

  @UseGuards(AuthGuard)
  @Put()
  edit(
    @Request() request,
    @Body() input: { phone?: string; name?: string; id: string }
  ) {
    const userId = request.user.userId;
    return this.clientsService.edit(userId,input.id,{phone: input.phone, name: input.name});
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Request() request, @Query('id') id: string) {
    const userId = request.user.userId;
    return this.clientsService.findOne(userId, id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Request() request,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('orderByField') orderByField?: 'id' | 'name' | 'phone',
    @Query('orderByDirection') orderByDirection?: 'asc' | 'desc',
    @Query('id') id?: string,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
  ) {
    const userId = request.user.userId;
    return this.clientsService.findAll(userId, {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
      orderBy: orderByField && orderByDirection
        ? { field: orderByField, direction: orderByDirection }
        : undefined,
      filters: {
        ...(id && { id }),
        ...(name && { name }),
        ...(phone && { phone }),
      },
    });
  }
}
