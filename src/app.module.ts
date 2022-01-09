import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { Constants } from './constants/Constants';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeormModule } from './typeorm/typeorm.module';

@Module({
  imports: [CoffeesModule, TypeormModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: Constants.Routes.Coffees, method: RequestMethod.ALL });
  }
}
