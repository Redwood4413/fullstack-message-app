import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.PROD === 'true' ? process.env.FRONTEND_URL : true,
    credentials: true,
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Message App')
    .setDescription('The Message App API')
    .setVersion('1.0')
    .addTag('message-app')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, { autoTagControllers: true });
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

export * from 'validation/user';
export * from 'prisma/generated/zod';
