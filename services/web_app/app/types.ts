type ManualProduct = {
  uid: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  files: (File | string)[];
};
