import { Link } from "wouter";
import { 
  Laptop, 
  Shirt, 
  Home, 
  Dumbbell, 
  Book, 
  Heart,
  Smartphone,
  Watch,
  Gamepad2,
  Car
} from "lucide-react";
import type { Category } from "@shared/schema";

interface CategoryGridProps {
  categories: Category[];
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  electronics: Laptop,
  fashion: Shirt,
  home: Home,
  sports: Dumbbell,
  books: Book,
  health: Heart,
  phones: Smartphone,
  watches: Watch,
  gaming: Gamepad2,
  automotive: Car,
};

const categoryColors = [
  "from-blue-50 to-blue-100 text-blue-600",
  "from-pink-50 to-pink-100 text-pink-600", 
  "from-green-50 to-green-100 text-green-600",
  "from-yellow-50 to-yellow-100 text-yellow-600",
  "from-purple-50 to-purple-100 text-purple-600",
  "from-red-50 to-red-100 text-red-600",
  "from-indigo-50 to-indigo-100 text-indigo-600",
  "from-orange-50 to-orange-100 text-orange-600",
  "from-teal-50 to-teal-100 text-teal-600",
  "from-gray-50 to-gray-100 text-gray-600",
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12">Shop by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[category.name.toLowerCase()] || Home;
            const colorClass = categoryColors[index % categoryColors.length];
            
            return (
              <Link 
                key={category.id} 
                href={`/products?category=${category.id}`}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 text-center hover:shadow-lg transition-all transform group-hover:scale-105`}>
                  <IconComponent className="w-12 h-12 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                  {category.description && (
                    <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
