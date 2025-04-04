// /utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase-Umgebungsvariablen fehlen. Die Anwendung wird möglicherweise nicht korrekt funktionieren.");
  }
  
  console.log("Client Supabase Connection:");
  console.log("URL provided:", !!supabaseUrl);
  console.log("Key provided:", !!supabaseKey);
  
  return createBrowserClient(
    supabaseUrl || '',
    supabaseKey || ''
  );
}