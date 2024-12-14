import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Minus, Check, X, Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const InvestmentTypesManager = () => {
  const [newType, setNewType] = useState("");
  const [types, setTypes] = useState<Array<{ id: string; name: string; status: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTypes();
    }
  }, [user]);

  const loadTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("investment_types")
        .select("*")
        .eq("user_id", user?.id)
        .order('name');

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

  const updateType = async (id: string, newName: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("investment_types")
        .update({ name: newName.trim() })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment type updated successfully",
      });
      
      setEditingId(null);
      await loadTypes();
    } catch (error) {
      console.error("Error updating investment type:", error);
      toast({
        title: "Error",
        description: "Failed to update investment type",
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
        .eq("id", id)
        .eq("user_id", user?.id);

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

  const startEditing = (type: { id: string; name: string }) => {
    setEditingId(type.id);
    setEditValue(type.name);
  };

  return (
    <Card className="p-6">
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
            {editingId === type.id ? (
              <div className="flex items-center gap-2 flex-1 mr-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateType(type.id, editValue)}
                  disabled={!editValue.trim() || editValue === type.name}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1 cursor-pointer" onClick={() => startEditing(type)}>
                  {type.name}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(type)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
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
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};