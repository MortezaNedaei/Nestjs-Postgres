import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from './entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { Connection } from 'typeorm';

// class ConfigService {}
// class DevelopmentConfigService {}
// class ProductionConfigService {}

// @Injectable()
// export class CoffeesBrandsFactory {
//   create() {
//     // do something
//     return ['buddy brew', 'nescafe'];
//   }
// }

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    // { provide: ConfigService, useValue: process.env.NODE_ENV === 'development' ? DevelopmentConfigService: ProductionConfigService, },
    // CoffeesBrandsFactory,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeesBrands = await connection.query('SELECT * ...');
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        console.log('Async Factory');
        return coffeeBrands;
      },
      // useFactory: (brandsFactory: CoffeesBrandsFactory) => brandsFactory.create(),
      // inject: [CoffeesBrandsFactory],
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
