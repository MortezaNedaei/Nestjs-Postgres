import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CoffeesList } from './data.mock/coffee.data';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = CoffeesList;

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    return this.coffees.find((item) => item.id === id);
  }

  create(dto: CreateCoffeeDto) {
    // this.coffees.push(dto);
  }

  update(id: string, dto: UpdateCoffeeDto) {
    const foundItem = this.findOne(id);
    if (foundItem) {
      // update item
    }
  }

  delete(id: string) {
    const index = this.coffees.findIndex((item) => item.id === id);
    if (index) {
      this.coffees.splice(index, 1);
    }
  }
}
