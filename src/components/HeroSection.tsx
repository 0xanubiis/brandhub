// Removed unused React import
import { Search } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onShopNowClick: () => void;
}

export function HeroSection({ searchQuery, onSearchChange, onShopNowClick }: HeroSectionProps) {
  return (
    <div className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Glass Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center animate-fadeUp">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300 mb-6">
            Your Brands In One Place
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-300 sm:text-xl">
            Discover our latest arrivals featuring breathable fabrics and modern designs.
          </p>
          
          {/* Search Bar with Enhanced Glass Effect */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-6 py-4 text-white bg-white/10 backdrop-blur-xl rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder-gray-400 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* CTA Button with Glass Effect */}
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center">
            <button
              onClick={onShopNowClick}
              className="w-full sm:w-auto px-8 py-4 text-white font-medium bg-white/20 backdrop-blur-xl rounded-full hover:bg-white/30 transform hover:scale-105 transition-all duration-200 shadow-[0_4px_12px_rgba(255,255,255,0.1)] border border-white/20"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Animated glass shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full backdrop-blur-xl animate-float border border-white/20"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full backdrop-blur-xl animate-float border border-white/20"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full backdrop-blur-xl animate-float border border-white/20"
          style={{ animationDelay: '4s' }}
        />
      </div>
    </div>
  );
}