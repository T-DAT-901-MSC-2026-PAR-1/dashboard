import { Test, TestingModule } from '@nestjs/testing';
import { OhlcGateway } from './ohlc.gateway';

describe('OhlcGateway', () => {
  let gateway: OhlcGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OhlcGateway],
    }).compile();

    gateway = module.get<OhlcGateway>(OhlcGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
