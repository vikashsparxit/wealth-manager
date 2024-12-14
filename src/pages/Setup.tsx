import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const currencies = [
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
] as const;

type CurrencyType = typeof currencies[number]["value"];

export const Setup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, initializeSettings } = useSettings();
  const { toast } = useToast();
  const [dashboardName, setDashboardName] = useState("");
  const [currency, setCurrency] = useState<CurrencyType>("INR");
  const [fullName, setFullName] = useState(user?.user_metadata.full_name || user?.user_metadata.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      navigate("/");
    }
  }, [settings, navigate]);

  const handleCurrencyChange = (value: string) => {
    if (currencies.some(curr => curr.value === value)) {
      setCurrency(value as CurrencyType);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!fullName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update user's full name
      await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', user.id);

      // Update the primary family member's name
      await supabase
        .from('family_members')
        .update({ 
          name: fullName.trim(),
          relationship: 'Primary User'
        })
        .eq('user_id', user.id)
        .eq('name', 'Myself');

      await initializeSettings({
        dashboard_name: dashboardName,
        base_currency: currency
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Your Wealth Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Let's set up your dashboard preferences before we begin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                This name will be used to identify you as the primary user
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="dashboardName" className="text-sm font-medium">
                Dashboard Name
              </label>
              <Input
                id="dashboardName"
                type="text"
                required
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                placeholder="My Wealth Dashboard"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Base Currency
              </label>
              <Select value={currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger id="currency" className="w-full bg-background">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  {currencies.map((curr) => (
                    <SelectItem 
                      key={curr.value} 
                      value={curr.value}
                      className="cursor-pointer hover:bg-accent focus:bg-accent"
                    >
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !dashboardName || !fullName}
          >
            {isSubmitting ? "Setting up..." : "Continue to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Setup;