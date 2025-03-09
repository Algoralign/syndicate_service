import { Module } from '@nestjs/common';
import { SystemReceivingAccountController } from './system-receiving-account.controller';
import { SystemReceivingAccountService } from './system-receiving-account.service';

@Module({
  controllers: [SystemReceivingAccountController],
  providers: [SystemReceivingAccountService]
})
export class SystemReceivingAccountModule {}
