import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import type { Category } from "@shared/schema";

interface SearchFiltersProps {
  categories: Category[];
  filters: {
    category: string;
    search: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function SearchFilters({ categories, filters, onFiltersChange }: SearchFiltersProps) {
  const handlePriceRangeChange = (range: string) => {
    switch (range) {
      case 'under-50':
        onFiltersChange({ ...filters, minPrice: '', maxPrice: '50' });
        break;
      case '50-100':
        onFiltersChange({ ...filters, minPrice: '50', maxPrice: '100' });
        break;
      case '100-500':
        onFiltersChange({ ...filters, minPrice: '100', maxPrice: '500' });
        break;
      case 'over-500':
        onFiltersChange({ ...filters, minPrice: '500', maxPrice: '' });
        break;
      default:
        onFiltersChange({ ...filters, minPrice: '', maxPrice: '' });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({ ...filters, category: categoryId });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'featured',
    });
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h4 className="text-xl font-bold mb-6">Filters</h4>
        
        {/* Categories */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3">Categories</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="all-categories"
                checked={!filters.category}
                onCheckedChange={() => handleCategoryChange('')}
              />
              <Label htmlFor="all-categories" className="cursor-pointer">
                All Categories
              </Label>
            </div>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={category.id}
                  checked={filters.category === category.id}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <Label htmlFor={category.id} className="cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3">Price Range</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="under-50"
                checked={filters.maxPrice === '50' && !filters.minPrice}
                onCheckedChange={() => handlePriceRangeChange('under-50')}
              />
              <Label htmlFor="under-50" className="cursor-pointer">
                Under $50
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="50-100"
                checked={filters.minPrice === '50' && filters.maxPrice === '100'}
                onCheckedChange={() => handlePriceRangeChange('50-100')}
              />
              <Label htmlFor="50-100" className="cursor-pointer">
                $50 - $100
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="100-500"
                checked={filters.minPrice === '100' && filters.maxPrice === '500'}
                onCheckedChange={() => handlePriceRangeChange('100-500')}
              />
              <Label htmlFor="100-500" className="cursor-pointer">
                $100 - $500
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="over-500"
                checked={filters.minPrice === '500' && !filters.maxPrice}
                onCheckedChange={() => handlePriceRangeChange('over-500')}
              />
              <Label htmlFor="over-500" className="cursor-pointer">
                Over $500
              </Label>
            </div>
          </div>
        </div>

        {/* Customer Rating */}
        <div className="mb-6">
          <h5 className="font-semibold mb-3">Customer Rating</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="5-stars" />
              <Label htmlFor="5-stars" className="flex items-center cursor-pointer">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                5 Stars
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="4-stars" />
              <Label htmlFor="4-stars" className="flex items-center cursor-pointer">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <Star className="h-4 w-4" />
                </div>
                4+ Stars
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="3-stars" />
              <Label htmlFor="3-stars" className="flex items-center cursor-pointer">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <Star className="h-4 w-4" />
                  <Star className="h-4 w-4" />
                </div>
                3+ Stars
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full bg-navy-600 hover:bg-orange-500 text-white"
            onClick={() => onFiltersChange(filters)}
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
