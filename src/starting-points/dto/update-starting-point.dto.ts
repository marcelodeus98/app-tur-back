import { PartialType } from '@nestjs/swagger';
import { CreateStartingPointDto } from './create-starting-point.dto';

export class UpdateStartingPointDto extends PartialType(CreateStartingPointDto) {}
