import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',  // Permite apenas esse domínio
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],  // Cabeçalhos permitidos
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
