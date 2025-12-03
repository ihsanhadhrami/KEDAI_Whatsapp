// Order model types

export type OrderStatus = 'pending' | 'paid' | 'deploying' | 'completed' | 'failed' | 'refunded';

export type PlanType = 'free' | 'pro' | 'enterprise';

export interface Order {
  id: string;
  order_number: string;
  store_slug: string | null;
  full_name: string;
  email: string;
  whatsapp: string;
  template_key: string;
  plan_type: PlanType;
  amount: number;
  status: OrderStatus;
  toyyib_bill_code: string | null;
  toyyib_ref: string | null;
  payment_url: string | null;
  meta_json: Record<string, unknown>;
  paid_at: string | null;
  deployed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderInput {
  full_name: string;
  email: string;
  whatsapp: string;
  store_name: string;
  template_key: string;
  plan_type: PlanType;
  amount: number;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  store_slug?: string;
  toyyib_bill_code?: string;
  toyyib_ref?: string;
  payment_url?: string;
  meta_json?: Record<string, unknown>;
  paid_at?: string;
  deployed_at?: string;
}

// Order with related data
export interface OrderWithDetails extends Order {
  store?: {
    id: string;
    name: string;
    slug: string;
  };
  template?: {
    key: string;
    title: string;
  };
}
