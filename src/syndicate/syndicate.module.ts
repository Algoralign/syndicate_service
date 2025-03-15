import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SyndicateController } from './syndicate.controller';
import { SyndicateService } from './syndicate.service';
import Syndicate from './syndicate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import InvestmentInstrument from '../investment-instrument/investment-instrument.entity';
import User from '../user/user.entity';
import { BlockAdminMiddleware } from '../middlewares/block-admin.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Syndicate, InvestmentInstrument, User])],
  controllers: [SyndicateController],
  providers: [SyndicateService]
})
// export class SyndicateModule { }

export class SyndicateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BlockAdminMiddleware).forRoutes('/syndicate');
  }
}
