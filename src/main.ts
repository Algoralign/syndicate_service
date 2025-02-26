import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';


import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));


  const config = new DocumentBuilder()
    .setTitle('Syndicate api doc')
    .setDescription('This is an API for powering refund')
    .setVersion('1.0')
    .addTag('Syndicate Application API')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 5001;
  await app.listen(PORT);
}
bootstrap();
