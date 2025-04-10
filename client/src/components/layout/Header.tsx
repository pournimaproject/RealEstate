import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Home, Menu, X, UserPlus, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Home className="text-secondary text-3xl" />
            <Link href="/" className="text-2xl font-poppins font-bold text-primary">
              HomeVerse
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`font-poppins font-medium ${location === "/" ? "text-primary" : "text-neutral-400"} hover:text-secondary transition-colors`}>
              Home
            </Link>
            <Link href="/properties" className={`font-poppins font-medium ${location === "/properties" ? "text-primary" : "text-neutral-400"} hover:text-secondary transition-colors`}>
              Properties
            </Link>
            <Link href="/contact" className={`font-poppins font-medium ${location === "/contact" ? "text-primary" : "text-neutral-400"} hover:text-secondary transition-colors`}>
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                {(user.role === "seller" || user.role === "agent" || user.role === "admin") && (
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/add-property">Add Property</Link>
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/auth?register=true">Register</Link>
                </Button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-neutral-500 hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-4 py-2">
          <nav className="flex flex-col space-y-3 py-3">
            <Link href="/">
              <a 
                className={`font-poppins font-medium ${location === "/" ? "text-primary" : "text-neutral-400"} hover:text-secondary transition-colors`}
                onClick={closeMobileMenu}
              >
                Home
              </a>
            </Link>
            <Link href="/properties">
              <a 
                className={`font-poppins font-medium ${location === "/properties" ? "text-primary" : "text-neutral-400"} hover:text-secondary transition-colors`}
                onClick={closeMobileMenu}
              >
                Properties
              </a>
            </Link>
            <Link href="/contact">
              <a 
                className={`font-poppins font-medium ${location === "/contact" ? "text-primary" : "text-neutral-400"} hover:text-secondary transition-colors`}
                onClick={closeMobileMenu}
              >
                Contact
              </a>
            </Link>
            
            <div className="flex flex-col space-y-2 pt-2 border-t border-neutral-100">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <a 
                      className="px-4 py-2 text-sm font-poppins font-medium text-white bg-accent rounded-md hover:bg-accent-dark transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </a>
                  </Link>
                  {(user.role === "seller" || user.role === "agent" || user.role === "admin") && (
                    <Link href="/add-property">
                      <a 
                        className="px-4 py-2 text-sm font-poppins font-medium text-white bg-secondary rounded-md hover:bg-secondary-dark transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Add Property
                      </a>
                    </Link>
                  )}
                  <button 
                    className="px-4 py-2 text-sm font-poppins font-medium text-neutral-500 bg-neutral-100 rounded-md hover:bg-neutral-200 transition-colors"
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <a 
                      className="px-4 py-2 text-sm font-poppins font-medium text-white bg-accent rounded-md hover:bg-accent-dark transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Sign In
                    </a>
                  </Link>
                  <Link href="/auth?register=true">
                    <a 
                      className="px-4 py-2 text-sm font-poppins font-medium text-white bg-secondary rounded-md hover:bg-secondary-dark transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Register
                    </a>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
