import { Logger, NestHybridApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// https://docs.nestjs.com/microservices/kafka#options
const microserviceOptions: MicroserviceOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: process.env.KAFKA_CLIENT_ID || 'dashboard-client',
      brokers: process.env.KAFKA_BROKERS?.split(',') || [],
    },
    consumer: {
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'dashboard-group',
    }
  }
}

const hybridApplicationOptions: NestHybridApplicationOptions = {
  inheritAppConfig: true
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // A hybrid application is one that listens for requests from two or more different sources
  // https://docs.nestjs.com/faq/hybrid-application
  app.connectMicroservice(microserviceOptions, hybridApplicationOptions);


  await app.startAllMicroservices();
  await app.listen(port);
}

bootstrap();
