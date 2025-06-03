import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StartingPointsService } from './starting-points.service';
import { CreateStartingPointDto } from './dto/create-starting-point.dto';
import { UpdateStartingPointDto } from './dto/update-starting-point.dto';

@Controller('starting-points')
export class StartingPointsController {
  constructor(private readonly startingPointsService: StartingPointsService) {}

  @Post()
  create(@Body() createStartingPointDto: CreateStartingPointDto) {
    return this.startingPointsService.create(createStartingPointDto);
  }

  @Get()
  findAll() {
    return this.startingPointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.startingPointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStartingPointDto: UpdateStartingPointDto) {
    return this.startingPointsService.update(+id, updateStartingPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.startingPointsService.remove(+id);
  }
}
