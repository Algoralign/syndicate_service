export default interface AllBankInterface {
  status: boolean;
  status_code: number;
  message: string;
  data: {
    id: string;
    name: string;
    slug: string;
    code: string;
    country_code: string;
    country_name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}


