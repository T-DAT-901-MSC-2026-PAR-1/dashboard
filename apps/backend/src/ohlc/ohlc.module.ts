import { Module } from '@nestjs/common';
import { OhlcGateway } from './ohlc.gateway';

@Module({
  providers: [OhlcGateway]
})
export class OhlcModule {}
