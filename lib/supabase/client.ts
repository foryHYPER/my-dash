// /utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

// Fallback values in case environment variables aren't available
const SUPABASE_URL = "https://uzthbqcqitljcymiohwe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dGhicWNxaXRsamN5bWlvaHdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzk2MzYsImV4cCI6MjA1ODg1NTYzNn0.y_EzraG-VTirim57R1Qbo_jLdWAWHoNwucoy7Oxy4E8";

export function createClient() {
  // Use environment variables if available, otherwise fall back to hardcoded values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;
  
  console.log("Client Supabase Connection:");
  console.log("URL provided:", !!supabaseUrl);
  console.log("Key provided:", !!supabaseKey);
  
  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
}