import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/ohlc'})
export class OHLCGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(OHLCGateway.name);
  private readonly allowedBases: Set<string>;

  private extractBasesList(bases: string): string[] {
    return bases.split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean);
  }

  private get bases(): string[] {
    const defaults = ['BTC', 'ETH', 'SOL', 'XRP', 'USDC'];
    const bases: string = this.configService.get<string>('AVAILABLE_TRADING_BASES', '');
    const areBasesDefined: boolean = bases !== undefined && bases.length > 0;
    return areBasesDefined ? this.extractBasesList(bases) : defaults;
  }

  constructor(private readonly configService: ConfigService) {
    this.allowedBases = new Set(this.bases);
    this.logger.log(`Allowed OHLC bases: ${[...this.allowedBases].join(', ')}`);
  }

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Subscribe to a channel. Payload: { channel: string }
   * Expected channel format: ohlc-1min-<BASE>-usdt where <BASE> is in AVAILABLE_BASES
   */
  @SubscribeMessage('subscribe')
  async handleSubscribe(client: Socket, payload: { channel?: string }) {
    const channel = payload?.channel;
    if (!channel) {
      return { status: 'error', message: 'channel is required' };
    }

    const base = this.extractBaseFromChannel(channel);
    if (!base) {
      return { status: 'error', message: `invalid channel format: ${channel}` };
    }

    if (!this.allowedBases.has(base.toUpperCase())) {
      return { status: 'error', message: `base not available: ${base}` };
    }

    await client.join(channel);
    this.logger.log(`Client ${client.id} joined ${channel}`);
    return { status: 'ok', channel };
  }

  /**
   * Unsubscribe from a channel. Payload: { channel: string }
   */
  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(client: Socket, payload: { channel?: string }) {
    const channel = payload?.channel;
    if (!channel) {
      return { status: 'error', message: 'channel is required' };
    }

    await client.leave(channel);
    this.logger.log(`Client ${client.id} left ${channel}`);
    return { status: 'ok', channel };
  }

  /**
   * Helper: extract base like BTC from channel name
   */
  private extractBaseFromChannel(channel: string): string | null {
    const match = /^ohlc-1min-([A-Za-z0-9]+)-usdt$/i.exec(channel);
    if (!match) return null;
    return match[1];
  }

  /**
   * Helper to list allowed channel names (useful for other services)
   */
  getAllowedChannels(): string[] {
    return [...this.allowedBases].map((b) => `ohlc-1min-${b.toLowerCase()}-usdt`);
  }

  /**
   * Publishes a payload to a specific ohlc channel (room).
   * Validates channel format and that the base is allowed so this adapts
   * automatically when `AVAILABLE_TRADING_BASES` changes.
   */
  publishToChannel(channel: string, payload: unknown): { status: 'ok' } | { status: 'error'; message: string } {
    const base = this.extractBaseFromChannel(channel);
    if (!base) {
      this.logger.warn(`Attempt to publish to invalid channel format: ${channel}`);
      return { status: 'error', message: 'invalid channel format' };
    }

    if (!this.allowedBases.has(base.toUpperCase())) {
      this.logger.warn(`Attempt to publish to not-allowed base ${base} for channel ${channel}`);
      return { status: 'error', message: `base not allowed: ${base}` };
    }

    if (!this.server) {
      this.logger.warn('WebSocket server not available to publish message');
      return { status: 'error', message: 'server not available' };
    }

    this.server.to(channel).emit('ohlc', payload);
    this.logger.debug(`Published ohlc payload to ${channel}`);
    return { status: 'ok' };
  }

}
