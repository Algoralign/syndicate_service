import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SeedersService } from '../seeders.service';
@Injectable()
export class SeederListener {
    private readonly logger = new Logger(SeederListener.name);
    constructor(
        private seedersService: SeedersService,
    ) { }
    @OnEvent('lga.created', { async: true })
    async handleLGACreatedEvent(event: any) {
        try {
            await this.seedersService.createLga()
        } catch (error) {
            console.log(error.message);
        }
    }


    @OnEvent('bank.updated', { async: true })
    async handleBankCreatedEvent(event: any) {
        try {
            await this.seedersService.updateBankDetails()
        } catch (error) {
            console.log(error.message);
        }
    }
}