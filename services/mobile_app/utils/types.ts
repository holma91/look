export type Product = {
  url: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  updated_at?: string;
  images: string[];
};

export type UserProduct = {
  url: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  images: string[];
  updated_at?: string;
  liked?: boolean;
  domain?: string;
};

export type Website = {
  domain: string;
  favorited: boolean;
};
