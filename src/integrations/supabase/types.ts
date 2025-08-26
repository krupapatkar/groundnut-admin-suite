export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          id: string
          message: string
          status: string
          time: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: string
          time: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: string
          time?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          type?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          name: string
          status: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          location_name: string | null
          name: string
          status: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          location_name?: string | null
          name: string
          status?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          location_name?: string | null
          name?: string
          status?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_health: {
        Row: {
          created_at: string
          customer_satisfaction_score: number
          id: string
          market_position_score: number
          operational_efficiency_score: number
          overall_rating: string
          overall_score: number
          revenue_growth_score: number
        }
        Insert: {
          created_at?: string
          customer_satisfaction_score: number
          id?: string
          market_position_score: number
          operational_efficiency_score: number
          overall_rating: string
          overall_score: number
          revenue_growth_score: number
        }
        Update: {
          created_at?: string
          customer_satisfaction_score?: number
          id?: string
          market_position_score?: number
          operational_efficiency_score?: number
          overall_rating?: string
          overall_score?: number
          revenue_growth_score?: number
        }
        Relationships: []
      }
      kpis: {
        Row: {
          bg_class: string
          color_class: string
          created_at: string
          current_value: string
          icon_name: string
          id: string
          target_value: string
          title: string
          trend: string
          updated_at: string
        }
        Insert: {
          bg_class: string
          color_class: string
          created_at?: string
          current_value: string
          icon_name: string
          id?: string
          target_value: string
          title: string
          trend: string
          updated_at?: string
        }
        Update: {
          bg_class?: string
          color_class?: string
          created_at?: string
          current_value?: string
          icon_name?: string
          id?: string
          target_value?: string
          title?: string
          trend?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          id: string
          product_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          created_at: string
          current_value: number
          id: string
          metric_name: string
          percentage_change: number
          previous_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value: number
          id?: string
          metric_name: string
          percentage_change: number
          previous_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number
          id?: string
          metric_name?: string
          percentage_change?: number
          previous_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      predictive_insights: {
        Row: {
          bg_color: string
          border_color: string
          created_at: string
          description: string
          id: string
          text_color: string
          title: string
          type: string
        }
        Insert: {
          bg_color: string
          border_color: string
          created_at?: string
          description: string
          id?: string
          text_color: string
          title: string
          type: string
        }
        Update: {
          bg_color?: string
          border_color?: string
          created_at?: string
          description?: string
          id?: string
          text_color?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      product_details: {
        Row: {
          bag: number
          bag_breakdown: Json | null
          bardan: number
          created_at: string
          gross_weight: number
          id: string
          kad: number
          net_weight: number
          product_id: string | null
          product_slip: string | null
          updated_at: string
        }
        Insert: {
          bag?: number
          bag_breakdown?: Json | null
          bardan?: number
          created_at?: string
          gross_weight?: number
          id?: string
          kad?: number
          net_weight?: number
          product_id?: string | null
          product_slip?: string | null
          updated_at?: string
        }
        Update: {
          bag?: number
          bag_breakdown?: Json | null
          bardan?: number
          created_at?: string
          gross_weight?: number
          id?: string
          kad?: number
          net_weight?: number
          product_id?: string | null
          product_slip?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_details_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          bag: number
          company_id: string | null
          company_name: string
          created_at: string
          final_price: number
          id: string
          net_weight: number
          price: number
          purchase_date: string
          slip_number: string
          total_price: number
          updated_at: string
          vehicle_id: string | null
          vehicle_number: string
          weight: number
        }
        Insert: {
          bag: number
          company_id?: string | null
          company_name: string
          created_at?: string
          final_price: number
          id?: string
          net_weight: number
          price: number
          purchase_date: string
          slip_number: string
          total_price: number
          updated_at?: string
          vehicle_id?: string | null
          vehicle_number: string
          weight: number
        }
        Update: {
          bag?: number
          company_id?: string | null
          company_name?: string
          created_at?: string
          final_price?: number
          id?: string
          net_weight?: number
          price?: number
          purchase_date?: string
          slip_number?: string
          total_price?: number
          updated_at?: string
          vehicle_id?: string | null
          vehicle_number?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      regional_performance: {
        Row: {
          created_at: string
          growth: string
          id: string
          orders: number
          region: string
          revenue: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          growth: string
          id?: string
          orders: number
          region: string
          revenue: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          growth?: string
          id?: string
          orders?: number
          region?: string
          revenue?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          resolved: boolean
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          resolved?: boolean
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          resolved?: boolean
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          country_code: string
          created_at: string
          email_address: string
          id: string
          mobile_number: string
          password: string
          status: boolean
          type: string
          updated_at: string
          user_name: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          email_address: string
          id?: string
          mobile_number: string
          password: string
          status?: boolean
          type: string
          updated_at?: string
          user_name: string
        }
        Update: {
          country_code?: string
          created_at?: string
          email_address?: string
          id?: string
          mobile_number?: string
          password?: string
          status?: boolean
          type?: string
          updated_at?: string
          user_name?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          company_id: string | null
          company_name: string | null
          created_at: string
          id: string
          number: string
          status: boolean
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          number: string
          status?: boolean
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          number?: string
          status?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
