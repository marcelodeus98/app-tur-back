import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserValidationService } from './validations/user.validation.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserValidationService],
  exports: [UserService, UserValidationService]
})
export class UserModule {}
