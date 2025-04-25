import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ConfigService],
  controllers: [ConfigController],
  imports: [AuthModule, PrismaModule],
})
export class ConfigModule {}
