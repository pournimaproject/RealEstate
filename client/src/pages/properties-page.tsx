import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertySearch from "@/components/properties/PropertySearch";
import { Loader2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const PropertiesPage = () => {
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;
  
  // Parse query params
  const queryParams = location.includes('?') ? location.split('?')[1] : '';
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: [`/api/properties?${queryParams}`],
  });
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [queryParams]);
  
  // Calculate pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties ? properties.slice(indexOfFirstProperty, indexOfLastProperty) : [];
  const totalPages = properties ? Math.ceil(properties.length / propertiesPerPage) : 0;
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Helmet>
        <title>Properties - HomeVerse</title>
        <meta name="description" content="Browse our extensive collection of properties for sale and rent." />
      </Helmet>
      
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-2">Properties</h1>
            <p className="text-neutral-100 opacity-90">Browse our extensive collection of properties for sale and rent.</p>
          </div>
          
          <PropertySearch className="mx-auto max-w-5xl" />
        </div>
      </section>
      
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-2">Failed to load properties</p>
              <p className="text-neutral-500">Please try again later or adjust your search criteria.</p>
            </div>
          ) : properties && properties.length > 0 ? (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-neutral-500">
                  Showing {indexOfFirstProperty + 1} - {Math.min(indexOfLastProperty, properties.length)} of {properties.length} properties
                </p>
                <div>
                  <select 
                    className="px-4 py-2 bg-white border border-neutral-200 rounded-md"
                    defaultValue="newest"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="price_low">Price: Low to High</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {currentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) paginate(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            paginate(index + 1);
                          }}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) paginate(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-poppins font-bold text-primary mb-2">No Properties Found</h3>
              <p className="text-neutral-500 mb-8">
                We couldn't find any properties matching your search criteria.
              </p>
              <button 
                className="btn-outline"
                onClick={() => window.location.href = "/properties"}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PropertiesPage;
