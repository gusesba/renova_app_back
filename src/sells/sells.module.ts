import { Module } from '@nestjs/common';
import { SellsService } from './sells.service';
import { SellsController } from './sells.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [SellsService],
  controllers: [SellsController],
  imports: [AuthModule,PrismaModule]
})
export class SellsModule {}
