import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Property, insertInquirySchema } from "@shared/schema";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Ruler, 
  Calendar, 
  FileText, 
  Heart, 
  Share2, 
  Home,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

// Define the form schema for property inquiry
const inquiryFormSchema = insertInquirySchema.extend({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

const PropertyDetailPage = () => {
  const [match, params] = useRoute("/properties/:id");
  const propertyId = params?.id ? parseInt(params.id) : 0;
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Query to fetch property details
  const { 
    data: property, 
    isLoading, 
    error 
  } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });
  
  // Form for property inquiry
  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "",
      email: user?.email || "",
      phone: user?.phone || "",
      message: `I'm interested in this property (ID: ${propertyId}). Please provide more information.`,
      propertyId: propertyId,
      userId: user?.id,
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: InquiryFormValues) => {
    try {
      const response = await apiRequest("POST", "/api/inquiries", data);
      
      if (response.ok) {
        toast({
          title: "Inquiry Submitted",
          description: "We've received your inquiry and will contact you soon.",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Helper function to get image URLs
  const getImageUrls = (property: Property) => {
    const images = property.images as string[];
    
    if (images && images.length > 0) {
      return images;
    }
    
    // Return default images if no property images
    return [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ];
  };
  
  // Toggle favorite
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save properties to favorites",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await apiRequest("DELETE", `/api/favorites/${property?.id}`);
        setIsFavorite(false);
        
        toast({
          title: "Removed from favorites",
          description: "Property has been removed from your favorites",
        });
      } else {
        // Add to favorites
        await apiRequest("POST", "/api/favorites", { propertyId: property?.id });
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
  
  // Share property function
  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      })
      .catch(() => {
        // Copy to clipboard if share fails
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Property link has been copied to clipboard",
        });
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Property link has been copied to clipboard",
      });
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[500px] w-full mb-4 rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-12 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-40 w-full mb-4 rounded-lg" />
            <Skeleton className="h-60 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Property Not Found</h2>
        <p className="text-neutral-500 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/properties">Browse Other Properties</Link>
        </Button>
      </div>
    );
  }
  
  const images = getImageUrls(property);
  const features = property.features as string[];

  return (
    <>
      <Helmet>
        <title>{property.title} - HomeVerse</title>
        <meta name="description" content={property.description.substring(0, 160)} />
      </Helmet>
      
      <div className="bg-neutral-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm mb-6">
            <Link href="/">
              <a className="text-neutral-500 hover:text-primary">Home</a>
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <Link href="/properties">
              <a className="text-neutral-500 hover:text-primary">Properties</a>
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="text-primary font-medium">{property.title}</span>
          </div>
          
          {/* Property Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-poppins font-bold text-primary mb-2">{property.title}</h1>
              <div className="flex items-center text-neutral-500">
                <MapPin className="h-4 w-4 mr-1 text-secondary" />
                <span>{`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <h2 className="text-xl md:text-2xl font-poppins font-bold text-secondary">
                {property.status === "for_rent" 
                  ? `${formatPrice(property.price)}/mo` 
                  : formatPrice(property.price)}
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Image Gallery */}
            <div className="lg:col-span-2">
              <Carousel className="mb-4">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <AspectRatio ratio={16 / 9}>
                        <img 
                          src={image} 
                          alt={`${property.title} - Image ${index + 1}`} 
                          className="rounded-lg w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="h-20 w-full object-cover rounded cursor-pointer"
                  />
                ))}
              </div>
              
              {/* Property Actions */}
              <div className="flex mt-4 space-x-4">
                <Button 
                  variant="outline" 
                  onClick={toggleFavorite}
                  className={isFavorite ? "text-secondary border-secondary" : ""}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-secondary text-secondary" : ""}`} />
                  {isFavorite ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" onClick={shareProperty}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
              
              {/* Property Details Tabs */}
              <Tabs defaultValue="details" className="mt-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Property Details</CardTitle>
                      <CardDescription>
                        Complete information about this property
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg">
                          <Bed className="h-5 w-5 text-secondary mb-1" />
                          <span className="text-sm text-neutral-500">Bedrooms</span>
                          <span className="font-medium">{property.bedrooms}</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg">
                          <Bath className="h-5 w-5 text-secondary mb-1" />
                          <span className="text-sm text-neutral-500">Bathrooms</span>
                          <span className="font-medium">{property.bathrooms}</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg">
                          <Ruler className="h-5 w-5 text-secondary mb-1" />
                          <span className="text-sm text-neutral-500">Area</span>
                          <span className="font-medium">{property.area.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-secondary mb-1" />
                          <span className="text-sm text-neutral-500">Year Built</span>
                          <span className="font-medium">{property.yearBuilt || "N/A"}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-poppins font-semibold text-primary text-lg mb-2">Description</h3>
                        <p className="text-neutral-600 whitespace-pre-line mb-4">{property.description}</p>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-neutral-500">Property ID</span>
                            <span className="font-medium">{property.id}</span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-neutral-500">Property Type</span>
                            <span className="font-medium capitalize">{property.propertyType.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-neutral-500">Status</span>
                            <span className="font-medium capitalize">{property.status.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-neutral-500">Country</span>
                            <span className="font-medium">{property.country}</span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-neutral-500">City</span>
                            <span className="font-medium">{property.city}</span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-neutral-500">ZIP Code</span>
                            <span className="font-medium">{property.zipCode}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="features" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Features & Amenities</CardTitle>
                      <CardDescription>
                        Special features of this property
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {features && features.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                              <span className="text-neutral-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500">No specific features listed for this property.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="location" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Location Information</CardTitle>
                      <CardDescription>
                        Property location and surrounding area
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h3 className="font-poppins font-medium text-primary mb-2">Address</h3>
                        <p className="text-neutral-600">
                          {property.address}, {property.city}, {property.state} {property.zipCode}, {property.country}
                        </p>
                      </div>
                      
                      {/* Map placeholder - would normally use Google Maps or Mapbox */}
                      <div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center">
                        <div className="text-center p-6">
                          <MapPin className="h-8 w-8 text-secondary mx-auto mb-2" />
                          <p className="text-neutral-500">
                            Interactive map would be displayed here using Google Maps or Mapbox API
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent/Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Contact Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Agent" 
                      className="w-16 h-16 rounded-full mr-4" 
                    />
                    <div>
                      <h4 className="font-medium text-primary">HomeVerse Agent</h4>
                      <p className="text-sm text-neutral-500">Real Estate Agent</p>
                      <p className="text-sm text-accent">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Your message" 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <input type="hidden" {...form.register("propertyId")} />
                      {user && <input type="hidden" {...form.register("userId")} />}
                      
                      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              {/* Similar Properties Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Similar Properties</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {/* Use a query to fetch similar properties (not implemented here) */}
                    <div className="p-4 border-b">
                      <div className="flex">
                        <div className="w-24 h-20 flex-shrink-0 mr-3">
                          <img 
                            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                            alt="Similar property" 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-sm line-clamp-1">Modern Family Home</h5>
                          <p className="text-secondary font-medium text-sm">$320,000</p>
                          <div className="flex items-center text-xs text-neutral-500">
                            <Bed className="h-3 w-3 mr-1" />
                            <span className="mr-2">3</span>
                            <Bath className="h-3 w-3 mr-1" />
                            <span>2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b">
                      <div className="flex">
                        <div className="w-24 h-20 flex-shrink-0 mr-3">
                          <img 
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                            alt="Similar property" 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-sm line-clamp-1">Luxury Condo with View</h5>
                          <p className="text-secondary font-medium text-sm">$450,000</p>
                          <div className="flex items-center text-xs text-neutral-500">
                            <Bed className="h-3 w-3 mr-1" />
                            <span className="mr-2">2</span>
                            <Bath className="h-3 w-3 mr-1" />
                            <span>2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex">
                        <div className="w-24 h-20 flex-shrink-0 mr-3">
                          <img 
                            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                            alt="Similar property" 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-sm line-clamp-1">Downtown Apartment</h5>
                          <p className="text-secondary font-medium text-sm">$1,800/mo</p>
                          <div className="flex items-center text-xs text-neutral-500">
                            <Bed className="h-3 w-3 mr-1" />
                            <span className="mr-2">1</span>
                            <Bath className="h-3 w-3 mr-1" />
                            <span>1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Featured Properties Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-secondary mr-2" />
                    <CardTitle>Popular Searches</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/properties?location=New+York">
                      <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-neutral-200 transition-colors">
                        New York
                      </a>
                    </Link>
                    <Link href="/properties?propertyType=apartment">
                      <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-neutral-200 transition-colors">
                        Apartments
                      </a>
                    </Link>
                    <Link href="/properties?priceMin=500000&priceMax=1000000">
                      <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-neutral-200 transition-colors">
                        $500k - $1M
                      </a>
                    </Link>
                    <Link href="/properties?bedrooms=3">
                      <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-neutral-200 transition-colors">
                        3+ Bedrooms
                      </a>
                    </Link>
                    <Link href="/properties?location=Los+Angeles">
                      <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-neutral-200 transition-colors">
                        Los Angeles
                      </a>
                    </Link>
                    <Link href="/properties?propertyType=house">
                      <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-neutral-200 transition-colors">
                        Houses
                      </a>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetailPage;
