import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../country/country.entity';
import { State } from '../state/state.entity';
import { Lga } from '../lga/lga.entity';
import { Permission } from '../permission/permission.entity';
import { Role } from '../role/role.entity';
import { bankDetails } from '../_data/bank';
import { countryData } from '../_data/countries';
import { projectTypes } from '../_data/project_type';
import { stateData } from '../_data/states';
import { lgaData } from '../_data/lgas';
import { anchorBanks } from "../_data/anchor_bank"
import { currencySymbolData } from '../_data/currencies';
import { voteWinRateData } from "../_data/vote_win_rate"
import { donorProposalTopicData } from "../_data/donor_proposal_topic"
import { roleAndPermissionEnum } from '../role/enum/role-permission.enum';
import { Bank } from '../bank/bank.entity';
import { CurrencySymbol } from '../currency-symbol/currency-symbol.entity';

import { Cron, Interval } from '@nestjs/schedule';
import { ProjectType } from '../project-type/project-type.entity';
import { ProposalTopic } from '../proposal-topic/proposal-topic.entity';
import { proposalTopicData } from '../_data/proposal_topic'
import { VoteWinRate } from '../vote-win-rate/vote-win-rate.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DonorProposalTopic } from '../donor-proposal-topic/donor-proposal-topic.entity';
import { projectCategories } from '../_data/project_category';
import { ProjectCategory } from '../project-category/project-category.entity';


@Injectable()
export class SeedersService {
  private readonly logger = new Logger(SeedersService.name);
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    @InjectRepository(State) private stateRepository: Repository<State>,
    @InjectRepository(Lga) private lgaRepository: Repository<Lga>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
    @InjectRepository(CurrencySymbol)
    private currencySymbolRepository: Repository<CurrencySymbol>,
    @InjectRepository(ProjectType)
    private projectTypeRepository: Repository<ProjectType>,
    @InjectRepository(ProposalTopic)
    private proposalTopicRepository: Repository<ProposalTopic>,
    @InjectRepository(VoteWinRate)
    private voteWinRateRepository: Repository<VoteWinRate>,
    @InjectRepository(DonorProposalTopic)
    private donorProposalTopicRepository: Repository<DonorProposalTopic>,
    @InjectRepository(ProjectCategory)
    private projectCategoryRepository: Repository<ProjectCategory>,
  ) { }

  /**
   * Check if migration have already ran
   */

  // async run(): Promise<{ status: boolean; message: string }> {
  //   try {
  //     const countrydata = await this.countryRepository.find();
  //     if (countrydata.length > 0) {
  //       return {
  //         status: true,
  //         message: 'Migration already ran previously',
  //       };
  //     } else {
  //       this.logger.log(`Seeder started running`);
  //       await this.createCountry();
  //       await this.createState();
  //       await this.createLga();
  //       await this.roleAndPermission();
  //       await this.createBank();
  //       await this.asyncCreateCurrencySymbol();
  //       await this.createProjectType();
  //       console.log('Seeder Executed succesfully');
  //       return {
  //         status: true,
  //         message: 'seeder ran succesfully',
  //       };
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException();
  //   }
  // }
  async createCountry() {
    try {
      for (let i = 0; i < countryData.length; i++) {
        await this.countryRepository.save({
          name: countryData[i].name,
          continent: countryData[i].continent,
          dial_code: countryData[i].dial_code,
          value: countryData[i].value,
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createState() {
    try {
      const country = await this.countryRepository.findOne({
        where: { name: 'Nigeria' },
      });

      for (const state of stateData) {
        await this.stateRepository.save({
          name: state.name,
          country: country,
        });
      }

      // await this.countryRepository.create(countryJson);
      this.logger.log(`Data Imported successfully`);
    } catch (error) {
      console.log(error);
      this.logger.error(error.stack);
    }
  }


  async createLGAEvent() {
    try {
      this.eventEmitter.emit('lga.created');
      return {
        status: true,
        statusCode: 200,
        message: "LGA event create initiated"
      }
    } catch (error) {
      console.log(error)
    }
  }

  async createLga() {
    try {
      this.logger.log(`LGA's create Event started`);
      const states = await this.stateRepository.find();
      for (const lga of lgaData) {
        for (const state of states) {
          if (state.name == lga.state.name) {
            const lg = lga.state.locals;
            for (const newlga of lg) {
              await this.lgaRepository.save({
                name: newlga.name,
                state: state,
              });
              this.logger.log(`${newlga.name}: Created`);
            }
          }
        }
      }
      this.logger.log(`LGA's created succesfully`);
    } catch (error) {
      console.log(error);
      this.logger.log(`Error Creating LGA`);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Create Permission
   * And Roles
   */
  async roleAndPermission() {
    try {
      for (const role of roleAndPermissionEnum) {
        const newRole = await this.roleRepository.save({
          name: role.name,
        });
        if (newRole) {
          const thePermission = role.permission;
          for (let i = 0; i < thePermission.length; i++) {
            await this.permissionRepository.save({
              name: thePermission[i],
              role: newRole,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createBank() {
    try {
      const bank = await this.bankRepository.find();
      if (bank.length === 0) {
        for (let i = 0; i < bankDetails.length; i++) {
          await this.bankRepository.save({
            name: bankDetails[i].name,
            serial: bankDetails[i].serial,
            code: bankDetails[i].code,
            slug: bankDetails[i].slug,
          });
        }
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async asyncCreateCurrencySymbol() {
    try {
      for (const symbol of currencySymbolData) {
        await this.currencySymbolRepository.save({
          name: symbol,
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createProjectType() {
    try {
      for (const type of projectTypes) {
        await this.projectTypeRepository.save({
          name: type.name,
          category_code: type.category
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createProposalTopic() {
    try {
      for (const topic of proposalTopicData) {
        await this.proposalTopicRepository.save({
          topic: topic.name,
          description: topic.description,
          code: topic.code
        });
      }
    } catch (error) {
      console.log("Obinna error")
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async createVoteWinRate() {
    try {
      for (const rate of voteWinRateData) {
        await this.voteWinRateRepository.save({
          name: rate.name,
          description: rate.description,
          code: rate.code,
          percentage: rate.percentage
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }



  async updateBankDetailsEvent() {
    try {
      this.eventEmitter.emit('bank.updated');
      return {
        status: true,
        statusCode: 200,
        message: "Bank detail update initiated"
      }
    } catch (error) {
      console.log(error)
    }
  }
  async updateBankDetails() {
    this.logger.log(`Bank detail update  event initiated`);
    try {
      for (const bank of anchorBanks) {
        if (bank.attributes.code != undefined) {
          const getBank = await this.bankRepository
            .createQueryBuilder('banks')
            .where('banks.code = :code', { code: bank.attributes.code })
            .getOne();
          getBank.name = bank.attributes.name;
          getBank.nipCode = bank.attributes.nipCode;
          getBank.anchorBankId = bank.id;
          await this.bankRepository.save(getBank);
          this.logger.log(`New Bank detail updated: ${getBank.name}`);
        }
        else {
          await this.bankRepository.save({
            name: bank.attributes.name,
            anchorBankId: bank.id,
            nipCode: bank.attributes.nipCode
          });
          this.logger.log(`New Bank created`);
        }
      }
      this.logger.log(`Bank detail update finished`);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async addProposalTopic() {
    try {

    } catch (error) {
      throw new InternalServerErrorException()
    }
  }


  async createDonorProposalTopic() {
    try {
      for (const title of donorProposalTopicData) {
        await this.donorProposalTopicRepository.save({
          topic: title.topic,
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async createProjectCategory() {
    try {
      for (const cat of projectCategories) {
        await this.projectCategoryRepository.save({
          name: cat.name,
          code: cat.code
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
