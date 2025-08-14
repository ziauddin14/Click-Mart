import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Users, Package, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-gray-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-orange-400" />
            <h1 className="text-3xl font-bold">Click Mart</h1>
          </div>
          <Button onClick={() => window.location.href = '/api/login'} className="bg-orange-500 hover:bg-orange-600">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center space-y-8">
          <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
            Discover Amazing 
            <span className="text-orange-400"> Deals</span> 
            Every Day
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Shop millions of products from trusted sellers worldwide. Fast shipping, secure payments, and unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg"
            >
              Get Started
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy-800 px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 pt-8">
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
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-gray-300">Free shipping on orders over $50 with delivery in 2-3 business days.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-300">SSL encrypted checkout with multiple payment options for your security.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-300">Our customer service team is here to help you anytime, anywhere.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/20 text-center text-gray-300">
        <p>&copy; 2024 Click Mart. All rights reserved.</p>
      </footer>
    </div>
  );
}
