import dryProducts from './products/dry.json';
import acneProducts from './products/acne.json';
import sensitiveProducts from './products/sensitive.json';
import poreProducts from './products/pore.json';
import agingProducts from './products/aging.json';

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  affiliateUrlCoupang: string;
  affiliateUrlAmazon: string;
  attributes: {
    skinTypes: string[];
    concerns: string[];
    formulation?: string;
  };
}

export const allProducts: Product[] = [
  ...dryProducts,
  ...acneProducts,
  ...sensitiveProducts,
  ...poreProducts,
  ...agingProducts,
];
