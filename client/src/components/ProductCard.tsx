import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Link } from "wouter";
import { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => item.productId === product.id);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/cart', {
        productId: product.id,
        quantity: 1,
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
        productId: product.id,
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

  const discount = product.salePrice 
    ? Math.round(((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100) 
    : 0;

  return (
    <Card className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden group">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <img 
            src={product.imageUrl || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
            -{discount}%
          </Badge>
        )}
        
        {product.inStock === 0 && (
          <Badge className="absolute top-3 left-3 bg-gray-500 text-white">
            Out of Stock
          </Badge>
        )}
        
        {product.inStock > 0 && product.inStock < 10 && (
          <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
            Limited
          </Badge>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => addToWishlistMutation.mutate()}
          disabled={addToWishlistMutation.isPending || isInWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md hover:bg-red-50 p-0"
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h4 className="font-semibold text-gray-900 mb-2 hover:text-navy-600 transition-colors">
            {product.name}
          </h4>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(Number(product.rating)) ? 'fill-current' : ''}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviewCount} reviews)</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-navy-800">
              ${product.salePrice || product.price}
            </span>
            {product.salePrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.price}
              </span>
            )}
          </div>
          
          <Button
            onClick={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending || product.inStock === 0}
            className="bg-navy-600 hover:bg-orange-500 text-white p-2"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        
        {product.brand && (
          <div className="mt-2 text-sm text-gray-600">
            Brand: {product.brand}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
