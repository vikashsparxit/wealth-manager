export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      family_members: {
        Row: {
          created_at: string
          id: string
          name: string
          relationship:
            | Database["public"]["Enums"]["family_relationship"]
            | null
          status: Database["public"]["Enums"]["investment_type_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          relationship?:
            | Database["public"]["Enums"]["family_relationship"]
            | null
          status?: Database["public"]["Enums"]["investment_type_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          relationship?:
            | Database["public"]["Enums"]["family_relationship"]
            | null
          status?: Database["public"]["Enums"]["investment_type_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investment_types: {
        Row: {
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["investment_type_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["investment_type_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["investment_type_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          created_at: string
          current_value: number
          date_of_investment: string
          id: string
          invested_amount: number
          notes: string | null
          owner: Database["public"]["Enums"]["family_member"]
          type: Database["public"]["Enums"]["investment_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_value: number
          date_of_investment: string
          id?: string
          invested_amount: number
          notes?: string | null
          owner: Database["public"]["Enums"]["family_member"]
          type: Database["public"]["Enums"]["investment_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_value?: number
          date_of_investment?: string
          id?: string
          invested_amount?: number
          notes?: string | null
          owner?: Database["public"]["Enums"]["family_member"]
          type?: Database["public"]["Enums"]["investment_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      liquid_assets: {
        Row: {
          amount: number
          created_at: string
          id: string
          owner: Database["public"]["Enums"]["family_member"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          owner: Database["public"]["Enums"]["family_member"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          owner?: Database["public"]["Enums"]["family_member"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      shared_dashboards: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          password_hash: string
          share_token: string
          status: Database["public"]["Enums"]["share_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          password_hash: string
          share_token: string
          status?: Database["public"]["Enums"]["share_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          password_hash?: string
          share_token?: string
          status?: Database["public"]["Enums"]["share_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          base_currency: Database["public"]["Enums"]["currency_type"]
          created_at: string
          dashboard_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          base_currency?: Database["public"]["Enums"]["currency_type"]
          created_at?: string
          dashboard_name?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          base_currency?: Database["public"]["Enums"]["currency_type"]
          created_at?: string
          dashboard_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      currency_type:
        | "INR"
        | "USD"
        | "EUR"
        | "GBP"
        | "JPY"
        | "AUD"
        | "CAD"
        | "CHF"
        | "CNY"
        | "HKD"
        | "NZD"
        | "SGD"
      family_member: "Myself" | "My Wife" | "My Daughter" | "Family"
      family_relationship:
        | "Primary User"
        | "Spouse"
        | "Son"
        | "Daughter"
        | "Mother"
        | "Father"
      investment_type:
        | "Real Estate"
        | "Gold"
        | "Bonds"
        | "LIC"
        | "ULIP"
        | "Sukanya Samridhi"
        | "Mutual Funds"
        | "Stocks"
        | "NPS"
        | "PPF"
        | "Startups"
      investment_type_status: "active" | "inactive"
      share_status: "active" | "revoked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
