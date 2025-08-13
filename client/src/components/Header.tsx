import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "wouter";
import { RootState } from "@/store/store";
import { toggleCart } from "@/store/slices/cartSlice";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Search, 
  User, 
  Heart, 
  MapPin, 
  Menu,
  Minus,
  Plus,
  Trash2,
  X
} from "lucide-react";

export default function Header() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const { isOpen: isCartOpen } = useSelector((state: RootState) => state.cart);

  const { data: cartItems } = useQuery({
    queryKey: ['/api/cart'],
    enabled: isAuthenticated,
  });

  const { data: wishlistItems } = useQuery({
    queryKey: ['/api/wishlist'],
    enabled: isAuthenticated,
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Please sign in",
          description: "You need to sign in to update cart.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update cart.",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/cart/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Please sign in",
          description: "You need to sign in to remove items.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartTotal = cartItems?.reduce((sum, item) => {
    const price = Number(item.product.salePrice || item.product.price);
    return sum + (price * item.quantity);
  }, 0) || 0;

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      <header className="bg-gradient-to-r from-navy-800 to-navy-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-2 text-sm border-b border-navy-700">
            <div className="hidden md:flex items-center space-x-4">
              <span>Free shipping on orders over $50</span>
              <span>|</span>
              <span>24/7 Customer Support</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/products" className="hover:text-orange-400 transition-colors">
                Track Order
              </Link>
              <Link href="/products" className="hover:text-orange-400 transition-colors">
                Help
              </Link>
              <Link href="/admin" className="hover:text-orange-400 transition-colors">
                Sell on Click Mart
              </Link>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <ShoppingCart className="h-8 w-8 text-orange-400" />
                <h1 className="text-2xl font-bold">Click Mart</h1>
              </Link>
              
              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-2xl">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search products, brands and categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <Button 
                    type="submit"
                    className="absolute right-0 top-0 h-full px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-2 cursor-pointer hover:text-orange-400 transition-colors">
                <MapPin className="h-5 w-5" />
                <div>
                  <div className="text-xs">Deliver to</div>
                  <div className="font-semibold">New York 10001</div>
                </div>
              </div>

              {isAuthenticated ? (
                <Link href="/profile" className="flex items-center space-x-2 cursor-pointer hover:text-orange-400 transition-colors">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <div className="hidden md:block">
                    <div className="text-xs">Hello, {user?.firstName || 'User'}</div>
                    <div className="font-semibold">Account & Lists</div>
                  </div>
                </Link>
              ) : (
                <Button
                  onClick={() => window.location.href = '/api/login'}
                  className="flex items-center space-x-2 bg-transparent hover:text-orange-400 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <div className="hidden md:block">
                    <div className="text-xs">Hello, Sign in</div>
                    <div className="font-semibold">Account & Lists</div>
                  </div>
                </Button>
              )}

              <Link href="/profile" className="flex items-center space-x-2 cursor-pointer hover:text-orange-400 transition-colors">
                <Heart className="h-5 w-5" />
                <div className="hidden md:block">
                  <div className="text-xs">Your</div>
                  <div className="font-semibold">Wishlist ({wishlistItems?.length || 0})</div>
                </div>
              </Link>

              <div className="relative">
                <Button
                  onClick={() => dispatch(toggleCart())}
                  className="flex items-center space-x-2 bg-transparent hover:text-orange-400 transition-colors"
                >
                  <div className="relative">
                    <ShoppingCart className="h-6 w-6" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                        {cartItemCount}
                      </Badge>
                    )}
                  </div>
                  <div className="hidden md:block text-sm font-semibold">Cart</div>
                </Button>
              </div>

              <Button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden bg-transparent"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="py-2 border-t border-navy-700">
            <div className="flex items-center space-x-8 overflow-x-auto">
              <Button className="flex items-center space-x-2 bg-transparent hover:text-orange-400 transition-colors whitespace-nowrap">
                <Menu className="h-4 w-4" />
                <span>All Categories</span>
              </Button>
              <Link href="/products?category=electronics" className="hover:text-orange-400 transition-colors whitespace-nowrap">
                Electronics
              </Link>
              <Link href="/products?category=fashion" className="hover:text-orange-400 transition-colors whitespace-nowrap">
                Fashion
              </Link>
              <Link href="/products?category=home" className="hover:text-orange-400 transition-colors whitespace-nowrap">
                Home & Garden
              </Link>
              <Link href="/products?category=sports" className="hover:text-orange-400 transition-colors whitespace-nowrap">
                Sports
              </Link>
              <Link href="/products?category=books" className="hover:text-orange-400 transition-colors whitespace-nowrap">
                Books
              </Link>
              <Link href="/products?category=health" className="hover:text-orange-400 transition-colors whitespace-nowrap">
                Health
              </Link>
              <Link href="/products" className="hover:text-orange-400 transition-colors whitespace-nowrap">
                Today's Deals
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 text-gray-900"
            />
            <Button 
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-orange-500 hover:bg-orange-600"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Shopping Cart ({cartItemCount})</h3>
                <Button
                  variant="ghost"
                  onClick={() => dispatch(toggleCart())}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {!cartItems || cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <Button 
                    onClick={() => {
                      dispatch(toggleCart());
                      setLocation('/products');
                    }}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <Card key={item.id} className="border border-gray-200">
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={item.product.imageUrl || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.product.name}</h4>
                              <div className="text-sm text-gray-600">
                                <span>${item.product.salePrice || item.product.price}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCartMutation.mutate({ 
                                    id: item.id, 
                                    quantity: Math.max(1, item.quantity - 1) 
                                  })}
                                  disabled={item.quantity <= 1 || updateCartMutation.isPending}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCartMutation.mutate({ 
                                    id: item.id, 
                                    quantity: item.quantity + 1 
                                  })}
                                  disabled={updateCartMutation.isPending}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                ${(Number(item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCartMutation.mutate(item.id)}
                                disabled={removeFromCartMutation.isPending}
                                className="text-red-500 hover:text-red-700 mt-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-navy-800">${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => {
                          dispatch(toggleCart());
                          setLocation('/checkout');
                        }}
                      >
                        Checkout
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-navy-600 text-navy-600 hover:bg-navy-600 hover:text-white"
                        onClick={() => {
                          dispatch(toggleCart());
                          setLocation('/cart');
                        }}
                      >
                        View Cart
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
