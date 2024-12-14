import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Minus, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const InvestmentTypesManager = () => {
  const [newType, setNewType] = useState("");
  const [types, setTypes] = useState<Array<{ id: string; name: string; status: string }>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("investment_types")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setTypes(data || []);
    } catch (error) {
      console.error("Error loading investment types:", error);
      toast({
        title: "Error",
        description: "Failed to load investment types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addType = async () => {
    if (!newType.trim() || !user?.id) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("investment_types")
        .insert([{ name: newType.trim(), user_id: user.id }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment type added successfully",
      });
      
      setNewType("");
      await loadTypes();
    } catch (error) {
      console.error("Error adding investment type:", error);
      toast({
        title: "Error",
        description: "Failed to add investment type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTypeStatus = async (id: string, currentStatus: string) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      const { error } = await supabase
        .from("investment_types")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment type status updated successfully",
      });
      
      await loadTypes();
    } catch (error) {
      console.error("Error updating investment type status:", error);
      toast({
        title: "Error",
        description: "Failed to update investment type status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Manage Investment Types</h3>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter investment type"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={addType} disabled={loading || !newType.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </div>

      <div className="space-y-2">
        {types.map((type) => (
          <div
            key={type.id}
            className="flex items-center justify-between p-2 bg-background rounded-lg border"
          >
            <span>{type.name}</span>
            <div className="flex gap-2">
              <Button
                variant={type.status === "active" ? "destructive" : "default"}
                size="sm"
                onClick={() => toggleTypeStatus(type.id, type.status)}
                disabled={loading}
              >
                {type.status === "active" ? (
                  <>
                    <Minus className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};