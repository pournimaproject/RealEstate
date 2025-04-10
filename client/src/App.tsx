import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import PropertiesPage from "@/pages/properties-page";
import PropertyDetailPage from "@/pages/property-detail-page";
import AuthPage from "@/pages/auth-page";
import AddPropertyPage from "@/pages/add-property-page";
import UserDashboardPage from "@/pages/user-dashboard-page";
import ContactPage from "@/pages/contact-page";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/properties" component={PropertiesPage} />
          <Route path="/properties/:id" component={PropertyDetailPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/contact" component={ContactPage} />
          <ProtectedRoute path="/add-property" component={AddPropertyPage} />
          <ProtectedRoute path="/dashboard" component={UserDashboardPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
