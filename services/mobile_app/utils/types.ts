// A product from a User's perspective
export type UserProduct = {
  url: string;
  name: string;
  brand: string;
  price: string;
  currency: string;
  images: string[];
  domain: string;
  liked: boolean;
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
