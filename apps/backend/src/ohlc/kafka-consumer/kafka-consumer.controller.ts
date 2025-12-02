import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, Payload, Transport, Ctx, KafkaContext } from '@nestjs/microservices';
import { OHLCGateway } from '../ohlc.gateway';
import * as DTO from '../dto/ohlc-event.dto';

@Controller()
export class KafkaConsumerController {
    private readonly logger = new Logger(KafkaConsumerController.name);
    private readonly allowedBases: Set<string>;

    private extractBasesList(bases: string): string[] {
        return bases.split(',').map((s: string) => s.trim().toUpperCase()).filter(Boolean);
    }

    private get bases(): string[] {
        const defaults = ['BTC', 'ETH', 'SOL', 'XRP', 'USDC'];
        const bases: string = this.configService.get<string>('AVAILABLE_TRADING_BASES', '');
        const areBasesDefined: boolean = bases !== undefined && bases.length > 0;
        return areBasesDefined ? this.extractBasesList(bases) : defaults;
    }

    constructor(private readonly configService: ConfigService, private readonly ohlcGateway: OHLCGateway,) {
        this.allowedBases = new Set(this.bases);
        this.logger.log(`Allowed OHLC bases: ${[...this.allowedBases].join(', ')}`);
    }


    @EventPattern(/^ohlc-1min-.*-usdt/, Transport.KAFKA)
    async handleOHLC1minEvents(@Payload() event: DTO.OHLCEvent, @Ctx() context: KafkaContext) {
        const topic = context.getTopic();
        this.logger.debug(`Received Kafka event on topic=${topic}`);

        try {
            const res = this.ohlcGateway.publishToChannel(topic, event);
            if (res.status === 'error') {
                this.logger.warn(`Failed to publish to channel ${topic}: ${res.message}`);
            }
        } catch (err) {
            this.logger.error(`Error forwarding Kafka event to websocket channel ${topic}: ${String(err)}`);
        }
    }

}