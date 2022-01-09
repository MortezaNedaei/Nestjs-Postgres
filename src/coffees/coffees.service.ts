import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
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

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
