export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  imageUrl?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Order {
  _id: string;
  date: string;
  total: number;
  productIds: string[] | Product[];
}


export interface Metrics {
  _id: string
  totalOrders: number
  averageTotal: number
  totalRevenue: number
}
