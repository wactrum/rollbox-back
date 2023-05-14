import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PrismaExceptionFilter } from '@/infrastructure/database/prisma/errors/prisma-exception.filter';
import multipart from '@fastify/multipart';
import fstatic from '@fastify/static';
import * as path from 'path';

declare const module: any;

/**
 * Prepare server
 * Add libs and utils
 * @param app
 */
export async function prepareServer(app: INestApplication): Promise<INestApplication> {
  // Use class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Use Prisma and handle prisma errors
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilter(adapterHost));

  return app;
}

async function bootstrap() {
  const adapter = new FastifyAdapter();

  const staticPath = path.join(__dirname, '..', 'uploads');

  adapter.register(fstatic, {
    root: staticPath,
    prefix: '/uploads/', // optional: default '/'
  });

  adapter.register(multipart);

  let app: INestApplication = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

  app = await prepareServer(app);

  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // Use Swagger docs
  const config = new DocumentBuilder()
    .setTitle('Nest-template API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
