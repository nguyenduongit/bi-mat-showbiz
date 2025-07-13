// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Vite sử dụng import.meta.env để truy cập biến môi trường
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
