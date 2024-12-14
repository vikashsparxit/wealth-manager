import { supabase } from "@/integrations/supabase/client";
import { CurrencyType } from "@/types/investment";

export interface UserSettings {
  id: string;
  dashboard_name: string;
  base_currency: CurrencyType;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const settingsService = {
  getSettings: async (userId: string): Promise<UserSettings | null> => {
    console.log("Fetching user settings for:", userId);
    
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log("No settings found for user, will return null");
          return null;
        }
        console.error("Error fetching user settings:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in getSettings:", error);
      throw error;
    }
  },

  createSettings: async (userId: string, settings: Partial<UserSettings>): Promise<UserSettings> => {
    console.log("Creating user settings:", { userId, settings });
    
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .insert([{
          user_id: userId,
          dashboard_name: settings.dashboard_name || 'My Wealth Dashboard',
          base_currency: settings.base_currency || 'INR'
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating user settings:", error);
        throw error;
      }

      console.log("Successfully created settings:", data);
      return data;
    } catch (error) {
      console.error("Error in createSettings:", error);
      throw error;
    }
  },

  updateSettings: async (userId: string, settings: Partial<UserSettings>): Promise<UserSettings> => {
    console.log("Updating user settings:", { userId, settings });
    
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .update(settings)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating user settings:", error);
        throw error;
      }

      console.log("Successfully updated settings:", data);
      return data;
    } catch (error) {
      console.error("Error in updateSettings:", error);
      throw error;
    }
  }
};