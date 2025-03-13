import { Module } from '@nestjs/common';
import { SyndicateController } from './syndicate.controller';
import { SyndicateService } from './syndicate.service';

@Module({
  controllers: [SyndicateController],
  providers: [SyndicateService]
})
export class SyndicateModule {}
