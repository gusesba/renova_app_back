import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser()); // Adiciona o middleware de cookies

  app.enableCors({
    origin: 'http://localhost:3000',  // Permite apenas esse domínio
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],  // Cabeçalhos permitidos
    credentials: true,  // Permite cookies e credenciais
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
