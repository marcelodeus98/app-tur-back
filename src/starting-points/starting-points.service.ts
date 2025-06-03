import { Injectable } from '@nestjs/common';
import { CreateStartingPointDto } from './dto/create-starting-point.dto';
import { UpdateStartingPointDto } from './dto/update-starting-point.dto';

@Injectable()
export class StartingPointsService {
  create(createStartingPointDto: CreateStartingPointDto) {
    return 'This action adds a new startingPoint';
  }

  findAll() {
    return `This action returns all startingPoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} startingPoint`;
  }

  update(id: number, updateStartingPointDto: UpdateStartingPointDto) {
    return `This action updates a #${id} startingPoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} startingPoint`;
  }
}
