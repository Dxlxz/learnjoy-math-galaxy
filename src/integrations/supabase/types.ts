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
      assessment_question_banks: {
        Row: {
          created_at: string
          difficulty_level: number
          grade: Database["public"]["Enums"]["grade_level"]
          id: string
          metadata: Json | null
          question: Json
          topic_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty_level: number
          grade: Database["public"]["Enums"]["grade_level"]
          id?: string
          metadata?: Json | null
          question: Json
          topic_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty_level?: number
          grade?: Database["public"]["Enums"]["grade_level"]
          id?: string
          metadata?: Json | null
          question?: Json
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_question_banks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "available_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_question_banks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_prerequisite_validation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_question_banks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_structure_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_question_banks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          title: string
          topic_id: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          title: string
          topic_id: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          title?: string
          topic_id?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "available_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_prerequisite_validation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_structure_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      game_progress: {
        Row: {
          created_at: string
          game_type: string
          id: string
          metadata: Json | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game_type: string
          id?: string
          metadata?: Json | null
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          game_type?: string
          id?: string
          metadata?: Json | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          achievement_type: string | null
          completed_at: string
          content_id: string
          created_at: string
          display_title: string | null
          id: string
          metadata: Json | null
          score: number | null
          trail_description: string | null
          user_id: string
        }
        Insert: {
          achievement_type?: string | null
          completed_at?: string
          content_id: string
          created_at?: string
          display_title?: string | null
          id?: string
          metadata?: Json | null
          score?: number | null
          trail_description?: string | null
          user_id: string
        }
        Update: {
          achievement_type?: string | null
          completed_at?: string
          content_id?: string
          created_at?: string
          display_title?: string | null
          id?: string
          metadata?: Json | null
          score?: number | null
          trail_description?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string
          id: string
          metadata: Json | null
          prerequisite_milestones: string[] | null
          requirements: Json
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name: string
          id?: string
          metadata?: Json | null
          prerequisite_milestones?: string[] | null
          requirements?: Json
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          metadata?: Json | null
          prerequisite_milestones?: string[] | null
          requirements?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_id: string | null
          created_at: string | null
          grade: Database["public"]["Enums"]["grade_level"]
          hero_name: string
          id: string
          onboarding_completed: boolean | null
          profile_setup_completed: boolean | null
          starter_challenge_completed: boolean | null
          starter_challenge_score: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_id?: string | null
          created_at?: string | null
          grade: Database["public"]["Enums"]["grade_level"]
          hero_name: string
          id: string
          onboarding_completed?: boolean | null
          profile_setup_completed?: boolean | null
          starter_challenge_completed?: boolean | null
          starter_challenge_score?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_id?: string | null
          created_at?: string | null
          grade?: Database["public"]["Enums"]["grade_level"]
          hero_name?: string
          id?: string
          onboarding_completed?: boolean | null
          profile_setup_completed?: boolean | null
          starter_challenge_completed?: boolean | null
          starter_challenge_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      starter_challenges: {
        Row: {
          created_at: string
          grade: Database["public"]["Enums"]["grade_level"]
          id: string
          questions: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          grade: Database["public"]["Enums"]["grade_level"]
          id?: string
          questions: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          grade?: Database["public"]["Enums"]["grade_level"]
          id?: string
          questions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          grade: Database["public"]["Enums"]["grade_level"]
          id: string
          order_index: number
          prerequisites: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          grade: Database["public"]["Enums"]["grade_level"]
          id?: string
          order_index: number
          prerequisites?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          grade?: Database["public"]["Enums"]["grade_level"]
          id?: string
          order_index?: number
          prerequisites?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_milestones: {
        Row: {
          completed_at: string
          id: string
          metadata: Json | null
          milestone_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          metadata?: Json | null
          milestone_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          metadata?: Json | null
          milestone_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      available_topics: {
        Row: {
          created_at: string | null
          description: string | null
          grade: Database["public"]["Enums"]["grade_level"] | null
          id: string | null
          is_started: boolean | null
          order_index: number | null
          prerequisites: Json | null
          prerequisites_met: boolean | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      topic_prerequisite_validation: {
        Row: {
          grade: Database["public"]["Enums"]["grade_level"] | null
          id: string | null
          required_topic_grade:
            | Database["public"]["Enums"]["grade_level"]
            | null
          required_topic_id: string | null
          required_topic_title: string | null
          title: string | null
          validation_status: string | null
        }
        Relationships: []
      }
      topic_structure_analysis: {
        Row: {
          grade: Database["public"]["Enums"]["grade_level"] | null
          has_content: boolean | null
          has_questions: boolean | null
          id: string | null
          order_index: number | null
          prerequisites: Json | null
          title: string | null
          total_prerequisites: number | null
        }
        Insert: {
          grade?: Database["public"]["Enums"]["grade_level"] | null
          has_content?: never
          has_questions?: never
          id?: string | null
          order_index?: number | null
          prerequisites?: Json | null
          title?: string | null
          total_prerequisites?: never
        }
        Update: {
          grade?: Database["public"]["Enums"]["grade_level"] | null
          has_content?: never
          has_questions?: never
          id?: string | null
          order_index?: number | null
          prerequisites?: Json | null
          title?: string | null
          total_prerequisites?: never
        }
        Relationships: []
      }
    }
    Functions: {
      check_topic_prerequisites: {
        Args: {
          p_user_id: string
          p_topic_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      content_type: "video" | "worksheet" | "interactive" | "assessment"
      grade_level: "K1" | "K2" | "G1" | "G2" | "G3" | "G4" | "G5"
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
