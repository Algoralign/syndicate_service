import User from "./src/user/user.entity";
import Country from "./src/country/country.entity";
import Address from "./src/address/address.entity";
import EmailVerificationToken from "./src/email-verification-token/email-verification-token.entity";
import ResetPasswordToken from "./src/reset-password-token/reset-password-token.entity";
import IdentityType from "./src/identity-types/identity-types.entity";
import { Bank } from './src/bank/bank.entity';
import Kyc from './src/kyc/kyc.entity';
import InvestmentInstrument from './src/investment-instrument/investment-instrument.entity';
import Industry from "./src/industry/industry.entity";
import SchedulePeriod from "./src/schedule-period/schedule-period.entity";
import { Deal } from "./src/deal/deal.entity";
import { InvitationTracker } from "./src/invitation-tracker/invitation-tracker.entity";
import { Investment } from "./src/investments/investments.entity";



export const entities = [
  User,
  Address,
  Country,
  InvitationTracker,
  Deal,
  Investment,
  InvestmentInstrument,
  Industry,
  EmailVerificationToken,
  ResetPasswordToken,
  
  IdentityType,
  Bank,
  Kyc,
  SchedulePeriod,
];
