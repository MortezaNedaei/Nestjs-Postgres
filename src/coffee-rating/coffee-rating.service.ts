import { Injectable, Scope } from '@nestjs/common';
import { CoffeesService } from '../coffees/coffees.service';

@Injectable({ scope: Scope.DEFAULT })
export class CoffeeRatingService {
  constructor(private readonly coffeesService: CoffeesService) {}
}
