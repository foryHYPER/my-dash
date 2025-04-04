// /utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase Umgebungsvariablen fehlen. Stelle sicher, dass NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in der .env.local Datei korrekt definiert sind.");
  }
  
  console.log("Client Supabase Connection:");
  console.log("URL provided:", !!supabaseUrl);
  console.log("Key provided:", !!supabaseKey);
  
  return createBrowserClient(
    supabaseUrl || "",
    supabaseKey || ""
  );
}