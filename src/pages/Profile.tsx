import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Package, DollarSign, Heart } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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
  }, [isAuthenticated, isLoading, toast]);

  const { data: orders } = useQuery({
    queryKey: ['/api/orders'],
    enabled: isAuthenticated,
  });

  const { data: wishlistItems } = useQuery({
    queryKey: ['/api/wishlist'],
    enabled: isAuthenticated,
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
            <div className="bg-gradient-to-r from-navy-800 to-navy-600 text-white p-8 rounded-t-2xl">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-white bg-opacity-20 rounded w-48"></div>
                  <div className="h-4 bg-white bg-opacity-20 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

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
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-navy-800 to-navy-600 text-white p-8">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.email
                    }
                  </h1>
                  <p className="text-navy-200">{user.email}</p>
                  <p className="text-navy-200">
                    Member since: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Account Overview */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Account Overview</h3>
                  <div className="space-y-4">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Package className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {orders?.length || 0}
                            </div>
                            <div className="text-sm text-gray-600">Total Orders</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-8 w-8 text-green-600" />
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ${totalSpent.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Total Spent</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-orange-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Heart className="h-8 w-8 text-orange-600" />
                          <div>
                            <div className="text-2xl font-bold text-orange-600">
                              {wishlistItems?.length || 0}
                            </div>
                            <div className="text-sm text-gray-600">Wishlist Items</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold mb-6">Order History</h3>
                  <div className="space-y-4">
                    {orders && orders.length > 0 ? (
                      orders.slice(0, 5).map((order) => (
                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="font-semibold">
                                  Order #{order.id.slice(0, 8).toUpperCase()}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-navy-800">
                                ${Number(order.total).toFixed(2)}
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h4>
                        <p className="text-gray-500">Start shopping to see your orders here.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
