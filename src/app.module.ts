import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { SellsModule } from './sells/sells.module';
import { ConfigModule as MyConfig } from './config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env variables globally
    UsersModule,
    AuthModule,
    PrismaModule,
    ClientsModule,
    ProductsModule,
    SellsModule,
    ConfigModule,
    MyConfig,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
