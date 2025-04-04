import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const message = searchParams.get('message') || 'unknown_error';
  
  // Leite zur Fehlerseite mit der Fehlermeldung weiter
  redirect(`/error?message=${message}`);
} 