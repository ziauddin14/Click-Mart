import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: 'featured',
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products', filters.category, filters.search, filters.minPrice, filters.maxPrice],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-t-2xl"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <SearchFilters 
              categories={categories || []}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {filters.category ? 
                  categories?.find(c => c.id === filters.category)?.name || 'Products' : 
                  'All Products'
                } ({products?.length || 0} results)
              </h3>
              <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products?.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}

            {/* Pagination */}
            {products && products.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav className="flex space-x-2">
                  <Button variant="outline">Previous</Button>
                  <Button className="bg-navy-600 hover:bg-navy-700">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
