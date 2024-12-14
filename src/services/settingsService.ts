import { supabase } from "@/integrations/supabase/client";

export interface UserSettings {
  id: string;
  dashboard_name: string;
  base_currency: 'INR' | 'USD' | 'EUR' | 'GBP';
}

export const settingsService = {
  getSettings: async (userId: string): Promise<UserSettings | null> => {
    console.log("Fetching user settings for:", userId);
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user settings:", error);
      throw error;
    }

    return data;
  },

  createSettings: async (userId: string, settings: Partial<UserSettings>): Promise<UserSettings> => {
    console.log("Creating user settings:", settings);
    const { data, error } = await supabase
      .from("user_settings")
      .insert([
        {
          user_id: userId,
          ...settings
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user settings:", error);
      throw error;
    }

    return data;
  },

  updateSettings: async (userId: string, settings: Partial<UserSettings>): Promise<UserSettings> => {
    console.log("Updating user settings:", settings);
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

    return data;
  }
};