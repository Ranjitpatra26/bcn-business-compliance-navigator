export interface Business {
  id: string;
  user_id: string;
  name: string;
  business_type: string;
  industry: string;
  country: string;
  state: string;
  city: string;
  address: string;
  details: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessRequest {
  name: string;
  business_type: string;
  industry: string;
  country: string;
  state?: string;
  city?: string;
  address?: string;
  details?: string;
}
