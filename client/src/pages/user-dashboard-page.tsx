import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Property, User } from "@shared/schema";
import {
  User as UserIcon,
  Home,
  Heart,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Pencil,
  LogOut,
  Loader2,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserDashboardPage = () => {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  
  // Fetch user properties
  const {
    data: properties,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useQuery<Property[]>({
    queryKey: ["/api/user/properties"],
    enabled: !!user,
  });
  
  // Fetch favorites
  const {
    data: favorites,
    isLoading: favoritesLoading,
    error: favoritesError,
  } = useQuery<any[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });
  
  // Fetch inquiries
  const {
    data: inquiries,
    isLoading: inquiriesLoading,
    error: inquiriesError,
  } = useQuery<any[]>({
    queryKey: ["/api/inquiries"],
    enabled: !!user,
  });
  
  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      await apiRequest("DELETE", `/api/properties/${propertyId}`);
    },
    onSuccess: () => {
      toast({
        title: "Property Deleted",
        description: "The property has been successfully removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/properties"] });
      setPropertyToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  // Get user initials for avatar fallback
  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName[0].toUpperCase();
    } else if (user.lastName) {
      return user.lastName[0].toUpperCase();
    } else {
      return user.username[0].toUpperCase();
    }
  };
  
  const handleDeleteProperty = (propertyId: number) => {
    setPropertyToDelete(propertyId);
  };
  
  const confirmDeleteProperty = () => {
    if (propertyToDelete) {
      deletePropertyMutation.mutate(propertyToDelete);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <>
      <Helmet>
        <title>Dashboard - HomeVerse</title>
        <meta name="description" content="Manage your properties, favorites, and account settings." />
      </Helmet>
      
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-100 opacity-90">Manage your properties, favorites, and account settings</p>
        </div>
      </section>
      
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* User Info Sidebar */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="text-lg bg-accent text-white">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-poppins font-bold text-primary">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.username}
                  </h2>
                  <Badge className="mt-2 capitalize">{user.role.replace('_', ' ')}</Badge>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <UserIcon className="h-5 w-5 mr-3 text-secondary mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-500">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-secondary mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-secondary mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-500">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <Home className="h-5 w-5 mr-3 text-secondary mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-500">Properties</p>
                      <p className="font-medium">{properties ? properties.length : 0}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex flex-col space-y-3">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="#">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="justify-start"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="properties">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="properties" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">My Properties</span>
                    <span className="sm:hidden">Properties</span>
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Saved Properties</span>
                    <span className="sm:hidden">Favorites</span>
                  </TabsTrigger>
                  <TabsTrigger value="inquiries" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">My Inquiries</span>
                    <span className="sm:hidden">Inquiries</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Properties Tab */}
                <TabsContent value="properties">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>My Properties</CardTitle>
                        <CardDescription>
                          Manage your property listings
                        </CardDescription>
                      </div>
                      
                      {(user.role === "seller" || user.role === "agent" || user.role === "admin") && (
                        <Button asChild>
                          <Link href="/add-property">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Property
                          </Link>
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      {propertiesLoading ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        </div>
                      ) : propertiesError ? (
                        <div className="text-center py-12">
                          <p className="text-red-500">Failed to load properties</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/user/properties"] })}
                          >
                            Retry
                          </Button>
                        </div>
                      ) : properties && properties.length > 0 ? (
                        <div className="space-y-4">
                          {properties.map((property) => (
                            <div key={property.id} className="flex flex-col md:flex-row border rounded-lg overflow-hidden">
                              <div className="md:w-1/4 h-48 md:h-auto">
                                <img 
                                  src={(property.images as string[])[0] || "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                                  alt={property.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4 md:p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="text-lg font-poppins font-semibold text-primary">{property.title}</h3>
                                    <div className="flex items-center text-sm text-neutral-500 mb-2">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      <span>{property.city}, {property.state}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <Badge className={property.status === "for_sale" ? "bg-secondary" : "bg-accent"}>
                                      {property.status === "for_sale" ? "For Sale" : "For Rent"}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm mb-2">
                                  <div className="flex items-center">
                                    <span className="font-medium">{property.bedrooms}</span>
                                    <span className="text-neutral-500 ml-1">beds</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium">{property.bathrooms}</span>
                                    <span className="text-neutral-500 ml-1">baths</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium">{property.area.toLocaleString()}</span>
                                    <span className="text-neutral-500 ml-1">sq ft</span>
                                  </div>
                                </div>
                                
                                <p className="text-neutral-600 line-clamp-2 mb-4">{property.description}</p>
                                
                                <div className="mt-auto flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/properties/${property.id}`}>
                                      View
                                    </Link>
                                  </Button>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/edit-property/${property.id}`}>
                                      <Edit className="mr-1 h-4 w-4" />
                                      Edit
                                    </Link>
                                  </Button>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-1 h-4 w-4" />
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the property listing.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => deletePropertyMutation.mutate(property.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          {deletePropertyMutation.isPending && propertyToDelete === property.id ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          ) : (
                                            <Trash2 className="mr-2 h-4 w-4" />
                                          )}
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Home className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-primary mb-2">No Properties Listed</h3>
                          <p className="text-neutral-500 mb-6">You haven't listed any properties yet.</p>
                          
                          {(user.role === "seller" || user.role === "agent" || user.role === "admin") && (
                            <Button asChild>
                              <Link href="/add-property">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Property
                              </Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Favorites Tab */}
                <TabsContent value="favorites">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Properties</CardTitle>
                      <CardDescription>
                        Properties you've saved for later
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {favoritesLoading ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        </div>
                      ) : favoritesError ? (
                        <div className="text-center py-12">
                          <p className="text-red-500">Failed to load favorites</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/favorites"] })}
                          >
                            Retry
                          </Button>
                        </div>
                      ) : favorites && favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {favorites.map((favorite) => (
                            <div key={favorite.id} className="border rounded-lg overflow-hidden">
                              <Link href={`/properties/${favorite.propertyId}`}>
                                <a>
                                  <div className="h-48 bg-neutral-200">
                                    <img 
                                      src={(favorite.property?.images as string[])[0] || "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                                      alt={favorite.property?.title} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="p-4">
                                    <h3 className="font-medium text-primary">{favorite.property?.title}</h3>
                                    <p className="text-sm text-neutral-500">
                                      {favorite.property?.city}, {favorite.property?.state}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                      <p className="font-bold text-secondary">
                                        ${favorite.property?.price.toLocaleString()}
                                      </p>
                                      <Badge className={favorite.property?.status === "for_sale" ? "bg-secondary" : "bg-accent"}>
                                        {favorite.property?.status === "for_sale" ? "For Sale" : "For Rent"}
                                      </Badge>
                                    </div>
                                  </div>
                                </a>
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Heart className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-primary mb-2">No Saved Properties</h3>
                          <p className="text-neutral-500 mb-6">You haven't saved any properties yet.</p>
                          
                          <Button asChild>
                            <Link href="/properties">
                              Browse Properties
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Inquiries Tab */}
                <TabsContent value="inquiries">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Inquiries</CardTitle>
                      <CardDescription>
                        Messages you've sent about properties
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {inquiriesLoading ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        </div>
                      ) : inquiriesError ? (
                        <div className="text-center py-12">
                          <p className="text-red-500">Failed to load inquiries</p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] })}
                          >
                            Retry
                          </Button>
                        </div>
                      ) : inquiries && inquiries.length > 0 ? (
                        <div className="space-y-4">
                          {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium text-primary">
                                    Inquiry for: {inquiry.property?.title || "Property"}
                                  </h3>
                                  <p className="text-sm text-neutral-500">
                                    Sent on {formatDate(inquiry.createdAt)}
                                  </p>
                                </div>
                                <Badge className={
                                  inquiry.status === "responded" 
                                    ? "bg-green-500" 
                                    : inquiry.status === "closed" 
                                      ? "bg-neutral-500" 
                                      : "bg-yellow-500"
                                }>
                                  {inquiry.status === "responded" 
                                    ? "Responded" 
                                    : inquiry.status === "closed" 
                                      ? "Closed" 
                                      : "Pending"}
                                </Badge>
                              </div>
                              
                              <p className="text-neutral-600 mb-4">{inquiry.message}</p>
                              
                              <div className="flex justify-end">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/properties/${inquiry.propertyId}`}>
                                    View Property
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <MessageSquare className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-primary mb-2">No Inquiries</h3>
                          <p className="text-neutral-500 mb-6">You haven't sent any property inquiries yet.</p>
                          
                          <Button asChild>
                            <Link href="/properties">
                              Browse Properties
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserDashboardPage;
