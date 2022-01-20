import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Constants } from '../constants/Constants';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { Protocol } from '../common/decorators/protocol.decorator';

@ApiTags(Constants.Routes.Coffees)
// @UsePipes(ValidationPipe) // or new ValidationPipe()
@Controller(Constants.Routes.Coffees)
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: any, // request: Request // can be used when di scope is Scope.REQUEST
  ) {}

  // @UsePipes(ValidationPipe)
  @Get(Constants.Routes.Flavors)
  @Public()
  @ApiOperation({ summary: 'Retrieves all coffees' })
  findAll(
    @Protocol('https') protocol: string,
    // @Protocol() protocol: string,
    @Query() paginationQuery: { offset: number; limit: number },
  ) {
    console.log(protocol); //http
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'gets one coffee by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    const coffee = this.coffeesService.findOne('' + id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  @Post()
  @ApiOperation({ summary: 'Creates new coffee' })
  create(@Body() dto: CreateCoffeeDto) {
    return this.coffeesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a coffee by id and new object' })
  update(@Param('id') id: number, @Body(ValidationPipe) dto: UpdateCoffeeDto) {
    return this.coffeesService.update('' + id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Removes a coffee by id' })
  delete(@Param('id') id: number) {
    return this.coffeesService.delete('' + id);
  }
}
