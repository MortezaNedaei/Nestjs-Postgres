import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { Constants } from '../constants/Constants';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: Constants.Routes.Coffees, method: RequestMethod.ALL });
    // consumer.apply(LoggingMiddleware).forRoutes('*');
    // consumer.apply(LoggingMiddleware).exclude('coffees').forRoutes('*');
  }
}
