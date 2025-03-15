// import { Donor } from '../../donor/donor.entity';

import User from '../../user/user.entity';

export interface JwtPayload {
  email: string;
  userId: string;
}


export interface Role {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Data {
  user: User;
  kyc_detail: {}
  invitations: {}
  all_syndicate: {}
}

export interface JsonResponse {
  error: boolean;
  message: string;
  status_code: number;
  data: Data;
}