import { Link } from "wouter";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import type { Product } from "@shared/schema";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-3xl font-bold">Featured Products</h3>
          <Link 
            href="/products" 
            className="text-navy-600 hover:text-orange-500 font-semibold transition-colors flex items-center"
          >
            View All 
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <h4 className="text-xl font-semibold text-gray-600 mb-2">No featured products yet</h4>
            <p className="text-gray-500">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
