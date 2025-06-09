import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Req, Query, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateDriverDto } from './dto/create-driver.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiConflictResponse, ApiExtraModels, ApiBody, getSchemaPath } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Create a user' })
  @ApiExtraModels(CreateClientDto, CreateDriverDto)
  @ApiBody({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(CreateClientDto) },
        { $ref: getSchemaPath(CreateDriverDto) }
      ]
    }
  })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'User already exists' })
  @Post()
  async create(@Body() data: CreateClientDto | CreateDriverDto) {
    if (![2, 3].includes(data.roleId)) {
      throw new BadRequestException('Invalid roleId');
    }
    return this.userService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get()
  findAll(@Request() req) {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Returns current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('me')
  async getMe(@Req() req) {
    return this.userService.findMe(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Returns user by id' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Not Found' }
  )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'Returns updated user' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiConflictResponse({ description: 'User already exists' })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'Returns deleted user' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
