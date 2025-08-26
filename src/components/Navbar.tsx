import { Link } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="marketplace-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-gradient">BrandHub</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden md:inline-flex">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};