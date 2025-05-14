export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  active: boolean;
  image_url: string[];
  stripe_product_id?: string;
  old_price?: number;
  brand?: string;
  color?: string;
  model?: string;
  warranty?: string;
  size?: string;
}
