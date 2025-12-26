import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeederService } from './database/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const ALLOWED_ORIGINS = '*';
  app.enableCors({
    origin: ALLOWED_ORIGINS,
    credentials: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    exposedHeaders: 'Content-Disposition',
    maxAge: 600,
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const seeder = app.get(SeederService);
  await seeder.run();

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
