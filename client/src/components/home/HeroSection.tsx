import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ChevronDown } from "lucide-react";

const HeroSection = () => {
  const [, setLocation] = useLocation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
    bedrooms: "",
    bathrooms: "",
    area: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
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
    if (searchParams.propertyType) params.append("propertyType", searchParams.propertyType);
    
    if (searchParams.priceRange) {
      const [min, max] = searchParams.priceRange.split("-");
      if (min) params.append("priceMin", min);
      if (max) params.append("priceMax", max);
    }
    
    if (searchParams.bedrooms) params.append("bedrooms", searchParams.bedrooms);
    if (searchParams.bathrooms) params.append("bathrooms", searchParams.bathrooms);
    if (searchParams.area) params.append("area", searchParams.area);
    
    // Navigate to properties page with filters
    setLocation(`/properties?${params.toString()}`);
  };

  const toggleAdvancedSearch = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <section className="relative bg-primary">
      <div 
        className="absolute inset-0 bg-black bg-opacity-40" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}
      ></div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-6">Find Your Dream Home</h1>
          <p className="text-lg text-white opacity-90 mb-8">
            Discover the perfect property from our extensive collection of listings across the country.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1 text-left">Location</label>
                <div className="relative">
                  <select 
                    name="location"
                    value={searchParams.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-accent focus:border-accent text-neutral-500 appearance-none"
                  >
                    <option value="" disabled>Select location</option>
                    <option value="New York">New York</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Houston">Houston</option>
                    <option value="Miami">Miami</option>
                    <option value="Seattle">Seattle</option>
                  </select>
                  <div className="absolute right-3 top-2.5 text-neutral-400 pointer-events-none">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1 text-left">Property Type</label>
                <div className="relative">
                  <select 
                    name="propertyType"
                    value={searchParams.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-accent focus:border-accent text-neutral-500 appearance-none"
                  >
                    <option value="" disabled>Select type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="villa">Villa</option>
                  </select>
                  <div className="absolute right-3 top-2.5 text-neutral-400 pointer-events-none">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1 text-left">Price Range</label>
                <div className="relative">
                  <select 
                    name="priceRange"
                    value={searchParams.priceRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-accent focus:border-accent text-neutral-500 appearance-none"
                  >
                    <option value="" disabled>Select range</option>
                    <option value="0-200000">$0 - $200k</option>
                    <option value="200000-300000">$200k - $300k</option>
                    <option value="300000-500000">$300k - $500k</option>
                    <option value="500000-1000000">$500k - $1M</option>
                    <option value="1000000-">$1M+</option>
                  </select>
                  <div className="absolute right-3 top-2.5 text-neutral-400 pointer-events-none">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-end">
                <button type="submit" className="w-full px-6 py-2 text-white font-poppins font-medium bg-secondary rounded-md hover:bg-secondary-dark transition-colors">
                  <div className="flex items-center justify-center">
                    <Search className="h-4 w-4 mr-2" />
                    <span>Search</span>
                  </div>
                </button>
              </div>
            </div>
            
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1 text-left">Bedrooms</label>
                  <div className="relative">
                    <select 
                      name="bedrooms"
                      value={searchParams.bedrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-accent focus:border-accent text-neutral-500 appearance-none"
                    >
                      <option value="" disabled>Select bedrooms</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                    <div className="absolute right-3 top-2.5 text-neutral-400 pointer-events-none">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1 text-left">Bathrooms</label>
                  <div className="relative">
                    <select 
                      name="bathrooms"
                      value={searchParams.bathrooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-accent focus:border-accent text-neutral-500 appearance-none"
                    >
                      <option value="" disabled>Select bathrooms</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                    <div className="absolute right-3 top-2.5 text-neutral-400 pointer-events-none">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1 text-left">Area (sq ft)</label>
                  <div className="relative">
                    <select 
                      name="area"
                      value={searchParams.area}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-md focus:ring-2 focus:ring-accent focus:border-accent text-neutral-500 appearance-none"
                    >
                      <option value="" disabled>Select area</option>
                      <option value="500-1000">500 - 1,000</option>
                      <option value="1000-1500">1,000 - 1,500</option>
                      <option value="1500-2000">1,500 - 2,000</option>
                      <option value="2000-3000">2,000 - 3,000</option>
                      <option value="3000-">3,000+</option>
                    </select>
                    <div className="absolute right-3 top-2.5 text-neutral-400 pointer-events-none">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
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
      </div>
    </section>
  );
};

export default HeroSection;
