import { Test, TestingModule } from '@nestjs/testing';
import { StartingPointsService } from './starting-points.service';

describe('StartingPointsService', () => {
  let service: StartingPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartingPointsService],
    }).compile();

    service = module.get<StartingPointsService>(StartingPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
