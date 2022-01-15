import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from './entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { offset, limit } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const item = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!item) {
      throw new NotFoundException(`item #${id} not found`);
    }
    return item;
  }

  async create(dto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      dto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const item = this.coffeeRepository.create({ ...dto, flavors });
    return this.coffeeRepository.save(item);
  }

  async update(id: string, dto: UpdateCoffeeDto) {
    const flavors =
      dto.flavors &&
      (await Promise.all(
        dto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));
    const item = await this.coffeeRepository.preload({
      id: +id,
      ...dto,
      flavors,
    });
    if (!item) {
      throw new NotFoundException(`item #${id} not found`);
    }
    return this.coffeeRepository.save(item);
  }

  async delete(id: string) {
    const item = await this.findOne(id);
    return this.coffeeRepository.remove(item);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
