
import { useState } from 'react';
import { Zap, User, Menu, X, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  onAuthClick: () => void;
}

const Header = ({ onAuthClick }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be connected to Supabase auth later

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ChargeEase</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Find Stations
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Trip Planner
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Community
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Support
            </a>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  My Locations
                </Button>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-white text-sm">
                    JD
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={onAuthClick}>
                  Sign In
                </Button>
                <Button onClick={onAuthClick} className="gradient-bg text-white">
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-primary transition-colors font-medium px-4">
                Find Stations
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors font-medium px-4">
                Trip Planner
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors font-medium px-4">
                Community
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors font-medium px-4">
                Support
              </a>
              <div className="px-4 pt-4 border-t flex flex-col space-y-2">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-white text-sm">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">John Doe</span>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" onClick={onAuthClick} className="w-full">
                      Sign In
                    </Button>
                    <Button onClick={onAuthClick} className="w-full gradient-bg text-white">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
