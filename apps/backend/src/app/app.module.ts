import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { OHLCModule } from '../ohlc/ohlc.module';

const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
};

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    OHLCModule,
  ],
})
export class AppModule {}
