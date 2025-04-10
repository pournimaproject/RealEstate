import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertySearchProps {
  className?: string;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ className }) => {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
    bedrooms: "",
    bathrooms: "",
    status: ""
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Get URL search parameters
  const currentUrl = typeof window !== "undefined" ? window.location.search : "";
  
  useEffect(() => {
    if (currentUrl) {
      const params = new URLSearchParams(currentUrl);
      
      // Set search parameters from URL
      setSearchParams({
        location: params.get("location") || "",
        propertyType: params.get("propertyType") || "",
        priceRange: params.get("priceMin") && params.get("priceMax") 
          ? `${params.get("priceMin")}-${params.get("priceMax")}`
          : params.get("priceMin") 
            ? `${params.get("priceMin")}-` 
            : params.get("priceMax") 
              ? `-${params.get("priceMax")}` 
              : "",
        bedrooms: params.get("bedrooms") || "",
        bathrooms: params.get("bathrooms") || "",
        status: params.get("status") || ""
      });
      
      // Show advanced search if any advanced parameters are set
      if (params.get("bedrooms") || params.get("bathrooms") || params.get("status")) {
        setShowAdvanced(true);
      }
    }
  }, [currentUrl]);
  
  const handleInputChange = (name: string, value: string) => {
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    
    if (searchParams.location) params.append("location", searchParams.location);
    if (searchParams.propertyType && searchParams.propertyType !== "any") params.append("propertyType", searchParams.propertyType);
    
    if (searchParams.priceRange && searchParams.priceRange !== "any") {
      const [min, max] = searchParams.priceRange.split("-");
      if (min) params.append("priceMin", min);
      if (max) params.append("priceMax", max);
    }
    
    if (searchParams.bedrooms && searchParams.bedrooms !== "any") params.append("bedrooms", searchParams.bedrooms);
    if (searchParams.bathrooms && searchParams.bathrooms !== "any") params.append("bathrooms", searchParams.bathrooms);
    if (searchParams.status && searchParams.status !== "any") params.append("status", searchParams.status);
    
    // Navigate to properties page with filters
    setLocation(`/properties?${params.toString()}`);
  };
  
  const toggleAdvancedSearch = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 md:p-6 ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Location</label>
            <Input
              placeholder="City, State, or ZIP"
              value={searchParams.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Property Type</label>
            <Select 
              value={searchParams.propertyType} 
              onValueChange={(value) => handleInputChange("propertyType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Type</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Price Range</label>
            <Select 
              value={searchParams.priceRange} 
              onValueChange={(value) => handleInputChange("priceRange", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="0-200000">$0 - $200k</SelectItem>
                <SelectItem value="200000-300000">$200k - $300k</SelectItem>
                <SelectItem value="300000-500000">$300k - $500k</SelectItem>
                <SelectItem value="500000-1000000">$500k - $1M</SelectItem>
                <SelectItem value="1000000-">$1M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button type="submit" className="w-full" variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
        
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Bedrooms</label>
              <Select 
                value={searchParams.bedrooms} 
                onValueChange={(value) => handleInputChange("bedrooms", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Bathrooms</label>
              <Select 
                value={searchParams.bathrooms} 
                onValueChange={(value) => handleInputChange("bathrooms", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Status</label>
              <Select 
                value={searchParams.status} 
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="for_sale">For Sale</SelectItem>
                  <SelectItem value="for_rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-left">
          <button 
            type="button"
            className="text-accent hover:text-accent-dark font-medium text-sm flex items-center"
            onClick={toggleAdvancedSearch}
          >
            <span>{showAdvanced ? "Hide Advanced Search" : "Advanced Search"}</span>
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertySearch;
