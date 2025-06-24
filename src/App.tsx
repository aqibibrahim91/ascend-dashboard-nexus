import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { LoginForm } from "./components/auth/LoginForm";
import { Dashboard } from "./components/Dashboard";
import NotFound from "./pages/NotFound";
import { CustomerDocuments } from "./components/customers/CustomerDocument";
import { CustomerList } from "./components/customers/CustomerList";
import { MachineryList } from "./components/machinery/MachineryList";
const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppContent />}>
                {/* Dashboard nested routes */}
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="customers" element={<CustomerList />} />
                <Route
                  path="customers/:id/document"
                  element={<CustomerDocuments />}
                />
                <Route path="machinery" element={<MachineryList />} />
              </Route>
              <Route path="/login" element={<LoginForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
