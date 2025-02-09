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
      achievements: {
        Row: {
          created_at: string
          description: string
          icon_name: string
          id: string
          metadata: Json | null
          requirement_type: string
          requirement_value: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          icon_name: string
          id?: string
          metadata?: Json | null
          requirement_type: string
          requirement_value: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          metadata?: Json | null
          requirement_type?: string
          requirement_value?: number
          title?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      assessment_question_banks: {
        Row: {
          avg_completion_time: number | null
          created_at: string
          difficulty_level: number
          feedback: Json | null
          grade: Database["public"]["Enums"]["grade_level"]
          hint: string | null
          id: string
          learning_objective: string | null
          metadata: Json | null
          points: number | null
          question: Json
          question_type: string
          required_tools: string[] | null
          success_rate: number | null
          tags: string[] | null
          time_limit_seconds: number | null
          topic_id: string
          updated_at: string
        }
        Insert: {
          avg_completion_time?: number | null
          created_at?: string
          difficulty_level: number
          feedback?: Json | null
          grade: Database["public"]["Enums"]["grade_level"]
          hint?: string | null
          id?: string
          learning_objective?: string | null
          metadata?: Json | null
          points?: number | null
          question: Json
          question_type?: string
          required_tools?: string[] | null
          success_rate?: number | null
          tags?: string[] | null
          time_limit_seconds?: number | null
          topic_id: string
          updated_at?: string
        }
        Update: {
          avg_completion_time?: number | null
          created_at?: string
          difficulty_level?: number
          feedback?: Json | null
          grade?: Database["public"]["Enums"]["grade_level"]
          hint?: string | null
          id?: string
          learning_objective?: string | null
          metadata?: Json | null
          points?: number | null
          question?: Json
          question_type?: string
          required_tools?: string[] | null
          success_rate?: number | null
          tags?: string[] | null
          time_limit_seconds?: number | null
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_question_banks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "quiz_content_validation"
            referencedColumns: ["topic_id"]
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
      assessment_question_banks_duplicate: {
        Row: {
          avg_completion_time: number | null
          created_at: string
          difficulty_level: number
          feedback: Json | null
          grade: Database["public"]["Enums"]["grade_level"]
          hint: string | null
          id: string
          learning_objective: string | null
          metadata: Json | null
          points: number | null
          question: Json
          question_type: string
          required_tools: string[] | null
          success_rate: number | null
          tags: string[] | null
          time_limit_seconds: number | null
          topic_id: string
          updated_at: string
        }
        Insert: {
          avg_completion_time?: number | null
          created_at?: string
          difficulty_level: number
          feedback?: Json | null
          grade: Database["public"]["Enums"]["grade_level"]
          hint?: string | null
          id?: string
          learning_objective?: string | null
          metadata?: Json | null
          points?: number | null
          question: Json
          question_type?: string
          required_tools?: string[] | null
          success_rate?: number | null
          tags?: string[] | null
          time_limit_seconds?: number | null
          topic_id: string
          updated_at?: string
        }
        Update: {
          avg_completion_time?: number | null
          created_at?: string
          difficulty_level?: number
          feedback?: Json | null
          grade?: Database["public"]["Enums"]["grade_level"]
          hint?: string | null
          id?: string
          learning_objective?: string | null
          metadata?: Json | null
          points?: number | null
          question?: Json
          question_type?: string
          required_tools?: string[] | null
          success_rate?: number | null
          tags?: string[] | null
          time_limit_seconds?: number | null
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_question_banks_duplicate_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "quiz_content_validation"
            referencedColumns: ["topic_id"]
          },
          {
            foreignKeyName: "assessment_question_banks_duplicate_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_prerequisite_validation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_question_banks_duplicate_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_structure_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_question_banks_duplicate_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_rate_limits: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          email: string
          id: string
          is_blocked: boolean | null
          last_attempt: string | null
          updated_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_blocked?: boolean | null
          last_attempt?: string | null
          updated_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_blocked?: boolean | null
          last_attempt?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
            referencedRelation: "quiz_content_validation"
            referencedColumns: ["topic_id"]
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
      diagnostic_results: {
        Row: {
          correct_answers: number
          created_at: string
          grade: string
          id: string
          questions_answered: number
          score: number
          user_id: string | null
        }
        Insert: {
          correct_answers: number
          created_at?: string
          grade: string
          id?: string
          questions_answered: number
          score: number
          user_id?: string | null
        }
        Update: {
          correct_answers?: number
          created_at?: string
          grade?: string
          id?: string
          questions_answered?: number
          score?: number
          user_id?: string | null
        }
        Relationships: []
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
      hero_reports: {
        Row: {
          generated_at: string
          id: string
          metadata: Json | null
          report_data: Json
          report_type: string
          user_id: string
          validity_period: unknown | null
        }
        Insert: {
          generated_at?: string
          id?: string
          metadata?: Json | null
          report_data?: Json
          report_type: string
          user_id: string
          validity_period?: unknown | null
        }
        Update: {
          generated_at?: string
          id?: string
          metadata?: Json | null
          report_data?: Json
          report_type?: string
          user_id?: string
          validity_period?: unknown | null
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          achieved_at: string | null
          game_type: string
          id: string
          metadata: Json | null
          score: number
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          game_type: string
          id?: string
          metadata?: Json | null
          score: number
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          game_type?: string
          id?: string
          metadata?: Json | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_leaderboard_user_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          created_at: string | null
          current_node_id: string | null
          generated_at: string | null
          id: string
          metadata: Json | null
          path_data: Json
          updated_at: string | null
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string | null
          current_node_id?: string | null
          generated_at?: string | null
          id?: string
          metadata?: Json | null
          path_data?: Json
          updated_at?: string | null
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string | null
          current_node_id?: string | null
          generated_at?: string | null
          id?: string
          metadata?: Json | null
          path_data?: Json
          updated_at?: string | null
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          achievement_type: string | null
          completed_at: string
          completion_status: string
          content_id: string
          created_at: string
          display_title: string | null
          end_time: string | null
          id: string
          interaction_data: Json | null
          metadata: Json | null
          score: number | null
          start_time: string | null
          trail_description: string | null
          user_id: string
        }
        Insert: {
          achievement_type?: string | null
          completed_at?: string
          completion_status?: string
          content_id: string
          created_at?: string
          display_title?: string | null
          end_time?: string | null
          id?: string
          interaction_data?: Json | null
          metadata?: Json | null
          score?: number | null
          start_time?: string | null
          trail_description?: string | null
          user_id: string
        }
        Update: {
          achievement_type?: string | null
          completed_at?: string
          completion_status?: string
          content_id?: string
          created_at?: string
          display_title?: string | null
          end_time?: string | null
          id?: string
          interaction_data?: Json | null
          metadata?: Json | null
          score?: number | null
          start_time?: string | null
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
      math_tools: {
        Row: {
          created_at: string
          description: string
          grade: Database["public"]["Enums"]["grade_level"]
          icon_name: string
          id: string
          metadata: Json | null
          settings: Json | null
          title: string
          tool_type: string
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          grade: Database["public"]["Enums"]["grade_level"]
          icon_name: string
          id?: string
          metadata?: Json | null
          settings?: Json | null
          title: string
          tool_type: string
          topic: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          grade?: Database["public"]["Enums"]["grade_level"]
          icon_name?: string
          id?: string
          metadata?: Json | null
          settings?: Json | null
          title?: string
          tool_type?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
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
      number_recognition_progress: {
        Row: {
          attempts: number | null
          created_at: string
          id: string
          number: number
          status: Database["public"]["Enums"]["tool_progress_status"] | null
          trace_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string
          id?: string
          number: number
          status?: Database["public"]["Enums"]["tool_progress_status"] | null
          trace_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number | null
          created_at?: string
          id?: string
          number?: number
          status?: Database["public"]["Enums"]["tool_progress_status"] | null
          trace_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      password_resets: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
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
          updated_at?: string | null
        }
        Relationships: []
      }
      quest_analytics: {
        Row: {
          achievement_details: Json | null
          category: string | null
          created_at: string | null
          id: string
          metric_name: string | null
          metric_value: number | null
          quest_details: Json | null
          recorded_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_details?: Json | null
          category?: string | null
          created_at?: string | null
          id?: string
          metric_name?: string | null
          metric_value?: number | null
          quest_details?: Json | null
          recorded_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_details?: Json | null
          category?: string | null
          created_at?: string | null
          id?: string
          metric_name?: string | null
          metric_value?: number | null
          quest_details?: Json | null
          recorded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      question_analytics: {
        Row: {
          avg_time_seconds: number | null
          correct_attempts: number | null
          created_at: string | null
          id: string
          last_attempted_at: string | null
          question_id: string | null
          total_attempts: number | null
          updated_at: string | null
        }
        Insert: {
          avg_time_seconds?: number | null
          correct_attempts?: number | null
          created_at?: string | null
          id?: string
          last_attempted_at?: string | null
          question_id?: string | null
          total_attempts?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_time_seconds?: number | null
          correct_attempts?: number | null
          created_at?: string | null
          id?: string
          last_attempted_at?: string | null
          question_id?: string | null
          total_attempts?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_analytics_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "assessment_question_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          analytics_data: Json | null
          correct_answers: number | null
          created_at: string | null
          current_streak: number | null
          difficulty_progression: Json | null
          end_time: string | null
          final_score: number | null
          id: string
          max_questions: number
          max_streak: number | null
          points_possible: number | null
          question_history: Json | null
          questions_answered: number
          start_time: string | null
          status: string
          streak_data: Json | null
          topic_id: string | null
          total_questions: number | null
          user_id: string | null
        }
        Insert: {
          analytics_data?: Json | null
          correct_answers?: number | null
          created_at?: string | null
          current_streak?: number | null
          difficulty_progression?: Json | null
          end_time?: string | null
          final_score?: number | null
          id?: string
          max_questions?: number
          max_streak?: number | null
          points_possible?: number | null
          question_history?: Json | null
          questions_answered?: number
          start_time?: string | null
          status?: string
          streak_data?: Json | null
          topic_id?: string | null
          total_questions?: number | null
          user_id?: string | null
        }
        Update: {
          analytics_data?: Json | null
          correct_answers?: number | null
          created_at?: string | null
          current_streak?: number | null
          difficulty_progression?: Json | null
          end_time?: string | null
          final_score?: number | null
          id?: string
          max_questions?: number
          max_streak?: number | null
          points_possible?: number | null
          question_history?: Json | null
          questions_answered?: number
          start_time?: string | null
          status?: string
          streak_data?: Json | null
          topic_id?: string | null
          total_questions?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "quiz_content_validation"
            referencedColumns: ["topic_id"]
          },
          {
            foreignKeyName: "quiz_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_prerequisite_validation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_structure_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_completion: {
        Row: {
          completed_at: string | null
          content_completed: boolean | null
          created_at: string | null
          id: string
          quest_completed: boolean | null
          topic_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          content_completed?: boolean | null
          created_at?: string | null
          id?: string
          quest_completed?: boolean | null
          topic_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          content_completed?: boolean | null
          created_at?: string | null
          id?: string
          quest_completed?: boolean | null
          topic_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          grade: Database["public"]["Enums"]["grade_level"]
          header_image_url: string | null
          id: string
          map_coordinates: Json | null
          map_region: Json | null
          map_zoom_level: number | null
          order_index: number
          path_style: Json | null
          prerequisites: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          grade: Database["public"]["Enums"]["grade_level"]
          header_image_url?: string | null
          id?: string
          map_coordinates?: Json | null
          map_region?: Json | null
          map_zoom_level?: number | null
          order_index: number
          path_style?: Json | null
          prerequisites?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          grade?: Database["public"]["Enums"]["grade_level"]
          header_image_url?: string | null
          id?: string
          map_coordinates?: Json | null
          map_region?: Json | null
          map_zoom_level?: number | null
          order_index?: number
          path_style?: Json | null
          prerequisites?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_difficulty_levels: {
        Row: {
          consecutive_correct: number
          consecutive_incorrect: number
          created_at: string | null
          current_difficulty_level: number
          id: string
          last_updated_at: string | null
          success_rate: number | null
          topic_id: string
          total_questions_attempted: number
          user_id: string
        }
        Insert: {
          consecutive_correct?: number
          consecutive_incorrect?: number
          created_at?: string | null
          current_difficulty_level?: number
          id?: string
          last_updated_at?: string | null
          success_rate?: number | null
          topic_id: string
          total_questions_attempted?: number
          user_id: string
        }
        Update: {
          consecutive_correct?: number
          consecutive_incorrect?: number
          created_at?: string | null
          current_difficulty_level?: number
          id?: string
          last_updated_at?: string | null
          success_rate?: number | null
          topic_id?: string
          total_questions_attempted?: number
          user_id?: string
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
      user_tool_progress: {
        Row: {
          favorite: boolean | null
          id: string
          last_used: string
          metadata: Json | null
          saved_work: Json | null
          settings: Json | null
          tool_id: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          favorite?: boolean | null
          id?: string
          last_used?: string
          metadata?: Json | null
          saved_work?: Json | null
          settings?: Json | null
          tool_id: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          favorite?: boolean | null
          id?: string
          last_used?: string
          metadata?: Json | null
          saved_work?: Json | null
          settings?: Json | null
          tool_id?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tool_progress_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "math_tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tool_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      adventure_timeline: {
        Row: {
          achievement_details: Json | null
          category: string | null
          final_score: number | null
          max_questions: number | null
          metric_name: string | null
          metric_value: number | null
          quest_details: Json | null
          questions_answered: number | null
          recorded_at: string | null
          topic_description: string | null
          topic_title: string | null
        }
        Relationships: []
      }
      analytics_data: {
        Row: {
          category: string | null
          metric_name: string | null
          metric_value: number | null
          period_start: string | null
          recorded_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      quiz_content_validation: {
        Row: {
          assessment_count: number | null
          grade: Database["public"]["Enums"]["grade_level"] | null
          has_assessments: boolean | null
          title: string | null
          topic_id: string | null
        }
        Relationships: []
      }
      quiz_session_questions: {
        Row: {
          correct_answers: number | null
          final_score: number | null
          first_question_time: string | null
          max_questions: number | null
          questions_answered: number | null
          session_id: string | null
          status: string | null
          topic_id: string | null
          total_questions: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "quiz_content_validation"
            referencedColumns: ["topic_id"]
          },
          {
            foreignKeyName: "quiz_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_prerequisite_validation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_structure_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
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
      user_content_progress: {
        Row: {
          all_content_completed: boolean | null
          completed_content: number | null
          topic_id: string | null
          total_content: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "quiz_content_validation"
            referencedColumns: ["topic_id"]
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
      user_streak_analytics: {
        Row: {
          all_time_max_streak: number | null
          average_streak: number | null
          hot_streaks_count: number | null
          last_activity: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_questions_by_difficulty: {
        Args: {
          p_topic_id: string
        }
        Returns: {
          difficulty_level: number
          question_count: number
        }[]
      }
      check_quiz_availability: {
        Args: {
          p_topic_id: string
        }
        Returns: {
          available: boolean
          question_count: number
          difficulty_levels: number[]
        }[]
      }
      check_rate_limit: {
        Args: {
          p_email: string
        }
        Returns: {
          is_allowed: boolean
          wait_time: number
          attempts_remaining: number
        }[]
      }
      check_topic_content_completion: {
        Args: {
          p_user_id: string
          p_topic_id: string
        }
        Returns: boolean
      }
      check_topic_prerequisites: {
        Args: {
          p_user_id: string
          p_topic_id: string
        }
        Returns: boolean
      }
      get_next_quiz_question: {
        Args: {
          p_session_id: string
          p_topic_id: string
          p_difficulty_level: number
        }
        Returns: {
          question_id: string
          question_data: Json
          difficulty_level: number
          points: number
        }[]
      }
      get_quiz_data: {
        Args: {
          p_topic_id: string
          p_session_id: string
          p_difficulty_level: number
        }
        Returns: {
          question_data: Json
          availability_data: Json
        }[]
      }
      get_random_question_for_topic: {
        Args: {
          p_topic_id: string
          p_difficulty_level: number
        }
        Returns: {
          id: string
          question: Json
          difficulty_level: number
          points: number
        }[]
      }
    }
    Enums: {
      content_type: "video" | "worksheet" | "interactive" | "assessment"
      grade_level: "K1" | "K2" | "G1" | "G2" | "G3" | "G4" | "G5"
      tool_progress_status: "not_started" | "in_progress" | "completed"
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
