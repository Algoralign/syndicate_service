import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SeedersService } from '../seeders.service';
@Injectable()
export class SeederListener {
    private readonly logger = new Logger(SeederListener.name);
    constructor(
        private seedersService: SeedersService,
    ) { }
}