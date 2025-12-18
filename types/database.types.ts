export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          avatar_url: string | null;
          display_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          avatar_url?: string | null;
          display_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          avatar_url?: string | null;
          display_name?: string | null;
          updated_at?: string | null;
        };
      };
      forum_posts: {
        Row: {
          id: string;
          user_id: string | null;
          user_name: string;
          user_avatar: string;
          title: string;
          content: string;
          category: string;
          tags: string[];
          likes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          user_name: string;
          user_avatar: string;
          title: string;
          content: string;
          category: string;
          tags: string[];
          likes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          user_name?: string;
          user_avatar?: string;
          title?: string;
          content?: string;
          category?: string;
          tags?: string[];
          likes?: number;
          created_at?: string;
        };
      };
      forum_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string | null;
          user_name: string;
          user_avatar: string;
          content: string;
          likes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id?: string | null;
          user_name: string;
          user_avatar: string;
          content: string;
          likes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string | null;
          user_name?: string;
          user_avatar?: string;
          content?: string;
          likes?: number;
          created_at?: string;
        };
      };
      forum_likes: {
        Row: {
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      comment_likes: {
        Row: {
          user_id: string;
          comment_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          comment_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          comment_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
