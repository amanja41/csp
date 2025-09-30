export interface Customer {
  basic_customer_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  ssn_last_4: string;
  basic_orig_ids: number[];
  basic_serv_loan_ids: number[];
  basic_serv_card_ids: number[];
  deleted: boolean;
  company?: string;
  status?: 'active' | 'inactive' | 'prospect';
  matched_fields?: string[]; // Fields that matched the search criteria
}
