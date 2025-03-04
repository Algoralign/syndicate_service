import User from "./src/user/user.entity";
import Country from "./src/country/country.entity";
import Address from "./src/address/address.entity";
import EmailVerificationToken from "./src/email-verification-token/email-verification-token.entity";
import ResetPasswordToken from "./src/reset-password-token/reset-password-token.entity";
import IdentityType from "./src/identity-types/identity-types.entity";
import { Bank } from './src/bank/bank.entity';
import Kyc from './src/kyc/kyc.entity';



export const entities = [
  User,
  Country,
  Address,
  User,
  Country,
  EmailVerificationToken,
  ResetPasswordToken,
  IdentityType,
  Bank,
  Kyc
];
