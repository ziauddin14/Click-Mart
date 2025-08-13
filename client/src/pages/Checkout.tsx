import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock, CreditCard } from "lucide-react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

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

  const { data: cartItems } = useQuery({
    queryKey: ['/api/cart'],
    enabled: isAuthenticated,
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const total = cartItems?.reduce((sum, item) => {
        const price = Number(item.product.salePrice || item.product.price);
        return sum + (price * item.quantity);
      }, 0) || 0;
      
      const subtotal = total;
      const tax = total * 0.08;
      const finalTotal = total + tax;

      const orderItems = cartItems?.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
      })) || [];

      const response = await apiRequest('POST', '/api/orders', {
        status: 'pending',
        total: finalTotal.toFixed(2),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shippingAddress: shippingData,
        paymentMethod,
        orderItems,
      });
      return response.json();
    },
    onSuccess: (order) => {
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been placed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setLocation('/profile');
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
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
          <Button onClick={() => setLocation('/products')}>
            Start Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.product.salePrice || item.product.price);
    return sum + (price * item.quantity);
  }, 0);

  const tax = total * 0.08;
  const finalTotal = total + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-12">Secure Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 ${step >= 1 ? 'bg-navy-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center font-semibold`}>
                1
              </div>
              <span className={`ml-2 font-semibold ${step >= 1 ? 'text-navy-600' : 'text-gray-600'}`}>
                Shipping
              </span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 ${step >= 2 ? 'bg-navy-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center font-semibold`}>
                2
              </div>
              <span className={`ml-2 ${step >= 2 ? 'text-navy-600' : 'text-gray-600'}`}>
                Payment
              </span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 ${step >= 3 ? 'bg-navy-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center font-semibold`}>
                3
              </div>
              <span className={`ml-2 ${step >= 3 ? 'text-navy-600' : 'text-gray-600'}`}>
                Review
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                {step === 1 && (
                  <>
                    <h3 className="text-xl font-bold mb-6">Shipping Information</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={shippingData.firstName}
                            onChange={(e) => setShippingData(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={shippingData.lastName}
                            onChange={(e) => setShippingData(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => setShippingData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john.doe@example.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingData.phone}
                          onChange={(e) => setShippingData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={shippingData.address}
                          onChange={(e) => setShippingData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={shippingData.city}
                            onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Select value={shippingData.state} onValueChange={(value) => setShippingData(prev => ({ ...prev, state: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NY">NY</SelectItem>
                              <SelectItem value="CA">CA</SelectItem>
                              <SelectItem value="TX">TX</SelectItem>
                              <SelectItem value="FL">FL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={shippingData.zipCode}
                            onChange={(e) => setShippingData(prev => ({ ...prev, zipCode: e.target.value }))}
                            placeholder="10001"
                          />
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-navy-600 hover:bg-navy-700"
                        onClick={() => setStep(2)}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="text-xl font-bold mb-6">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-2 p-4 border border-gray-300 rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <Label htmlFor="card">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border border-gray-300 rounded-lg">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <div className="w-5 h-5 bg-blue-600 rounded"></div>
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                    </RadioGroup>

                    <div className="flex space-x-4 mt-6">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button 
                        className="flex-1 bg-navy-600 hover:bg-navy-700"
                        onClick={() => setStep(3)}
                      >
                        Review Order
                      </Button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className="text-xl font-bold mb-6">Review Your Order</h3>
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <p className="text-gray-600">
                          {shippingData.firstName} {shippingData.lastName}<br />
                          {shippingData.address}<br />
                          {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Payment Method</h4>
                        <p className="text-gray-600">
                          {paymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal'}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Order Items</h4>
                        <div className="space-y-2">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.product.name} × {item.quantity}</span>
                              <span>${(Number(item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button 
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        onClick={() => createOrderMutation.mutate()}
                        disabled={createOrderMutation.isPending}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-navy-800">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <Lock className="h-4 w-4 inline mr-1" />
                  SSL Secured Checkout
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
