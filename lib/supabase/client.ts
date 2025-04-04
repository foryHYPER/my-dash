// /utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase-Umgebungsvariablen fehlen. Die Anwendung wird möglicherweise nicht korrekt funktionieren.");
    
    // Wenn wir in einem Browser sind, können wir entweder:
    // 1. Zur Fehlerseite umleiten
    if (typeof window !== 'undefined') {
      window.location.href = '/api/error?message=missing_env_vars';
      // Gib eine temporäre Client-Instanz zurück, damit der Code nicht abstürzt,
      // während die Umleitung stattfindet
      return createBrowserClient(
        'https://placeholder-url.supabase.co',
        'placeholder-key'
      );
    }
  }
  
  console.log("Client Supabase Connection:");
  console.log("URL provided:", !!supabaseUrl);
  console.log("Key provided:", !!supabaseKey);
  
  // Bei der tatsächlichen Client-Erstellung wissen wir, dass die Werte vorhanden sind
  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  );
}