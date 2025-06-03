import { Test, TestingModule } from '@nestjs/testing';
import { StartingPointsController } from './starting-points.controller';
import { StartingPointsService } from './starting-points.service';

describe('StartingPointsController', () => {
  let controller: StartingPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartingPointsController],
      providers: [StartingPointsService],
    }).compile();

    controller = module.get<StartingPointsController>(StartingPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
