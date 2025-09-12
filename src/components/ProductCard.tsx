import React from 'react';
import Image from 'next/image';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  isUS: boolean; // To determine which affiliate link to use
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isUS }) => {
  const affiliateUrl = isUS && product.affiliateUrlAmazon ? product.affiliateUrlAmazon : product.affiliateUrlCoupang;

  return (
    <div className="border rounded-lg shadow-lg p-4 m-2 w-80 flex flex-col items-center">
      {product.imageUrl ? (
        <Image src={product.imageUrl} alt={product.name} width={192} height={192} className="w-full h-48 object-contain mb-4" />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500 mb-4 rounded-lg">
          No Image
        </div>
      )}
      <h3 className="text-lg font-bold text-center mb-2">{product.name}</h3>
      <p className="text-sm text-gray-600 text-center mb-4">{product.description}</p>
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
      >
        View Product
      </a>
    </div>
  );
};

export default ProductCard;
