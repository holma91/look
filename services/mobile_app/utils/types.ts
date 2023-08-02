export type Product = {
  url: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  updatedAt?: string;
  images: string[];
  domain?: string;
};

export type UserProduct = {
  url: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  images: string[];
  updatedAt?: string;
  liked?: boolean;
  domain?: string;
  creator?: string;
  generatedBy?: string[];
};

export type Website = {
  domain: string;
  favorited: boolean;
};

export type Company = {
  id: string;
  domains: string[];
  favorited: boolean;
};

export type FilterType = {
  all?: string[];
  list?: string[];
  category?: string[];
  brand?: string[];
  website?: string[];
};

export type OuterChoiceFilterType =
  | 'all'
  | 'list'
  | 'category'
  | 'website'
  | 'brand';
