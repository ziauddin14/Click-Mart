import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, DollarSign, Users, Plus } from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    brand: '',
    imageUrl: '',
    inStock: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (!isLoading && isAuthenticated && user && !user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      window.location.href = "/";
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const { data: orders } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: () => fetch('/api/orders?all=true').then(res => res.json()),
    enabled: isAuthenticated && user?.isAdmin,
  });

  const createProductMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/products', {
        ...productForm,
        price: productForm.price,
        salePrice: productForm.salePrice || null,
        inStock: parseInt(productForm.inStock) || 0,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "Product has been created successfully.",
      });
      setProductForm({
        name: '',
        description: '',
        price: '',
        salePrice: '',
        categoryId: '',
        brand: '',
        imageUrl: '',
        inStock: '',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-300 rounded-2xl p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user.isAdmin) {
    return null;
  }

  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{products?.length || 0}</div>
                    <div className="text-blue-100">Total Products</div>
                  </div>
                  <Package className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{orders?.length || 0}</div>
                    <div className="text-green-100">Total Orders</div>
                  </div>
                  <ShoppingCart className="h-12 w-12 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">${totalRevenue.toFixed(0)}</div>
                    <div className="text-orange-100">Total Revenue</div>
                  </div>
                  <DollarSign className="h-12 w-12 text-orange-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">2,456</div>
                    <div className="text-purple-100">Total Users</div>
                  </div>
                  <Users className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Product Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Product
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter product name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="salePrice">Sale Price (Optional)</Label>
                        <Input
                          id="salePrice"
                          type="number"
                          step="0.01"
                          value={productForm.salePrice}
                          onChange={(e) => setProductForm(prev => ({ ...prev, salePrice: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={productForm.categoryId} onValueChange={(value) => setProductForm(prev => ({ ...prev, categoryId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={productForm.brand}
                          onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                          placeholder="Brand name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input
                          id="imageUrl"
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="inStock">Stock Quantity</Label>
                        <Input
                          id="inStock"
                          type="number"
                          value={productForm.inStock}
                          onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter product description"
                      />
                    </div>

                    <Button 
                      className="w-full bg-navy-600 hover:bg-orange-500"
                      onClick={() => createProductMutation.mutate()}
                      disabled={createProductMutation.isPending}
                    >
                      {createProductMutation.isPending ? 'Creating...' : 'Add Product'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6">Recent Orders</h3>
                  <div className="space-y-4">
                    {orders?.slice(0, 5).map((order) => (
                      <Card key={order.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-sm">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            User: {order.userId.slice(0, 8)}
                          </div>
                          <div className="text-lg font-bold text-navy-800">
                            ${Number(order.total).toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-6">
                    View All Orders
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
