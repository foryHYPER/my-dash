import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role = 'candidate' } = await request.json()
    
    // Überprüfe, ob alle erforderlichen Felder vorhanden sind
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 }
      )
    }
    
    // Überprüfe, ob die Rolle gültig ist
    if (!['candidate', 'company'].includes(role)) {
      return NextResponse.json(
        { error: 'Ungültige Rolle. Erlaubte Werte: candidate, company' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Erstelle den Benutzer
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    })
    
    if (authError) {
      console.error('Fehler bei der Registrierung:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }
    
    // Stelle sicher, dass der Benutzer erstellt wurde
    if (!authData.user) {
      return NextResponse.json(
        { error: 'Benutzer konnte nicht erstellt werden' },
        { status: 500 }
      )
    }
    
    // Erstelle den Profileintrag in der profiles-Tabelle
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authData.user.id,
          email: email,
          full_name: fullName || '',
          role: role,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
    
    if (profileError) {
      console.error('Fehler beim Erstellen des Profils:', profileError)
      // Wir löschen den Benutzer nicht, da das Profil beim ersten Login
      // auch über die Trigger in Supabase erstellt werden kann
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Benutzer erfolgreich registriert',
      user: authData.user,
    })
  } catch (error) {
    console.error('Unerwarteter Fehler bei der Registrierung:', error)
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
} 