import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";

const currencies = [
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "CHF", label: "Swiss Franc (Fr)" },
  { value: "CNY", label: "Chinese Yuan (¥)" },
  { value: "HKD", label: "Hong Kong Dollar (HK$)" },
  { value: "NZD", label: "New Zealand Dollar (NZ$)" },
  { value: "SGD", label: "Singapore Dollar (S$)" },
];

export default function Setup() {
  const [dashboardName, setDashboardName] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { initializeSettings } = useSettings();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Update user's full name in profiles
      await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', user.id);

      // Update the primary family member's name and relationship
      await supabase
        .from('family_members')
        .update({ 
          name: 'Myself',
          relationship: 'Primary User'
        })
        .eq('user_id', user.id)
        .eq('name', 'Myself');

      await initializeSettings({
        dashboard_name: dashboardName || "My Wealth Dashboard",
        base_currency: currency
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error in setup:', error);
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Your Wealth Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Let's set up your dashboard preferences
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Your Name
            </label>
            <Input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="dashboardName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Dashboard Name
            </label>
            <Input
              id="dashboardName"
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="My Wealth Dashboard"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="currency"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Base Currency
            </label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem
                    key={currency.value}
                    value={currency.value}
                    className="cursor-pointer"
                  >
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !fullName}
          >
            {isSubmitting ? "Setting up..." : "Continue to Dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
}