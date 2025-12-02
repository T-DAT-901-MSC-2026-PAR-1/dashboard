import { Module } from '@nestjs/common';
import { OHLCGateway } from './ohlc.gateway';
import { OhlcConsumerControllerController } from './ohlc-consumer-controller/ohlc-consumer-controller.controller';
import { KafkaConsumerController } from './kafka-consumer/kafka-consumer.controller';

@Module({
  providers: [OHLCGateway],
  controllers: [OhlcConsumerControllerController, KafkaConsumerController]
})
export class OHLCModule {}
