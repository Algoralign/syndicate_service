import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';


// import {
//   SwaggerModule,
//   DocumentBuilder,
//   SwaggerDocumentOptions,
// } from '@nestjs/swagger';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));



  const PORT = process.env.PORT || 5002;
  await app.listen(PORT);
}
bootstrap();
