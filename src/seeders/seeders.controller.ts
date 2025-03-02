import { Controller, Get } from '@nestjs/common';
import { SeedersService } from './seeders.service';

@Controller('seeders')
export class SeedersController {
  constructor(private sedersService: SeedersService) { }
  @Get('/run-seeder')
  async run() {
    // return await this.sedersService.run();
  }

  @Get('/create-country')
  async createCountry() {
    return await this.sedersService.createCountry();
  }
  @Get('/create-state')
  async createState() {
    return await this.sedersService.createState();
  }
  @Get('/create-lga')
  async createLga() {
    return await this.sedersService.createLGAEvent();
  }
  @Get('/create-bank')
  async createBank() {
    return await this.sedersService.createBank();
  }
  @Get('/create-permission')
  async roleAndPermission() {
    return await this.sedersService.roleAndPermission();
  }

  @Get('/create-currency')
  async asyncCreateCurrencySymbol() {
    return await this.sedersService.asyncCreateCurrencySymbol();
  }

  @Get('/create-project-type')
  async createProjectType() {
    return await this.sedersService.createProjectType();
  }
  @Get('/create-proposal-topic')
  async createProposalTopic() {
    return await this.sedersService.createProposalTopic();
  }

  @Get('/create-vote-win-rate')
  async createVoteWinRate() {
    return await this.sedersService.createVoteWinRate();
  }

  @Get('/update-bank-details')
  async updateBankDetails() {
    return await this.sedersService.updateBankDetailsEvent();
  }

  @Get('/add-proposal-topic')
  async addProposalTopic() {
    return await this.sedersService.addProposalTopic();
  }

  @Get('/create-donor-proposal-topics')
  async createDonorProposalTopic() {
    return await this.sedersService.createDonorProposalTopic();
  }

  @Get('/create-project-category')
  async createProjectCategory() {
    return await this.sedersService.createProjectCategory();
  }

}
