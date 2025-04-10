import { useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPropertySchema } from "@shared/schema";
import { 
  Home, 
  Upload, 
  Check, 
  X, 
  Plus, 
  ChevronDown, 
  Text, 
  DollarSign, 
  MapPin, 
  Building, 
  BedDouble, 
  Bath, 
  Ruler, 
  CalendarRange, 
  ListChecks, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Property form schema
const propertyFormSchema = insertPropertySchema.extend({
  images: z.any().optional(), // For file upload
  featuresText: z.string().optional(), // For comma-separated features input
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const AddPropertyPage = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form setup
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      propertyType: "house",
      status: "for_sale",
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      yearBuilt: new Date().getFullYear(),
      images: [],
      features: [],
      userId: user?.id || 0,
      featuresText: "",
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
      form.setValue("images", [...selectedFiles, ...filesArray]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    form.setValue("images", selectedFiles.filter((_, i) => i !== index));
  };
  
  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      const newFeatures = [...features, featureInput.trim()];
      setFeatures(newFeatures);
      form.setValue("features", newFeatures);
      setFeatureInput("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    form.setValue("features", newFeatures);
  };
  
  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };
  
  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all property data
      Object.keys(data).forEach(key => {
        if (key === 'images' || key === 'featuresText') {
          return; // Skip image files and featuresText, they'll be handled separately
        }
        
        if (key === 'features') {
          formData.append(key, JSON.stringify(features));
          return;
        }
        
        formData.append(key, String(data[key as keyof PropertyFormValues]));
      });
      
      // Add image files
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });
      
      // Set user ID
      formData.append('userId', String(user?.id));
      
      // Submit form
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to create property listing');
      }
      
      const result = await response.json();
      
      toast({
        title: "Property Listed Successfully",
        description: "Your property has been added to our listings.",
      });
      
      // Navigate to the newly created property
      navigate(`/properties/${result.id}`);
    } catch (error) {
      console.error('Error submitting property:', error);
      toast({
        title: "Error",
        description: "Failed to create property listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Parse comma-separated features
  const handleFeaturesTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    form.setValue("featuresText", text);
    
    if (text.includes(',')) {
      const newFeatures = text
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0 && !features.includes(f));
      
      if (newFeatures.length > 0) {
        const combinedFeatures = [...features, ...newFeatures];
        setFeatures(combinedFeatures);
        form.setValue("features", combinedFeatures);
        form.setValue("featuresText", "");
      }
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Add Property - HomeVerse</title>
        <meta name="description" content="List your property for sale or rent on HomeVerse." />
      </Helmet>
      
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-poppins font-bold text-white mb-2">Add New Property</h1>
          <p className="text-neutral-100 opacity-90">List your property for sale or rent on HomeVerse</p>
        </div>
      </section>
      
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-8">
                {/* Basic Information Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Home className="mr-2 h-5 w-5 text-secondary" />
                      <CardTitle>Basic Information</CardTitle>
                    </div>
                    <CardDescription>
                      Enter the main details about your property
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-neutral-400">
                                <Text className="h-5 w-5" />
                              </span>
                              <Input className="pl-10" placeholder="e.g. Modern Family Home with Garden" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            A catchy title will attract more potential buyers or renters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-neutral-400">
                                  <DollarSign className="h-5 w-5" />
                                </span>
                                <Input 
                                  className="pl-10"
                                  type="number" 
                                  placeholder="Property price" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Listing Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select listing type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="for_sale">For Sale</SelectItem>
                                <SelectItem value="for_rent">For Rent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your property in detail..." 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Include key selling points, nearby amenities, and special features.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                {/* Location Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-secondary" />
                      <CardTitle>Location</CardTitle>
                    </div>
                    <CardDescription>
                      Enter the property's location details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="ZIP Code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USA">United States</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                              <SelectItem value="Australia">Australia</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                {/* Property Details Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Building className="mr-2 h-5 w-5 text-secondary" />
                      <CardTitle>Property Details</CardTitle>
                    </div>
                    <CardDescription>
                      Enter specific details about the property
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-neutral-400">
                                  <BedDouble className="h-5 w-5" />
                                </span>
                                <Input 
                                  className="pl-10" 
                                  type="number" 
                                  placeholder="Number of bedrooms" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-neutral-400">
                                  <Bath className="h-5 w-5" />
                                </span>
                                <Input 
                                  className="pl-10" 
                                  type="number" 
                                  placeholder="Number of bathrooms"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area (sq ft)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-neutral-400">
                                  <Ruler className="h-5 w-5" />
                                </span>
                                <Input 
                                  className="pl-10" 
                                  type="number" 
                                  placeholder="Property area in sq ft"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="yearBuilt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year Built</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-neutral-400">
                                  <CalendarRange className="h-5 w-5" />
                                </span>
                                <Input 
                                  className="pl-10" 
                                  type="number" 
                                  placeholder="Year built"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <FormLabel>Features & Amenities</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="py-2">
                            {feature}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveFeature(index)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2.5 text-neutral-400">
                            <ListChecks className="h-5 w-5" />
                          </span>
                          <Input
                            className="pl-10"
                            placeholder="Add feature (e.g. Swimming Pool, Garage)"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyPress={handleFeatureKeyPress}
                          />
                        </div>
                        <Button type="button" onClick={handleAddFeature}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      
                      <FormDescription className="mt-2">
                        You can also separate features with commas.
                      </FormDescription>
                      
                      <FormField
                        control={form.control}
                        name="featuresText"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormControl>
                              <Textarea 
                                placeholder="Or add multiple features separated by commas..." 
                                {...field}
                                onChange={handleFeaturesTextChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Property Images Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Upload className="mr-2 h-5 w-5 text-secondary" />
                      <CardTitle>Property Images</CardTitle>
                    </div>
                    <CardDescription>
                      Upload high-quality images of your property (maximum 10 images)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center">
                      <Input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={selectedFiles.length >= 10}
                      />
                      <label 
                        htmlFor="images" 
                        className={`flex flex-col items-center justify-center cursor-pointer ${selectedFiles.length >= 10 ? 'opacity-50' : ''}`}
                      >
                        <Upload className="h-12 w-12 text-neutral-400 mb-2" />
                        <p className="text-lg font-medium text-primary">Drag & drop your images here</p>
                        <p className="text-sm text-neutral-500 mb-4">or click to browse</p>
                        <Button type="button" disabled={selectedFiles.length >= 10}>
                          Select Images
                        </Button>
                      </label>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Selected Images ({selectedFiles.length}/10)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={`Preview ${index}`} 
                                className="w-full h-24 object-cover rounded-md" 
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-red-100"
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedFiles.length === 0 && (
                      <Alert variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Images Selected</AlertTitle>
                        <AlertDescription>
                          Properties with images get 95% more views. Please add at least one image.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
                
                <div className="flex flex-col md:flex-row gap-4 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/properties")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || selectedFiles.length === 0}
                    className="min-w-[150px]"
                  >
                    {isSubmitting ? "Listing Property..." : "List Property"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddPropertyPage;
