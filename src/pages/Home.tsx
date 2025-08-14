import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ['/api/products/featured'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                Discover Amazing 
                <span className="text-orange-400"> Deals</span> 
                Every Day
              </h2>
              <p className="text-xl text-gray-300">
                Shop millions of products from trusted sellers worldwide. Fast shipping, secure payments, and unbeatable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
                  Shop Now
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy-800 px-8 py-4 text-lg">
                  Browse Categories
                </Button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">10M+</div>
                  <div className="text-sm text-gray-300">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">50K+</div>
                  <div className="text-sm text-gray-300">Sellers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">1M+</div>
                  <div className="text-sm text-gray-300">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern shopping technology" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <CategoryGrid categories={categories || []} />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts || []} />

      <Footer />
    </div>
  );
}
