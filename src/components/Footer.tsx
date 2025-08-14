import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Send, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-navy-800 to-navy-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <ShoppingCart className="h-8 w-8 text-orange-400" />
              <h3 className="text-2xl font-bold">Click Mart</h3>
            </div>
            <p className="text-navy-200 mb-6">
              Your trusted online shopping destination with millions of products, fast shipping, and secure payments worldwide.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="w-10 h-10 bg-navy-700 hover:bg-orange-500 rounded-full p-0">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 bg-navy-700 hover:bg-orange-500 rounded-full p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 bg-navy-700 hover:bg-orange-500 rounded-full p-0">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 bg-navy-700 hover:bg-orange-500 rounded-full p-0">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-navy-200 hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=electronics" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=fashion" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=home" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link href="/products?category=sports" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Sports & Outdoors
                </Link>
              </li>
              <li>
                <Link href="/products?category=books" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Books & Media
                </Link>
              </li>
              <li>
                <Link href="/products?category=health" className="text-navy-200 hover:text-orange-400 transition-colors">
                  Health & Beauty
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Stay Updated</h4>
            <p className="text-navy-200 mb-4">
              Subscribe to get special offers, free giveaways, and new arrivals.
            </p>
            <div className="space-y-4">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 text-gray-900 rounded-l-lg rounded-r-none"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 rounded-l-none rounded-r-lg px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-orange-400 rounded flex items-center justify-center">
                  <span className="text-xs">📱</span>
                </div>
                <span className="text-navy-200">Download our mobile app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-navy-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-navy-200">
              <p>&copy; 2024 Click Mart. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <span className="text-navy-200">We accept:</span>
                <div className="flex space-x-2">
                  <div className="w-8 h-5 bg-blue-400 rounded text-xs flex items-center justify-center text-white font-bold">
                    VISA
                  </div>
                  <div className="w-8 h-5 bg-red-400 rounded text-xs flex items-center justify-center text-white font-bold">
                    MC
                  </div>
                  <div className="w-8 h-5 bg-blue-400 rounded text-xs flex items-center justify-center text-white font-bold">
                    PP
                  </div>
                  <div className="w-8 h-5 bg-gray-800 rounded text-xs flex items-center justify-center text-white font-bold">
                    AP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
