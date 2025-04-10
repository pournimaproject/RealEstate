import { useState } from "react";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Heart, MapPin, Bed, Bath, Ruler } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const propertyDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - propertyDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }
  };
  
  const getImageUrl = (property: Property) => {
    const images = property.images as string[];
    if (images && images.length > 0) {
      return images[0];
    }
    
    // Return default image based on property type
    switch (property.propertyType) {
      case "house":
        return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
      case "apartment":
        return "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
      case "condo":
        return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
      case "villa":
        return "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
      default:
        return "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "for_sale":
        return "For Sale";
      case "for_rent":
        return "For Rent";
      case "sold":
        return "Sold";
      case "rented":
        return "Rented";
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "for_sale":
        return "bg-secondary text-white";
      case "for_rent":
        return "bg-accent text-white";
      case "sold":
        return "bg-neutral-700 text-white";
      case "rented":
        return "bg-neutral-700 text-white";
      default:
        return "bg-neutral-500 text-white";
    }
  };
  
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save properties to favorites",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await apiRequest("DELETE", `/api/favorites/${property.id}`);
        setIsFavorite(false);
        
        toast({
          title: "Removed from favorites",
          description: "Property has been removed from your favorites",
        });
      } else {
        // Add to favorites
        await apiRequest("POST", "/api/favorites", { propertyId: property.id });
        setIsFavorite(true);
        
        toast({
          title: "Added to favorites",
          description: "Property has been added to your favorites",
        });
      }
      
      // Invalidate favorites query
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Link href={`/properties/${property.id}`} className="block">
          <img 
            src={getImageUrl(property)} 
            alt={property.title} 
            className="w-full h-60 object-cover"
          />
        </Link>
        <Badge className={`absolute top-4 left-4 ${getStatusColor(property.status)} text-sm font-medium px-2 py-1 rounded`}>
          {getStatusLabel(property.status)}
        </Badge>
        <button 
          className={`absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full ${isFavorite ? 'text-secondary' : 'text-neutral-500'} hover:text-secondary transition-colors`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={isFavorite ? "fill-secondary" : ""} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-poppins font-bold text-primary">
            {property.status === "for_rent" 
              ? `${formatPrice(property.price)}/mo` 
              : formatPrice(property.price)}
          </h3>
          <div className="flex items-center text-sm text-neutral-400">
            <MapPin className="mr-1 text-secondary h-4 w-4" />
            <span>{`${property.city}, ${property.state}`}</span>
          </div>
        </div>
        <Link href={`/properties/${property.id}`} className="block">
          <h4 className="font-poppins font-medium text-neutral-500 mb-3 hover:text-secondary transition-colors">
            {property.title}
          </h4>
        </Link>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-neutral-400 text-sm">
            <div className="flex items-center mr-3">
              <Bed className="mr-1 h-4 w-4" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}</span>
            </div>
            <div className="flex items-center mr-3">
              <Bath className="mr-1 h-4 w-4" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}</span>
            </div>
            <div className="flex items-center">
              <Ruler className="mr-1 h-4 w-4" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={"https://randomuser.me/api/portraits/men/32.jpg"} 
              alt="Agent" 
              className="w-8 h-8 rounded-full mr-2" 
            />
            <span className="text-sm text-neutral-500 font-medium">
              {"HomeVerse Agent"}
            </span>
          </div>
          <span className="text-xs text-neutral-400">{property.createdAt ? formatDate(new Date(property.createdAt)) : "Recently added"}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
