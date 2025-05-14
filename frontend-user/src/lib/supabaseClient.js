import { createClient } from "@supabase/supabase-js";

// Lấy các biến môi trường từ .env.local (đặt đúng trong dự án của bạn)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Khởi tạo client với các config đảm bảo id_token được trả về trong session
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    flowType: "pkce",
  },
});
