import { Link } from "react-router-dom";
import { Menu, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CartTrigger } from "@/components/CartDropdown";

export const Navbar = () => {

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="marketplace-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-marketplace-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gradient">
              BrandHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors font-medium flex items-center"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
          </div>

          {/* Search & Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 w-64"
              />
            </div>
            <CartTrigger />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link 
                    to="/" 
                    className="text-lg font-medium hover:text-primary transition-colors flex items-center"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                  <Link 
                    to="/products" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    Products
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search products..." 
                      className="pl-10"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};