import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          member_id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          membership_type: string;
          status: 'active' | 'blocked' | 'inactive';
          membership_fee_paid: boolean;
          bank_details: string | null;
          qr_code_url: string | null;
          coordinator_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          membership_type: string;
          status?: 'active' | 'blocked' | 'inactive';
          membership_fee_paid?: boolean;
          bank_details?: string | null;
          qr_code_url?: string | null;
          coordinator_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          membership_type?: string;
          status?: 'active' | 'blocked' | 'inactive';
          membership_fee_paid?: boolean;
          bank_details?: string | null;
          qr_code_url?: string | null;
          coordinator_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'admin' | 'manager' | 'coordinator';
          password_hash: string;
          permissions: string[];
          status: 'active' | 'inactive';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: 'admin' | 'manager' | 'coordinator';
          password_hash: string;
          permissions?: string[];
          status?: 'active' | 'inactive';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'admin' | 'manager' | 'coordinator';
          password_hash?: string;
          permissions?: string[];
          status?: 'active' | 'inactive';
          created_at?: string;
        };
      };
      donation_receipts: {
        Row: {
          id: string;
          receipt_no: string;
          date: string;
          payment_method: string;
          donator_name: string;
          amount: number;
          amount_in_words: string;
          pan_number: string | null;
          aadhar_number: string | null;
          received_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          receipt_no: string;
          date: string;
          payment_method: string;
          donator_name: string;
          amount: number;
          amount_in_words: string;
          pan_number?: string | null;
          aadhar_number?: string | null;
          received_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          receipt_no?: string;
          date?: string;
          payment_method?: string;
          donator_name?: string;
          amount?: number;
          amount_in_words?: string;
          pan_number?: string | null;
          aadhar_number?: string | null;
          received_by?: string;
          created_at?: string;
        };
      };
      volunteer_certificates: {
        Row: {
          id: string;
          certificate_no: string;
          volunteer_name: string;
          email: string;
          phone: string | null;
          volunteer_type: string;
          hours_contributed: number;
          start_date: string;
          end_date: string;
          achievements: string | null;
          supervisor_name: string;
          certificate_type: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          certificate_no: string;
          volunteer_name: string;
          email: string;
          phone?: string | null;
          volunteer_type: string;
          hours_contributed: number;
          start_date: string;
          end_date: string;
          achievements?: string | null;
          supervisor_name: string;
          certificate_type: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          certificate_no?: string;
          volunteer_name?: string;
          email?: string;
          phone?: string | null;
          volunteer_type?: string;
          hours_contributed?: number;
          start_date?: string;
          end_date?: string;
          achievements?: string | null;
          supervisor_name?: string;
          certificate_type?: string;
          status?: string;
          created_at?: string;
        };
      };
      appointment_letters: {
        Row: {
          id: string;
          letter_no: string;
          member_id: string;
          position: string;
          appointment_date: string;
          terms: string | null;
          qr_code_url: string | null;
          issued_by: string;
          status: 'active' | 'revoked';
          created_at: string;
        };
        Insert: {
          id?: string;
          letter_no: string;
          member_id: string;
          position: string;
          appointment_date: string;
          terms?: string | null;
          qr_code_url?: string | null;
          issued_by: string;
          status?: 'active' | 'revoked';
          created_at?: string;
        };
        Update: {
          id?: string;
          letter_no?: string;
          member_id?: string;
          position?: string;
          appointment_date?: string;
          terms?: string | null;
          qr_code_url?: string | null;
          issued_by?: string;
          status?: 'active' | 'revoked';
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          event_date: string;
          location: string;
          images: string[];
          youtube_links: string[];
          status: 'upcoming' | 'completed' | 'cancelled';
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          event_date: string;
          location: string;
          images?: string[];
          youtube_links?: string[];
          status?: 'upcoming' | 'completed' | 'cancelled';
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          event_date?: string;
          location?: string;
          images?: string[];
          youtube_links?: string[];
          status?: 'upcoming' | 'completed' | 'cancelled';
          created_by?: string;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          objectives: string[];
          status: 'active' | 'completed' | 'paused';
          start_date: string;
          end_date: string | null;
          budget: number | null;
          images: string[];
          documents: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          objectives?: string[];
          status?: 'active' | 'completed' | 'paused';
          start_date: string;
          end_date?: string | null;
          budget?: number | null;
          images?: string[];
          documents?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          objectives?: string[];
          status?: 'active' | 'completed' | 'paused';
          start_date?: string;
          end_date?: string | null;
          budget?: number | null;
          images?: string[];
          documents?: string[];
          created_at?: string;
        };
      };
      organization_awards: {
        Row: {
          id: string;
          title: string;
          description: string;
          awarded_by: string;
          award_date: string;
          certificate_url: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          awarded_by: string;
          award_date: string;
          certificate_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          awarded_by?: string;
          award_date?: string;
          certificate_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      member_problems: {
        Row: {
          id: string;
          member_name: string;
          email: string;
          phone: string;
          problem_description: string;
          category: string;
          priority: 'low' | 'medium' | 'high';
          status: 'open' | 'in_progress' | 'resolved';
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_name: string;
          email: string;
          phone: string;
          problem_description: string;
          category: string;
          priority?: 'low' | 'medium' | 'high';
          status?: 'open' | 'in_progress' | 'resolved';
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_name?: string;
          email?: string;
          phone?: string;
          problem_description?: string;
          category?: string;
          priority?: 'low' | 'medium' | 'high';
          status?: 'open' | 'in_progress' | 'resolved';
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_reports: {
        Row: {
          id: string;
          year: number;
          title: string;
          description: string;
          report_url: string;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          year: number;
          title: string;
          description: string;
          report_url: string;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          year?: number;
          title?: string;
          description?: string;
          report_url?: string;
          uploaded_by?: string;
          created_at?: string;
        };
      };
      management_team: {
        Row: {
          id: string;
          name: string;
          position: string;
          bio: string;
          image_url: string | null;
          email: string;
          phone: string | null;
          order_index: number;
          status: 'active' | 'inactive';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position: string;
          bio: string;
          image_url?: string | null;
          email: string;
          phone?: string | null;
          order_index?: number;
          status?: 'active' | 'inactive';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: string;
          bio?: string;
          image_url?: string | null;
          email?: string;
          phone?: string | null;
          order_index?: number;
          status?: 'active' | 'inactive';
          created_at?: string;
        };
      };
      website_content: {
        Row: {
          id: string;
          section: string;
          content_key: string;
          content_value: string;
          language: 'en' | 'hi';
          updated_by: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: string;
          content_key: string;
          content_value: string;
          language?: 'en' | 'hi';
          updated_by: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section?: string;
          content_key?: string;
          content_value?: string;
          language?: 'en' | 'hi';
          updated_by?: string;
          updated_at?: string;
        };
      };
    };
  };
};