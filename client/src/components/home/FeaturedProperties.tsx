import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import PropertyCard from "../properties/PropertyCard";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProperties = () => {
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  // Skeleton for loading state
  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="block text-secondary font-medium mb-1">Properties</span>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary">Featured Listings</h2>
            </div>
            <div className="text-accent font-poppins font-medium">
              View All
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
          <p className="text-red-500">Failed to load featured properties. Please try again later.</p>
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
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary">Featured Listings</h2>
          </div>
          <Link href="/properties">
            <a className="text-accent hover:text-accent-dark font-poppins font-medium transition-colors flex items-center">
              <span>View All</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties && properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p>No featured properties available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
