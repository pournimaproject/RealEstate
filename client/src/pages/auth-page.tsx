import { useState, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Home, LogIn, UserPlus, Mail, Lock, User, Phone } from "lucide-react";

// Login form schema
const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

// Registration form schema
const registrationFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["buyer", "seller"]),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const AuthPage = () => {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const showRegister = searchParams.get("register") === "true";
  const [activeTab, setActiveTab] = useState<string>(showRegister ? "register" : "login");
  const { user, loginMutation, registerMutation } = useAuth();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const registrationForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "buyer",
    },
  });
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  const onRegisterSubmit = (data: RegistrationFormValues) => {
    registerMutation.mutate(data);
  };
  
  // Update tab based on URL parameter
  useEffect(() => {
    setActiveTab(showRegister ? "register" : "login");
  }, [showRegister]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "register") {
      navigate("/auth?register=true");
    } else {
      navigate("/auth");
    }
  };
  
  if (user) {
    return null; // Don't render anything if already logged in (will redirect)
  }

  return (
    <>
      <Helmet>
        <title>{activeTab === "login" ? "Sign In" : "Register"} - HomeVerse</title>
        <meta name="description" content="Sign in or register for a HomeVerse account to access exclusive property listings and save your favorites." />
      </Helmet>
      
      <section className="min-h-screen py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Auth Form */}
              <div>
                <div className="mb-8">
                  <Link href="/">
                    <a className="flex items-center text-primary font-poppins font-bold text-2xl">
                      <Home className="mr-2 h-6 w-6 text-secondary" />
                      <span>HomeVerse</span>
                    </a>
                  </Link>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {activeTab === "login" ? "Welcome Back" : "Create an Account"}
                    </CardTitle>
                    <CardDescription>
                      {activeTab === "login" 
                        ? "Sign in to access your HomeVerse account" 
                        : "Register to find your dream home or list your property"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs 
                      value={activeTab} 
                      onValueChange={handleTabChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login" className="flex items-center">
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </TabsTrigger>
                        <TabsTrigger value="register" className="flex items-center">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Register
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* Login Form */}
                      <TabsContent value="login">
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username or Email</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-neutral-400">
                                        <User className="h-5 w-5" />
                                      </span>
                                      <Input className="pl-10" placeholder="Enter your username or email" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                    <a href="#" className="text-sm text-accent hover:text-accent-dark">
                                      Forgot password?
                                    </a>
                                  </div>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-neutral-400">
                                        <Lock className="h-5 w-5" />
                                      </span>
                                      <Input 
                                        className="pl-10" 
                                        type="password" 
                                        placeholder="Enter your password" 
                                        {...field} 
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="w-full"
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? "Signing in..." : "Sign In"}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                      
                      {/* Registration Form */}
                      <TabsContent value="register">
                        <Form {...registrationForm}>
                          <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                            <FormField
                              control={registrationForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-neutral-400">
                                        <User className="h-5 w-5" />
                                      </span>
                                      <Input className="pl-10" placeholder="Choose a username" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registrationForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-neutral-400">
                                        <Mail className="h-5 w-5" />
                                      </span>
                                      <Input 
                                        className="pl-10" 
                                        placeholder="Your email address" 
                                        type="email" 
                                        {...field} 
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={registrationForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name (Optional)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="First name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registrationForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name (Optional)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={registrationForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone (Optional)</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-neutral-400">
                                        <Phone className="h-5 w-5" />
                                      </span>
                                      <Input className="pl-10" placeholder="Your phone number" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registrationForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-neutral-400">
                                        <Lock className="h-5 w-5" />
                                      </span>
                                      <Input 
                                        className="pl-10" 
                                        type="password" 
                                        placeholder="Create a password (min. 6 characters)" 
                                        {...field} 
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registrationForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password" 
                                      placeholder="Confirm your password" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registrationForm.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>I want to</FormLabel>
                                  <div className="flex space-x-4">
                                    <div 
                                      className={`flex-1 border rounded-md p-3 cursor-pointer ${field.value === 'buyer' ? 'border-accent bg-accent bg-opacity-5' : 'border-neutral-200'}`}
                                      onClick={() => field.onChange('buyer')}
                                    >
                                      <div className="font-medium">Buy/Rent</div>
                                      <div className="text-sm text-neutral-500">Looking for a property</div>
                                    </div>
                                    <div 
                                      className={`flex-1 border rounded-md p-3 cursor-pointer ${field.value === 'seller' ? 'border-accent bg-accent bg-opacity-5' : 'border-neutral-200'}`}
                                      onClick={() => field.onChange('seller')}
                                    >
                                      <div className="font-medium">Sell/Rent Out</div>
                                      <div className="text-sm text-neutral-500">Listing a property</div>
                                    </div>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="text-sm text-neutral-500">
                              By registering, you agree to our <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full"
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="relative mt-6">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-neutral-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <Button variant="outline" className="w-full">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                        </svg>
                        Facebook
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-neutral-500">
                      {activeTab === "login" 
                        ? "Don't have an account? " 
                        : "Already have an account? "
                      }
                      <a
                        href="#"
                        className="text-accent hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabChange(activeTab === "login" ? "register" : "login");
                        }}
                      >
                        {activeTab === "login" ? "Register" : "Sign In"}
                      </a>
                    </p>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Auth Hero */}
              <div className="hidden md:block">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-lg text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#FFFFFF" d="M47.5,-61.7C62.6,-55.1,76.7,-42.8,82.7,-27.2C88.7,-11.5,86.7,7.5,79.6,23.5C72.5,39.4,60.4,52.3,46.1,60.5C31.8,68.7,15.9,72.2,-0.6,73C-17.1,73.9,-34.2,72.1,-47.5,63.5C-60.8,54.9,-70.3,39.4,-75.7,22.5C-81.1,5.5,-82.3,-12.9,-75.5,-26.5C-68.6,-40.2,-53.6,-49.2,-39,-55.1C-24.5,-61,-12.2,-63.8,1.9,-66.4C16.1,-69,32.1,-71.3,47.5,-61.7Z" transform="translate(100 100)" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Your Gateway to Finding the Perfect Home</h2>
                    <p className="mb-8 opacity-90">Join HomeVerse today and discover a world of possibilities in real estate. Whether you're looking to buy, sell, or rent, we've got you covered.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-white bg-opacity-20 p-2 rounded mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold">Thousands of Properties</h3>
                          <p className="opacity-80 text-sm">Access our vast database of properties across the country</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-white bg-opacity-20 p-2 rounded mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold">Save Time and Effort</h3>
                          <p className="opacity-80 text-sm">Our advanced search helps you find properties that match your criteria</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-white bg-opacity-20 p-2 rounded mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold">Expert Support</h3>
                          <p className="opacity-80 text-sm">Get help from our team of real estate professionals</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AuthPage;
