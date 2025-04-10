import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "../properties/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

const RecentProperties = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties", { status: activeFilter !== "all" ? activeFilter : undefined }],
  });

  // Filter properties based on activeFilter
  const filteredProperties = properties && properties.length > 0
    ? activeFilter === "all" 
      ? properties 
      : properties.filter(property => property.status === activeFilter)
    : [];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Skeleton for loading state
  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="block text-secondary font-medium mb-1">Properties</span>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary">Recent Listings</h2>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="w-16 h-10" />
              <Skeleton className="w-16 h-10" />
              <Skeleton className="w-16 h-10" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-60" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load recent properties. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="block text-secondary font-medium mb-1">Properties</span>
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary">Recent Listings</h2>
          </div>
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded ${activeFilter === "all" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500"} font-medium`}
              onClick={() => handleFilterChange("all")}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeFilter === "for_sale" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500"} font-medium hover:bg-neutral-200 transition-colors`}
              onClick={() => handleFilterChange("for_sale")}
            >
              For Sale
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeFilter === "for_rent" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500"} font-medium hover:bg-neutral-200 transition-colors`}
              onClick={() => handleFilterChange("for_rent")}
            >
              For Rent
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p>No {activeFilter !== "all" ? activeFilter.replace("_", " ") : ""} properties available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
        
        {filteredProperties.length > 0 && (
          <div className="mt-10 text-center">
            <button className="px-6 py-3 font-poppins font-medium bg-white border border-accent text-accent rounded-md hover:bg-accent hover:text-white transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentProperties;
