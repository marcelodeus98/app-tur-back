import { Module } from '@nestjs/common';
import { StartingPointsService } from './starting-points.service';
import { StartingPointsController } from './starting-points.controller';

@Module({
  controllers: [StartingPointsController],
  providers: [StartingPointsService],
})
export class StartingPointsModule {}
