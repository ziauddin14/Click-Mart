import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products', id],
  });

  const { data: reviews } = useQuery({
    queryKey: ['/api/products', id, 'reviews'],
  });

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => item.productId === id);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/cart', {
        productId: id,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Please sign in",
          description: "You need to sign in to add items to cart.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/wishlist', {
        productId: id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Please sign in",
          description: "You need to sign in to add items to wishlist.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add product to wishlist.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-300 rounded-xl"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-20 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-10 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Product not found</h2>
          <Button onClick={() => setLocation('/products')}>
            Browse Products
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const discount = product.salePrice ? Math.round(((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img 
                src={images[selectedImage] || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"} 
                alt={product.name} 
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <img 
                  key={index}
                  src={image || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
                  alt={`${product.name} view ${index + 1}`}
                  className={`rounded-lg cursor-pointer hover:opacity-75 transition-opacity ${
                    selectedImage === index ? 'ring-2 ring-navy-600' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(Number(product.rating)) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
                <Badge variant={product.inStock > 0 ? "default" : "destructive"}>
                  {product.inStock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl font-bold text-navy-800">
                  ${product.salePrice || product.price}
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${product.price}</span>
                    <Badge className="bg-red-500">{discount}% OFF</Badge>
                  </>
                )}
              </div>
              {product.salePrice && (
                <p className="text-green-600 font-semibold">
                  You save ${(Number(product.price) - Number(product.salePrice)).toFixed(2)}!
                </p>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-3">Quantity:</h4>
              <div className="flex items-center space-x-4">
                <div className="flex border border-gray-300 rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center py-2 border-l border-r border-gray-300">
                    {quantity}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                    disabled={quantity >= product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-gray-600">Only {product.inStock} left in stock</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending || product.inStock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline"
                className="border-navy-600 text-navy-600 hover:bg-navy-600 hover:text-white"
                onClick={() => addToWishlistMutation.mutate()}
                disabled={addToWishlistMutation.isPending || isInWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3">Description:</h4>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {product.brand && (
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-2">Brand:</h4>
                <p className="text-gray-700">{product.brand}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h4 className="text-xl font-bold mb-6">Customer Reviews</h4>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-10 h-10 bg-navy-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.userId.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">User {review.userId.slice(0, 8)}</div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
