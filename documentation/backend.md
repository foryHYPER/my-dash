# Backend Struktur (Basierend auf Supabase)

Dieses Dokument beschreibt die vorgeschlagene Backend-Struktur für die Anwendung, die sich stark auf Supabase als Backend-as-a-Service (BaaS) stützt.

## 1. Supabase Datenbankstruktur (Tabellen)

Die Kernlogik und Datenhaltung erfolgt in der Supabase PostgreSQL-Datenbank. Folgende Tabellen sind vorgesehen:

### `profiles`
Speichert grundlegende Benutzerinformationen und die Rolle.

- `id` (UUID, Primary Key, referenziert `auth.users.id`)
- `email` (Text, Unique)
- `role` (Enum/Text: 'admin', 'company', 'candidate') - *Wichtig für Berechtigungen.*
- `name` (Text, Optional)
- `avatar_url` (Text, Optional) - *Verweist auf Supabase Storage.*
- `created_at` (Timestamp with time zone, default `now()`)
- `updated_at` (Timestamp with time zone, default `now()`)

### `companies` (Optional, falls detaillierter als `profiles`)
Erweiterte Profilinformationen für Unternehmen.

- `id` (UUID, Primary Key, referenziert `profiles.id`)
- `company_name` (Text)
- `description` (Text, Optional)
- `website` (Text, Optional)
- `location` (Text, Optional)
- ... (weitere unternehmensspezifische Felder, z.B. `industry`, `size`)

### `candidates` (Optional, falls detaillierter als `profiles`)
Erweiterte Profilinformationen für Kandidaten.

- `id` (UUID, Primary Key, referenziert `profiles.id`)
- `headline` (Text, Optional)
- `bio` (Text, Optional)
- `location` (Text, Optional)
- `skills` (Array/JSONB, Optional - z.B. `["React", "Node.js", "SQL"]`)
- `experience` (Text/JSONB, Optional - Struktur für Berufserfahrung definieren)
- `education` (JSONB, Optional - Struktur für Ausbildung definieren)
- `resume_url` (Text, Optional) - *Verweist auf Supabase Storage.*
- ... (weitere kandidatenspezifische Felder)

### `jobs`
Stellenangebote, die von Unternehmen erstellt werden.

- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `company_id` (UUID, Foreign Key zu `profiles.id` WHERE `role='company'`)
- `title` (Text)
- `description` (Text)
- `location` (Text, Optional)
- `salary_range` (Text, Optional)
- `type` (Enum/Text: 'full-time', 'part-time', 'contract', 'internship')
- `status` (Enum/Text: 'open', 'closed', 'draft')
- `created_at` (Timestamp with time zone, default `now()`)
- `updated_at` (Timestamp with time zone, default `now()`)

### `applications`
Bewerbungen von Kandidaten auf Stellenangebote.

- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `job_id` (UUID, Foreign Key zu `jobs.id`)
- `candidate_id` (UUID, Foreign Key zu `profiles.id` WHERE `role='candidate'`)
- `status` (Enum/Text: 'pending', 'viewed', 'interviewing', 'offered', 'accepted', 'rejected')
- `cover_letter` (Text, Optional)
- `submitted_at` (Timestamp with time zone, default `now()`)
- `updated_at` (Timestamp with time zone, default `now()`)

### `interviews` / `appointments`
Geplante Gespräche oder Termine zwischen Unternehmen und Kandidaten.

- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `application_id` (UUID, Foreign Key zu `applications.id`)
- `company_id` (UUID, Foreign Key zu `profiles.id` WHERE `role='company'`)
- `candidate_id` (UUID, Foreign Key zu `profiles.id` WHERE `role='candidate'`)
- `scheduled_time` (Timestamp with time zone)
- `duration_minutes` (Integer, Optional)
- `location` (Text, Optional - z.B. 'Online (Google Meet)', 'Büro Berlin')
- `type` (Enum/Text: 'screening', 'technical', 'behavioral', 'final', 'in-person')
- `status` (Enum/Text: 'scheduled', 'completed', 'canceled_by_company', 'canceled_by_candidate', 'pending_confirmation')
- `notes_company` (Text, Optional - Interne Notizen des Unternehmens)
- `notes_candidate` (Text, Optional - Interne Notizen des Kandidaten)
- `feedback_company` (Text, Optional - Feedback nach dem Gespräch)
- `created_at` (Timestamp with time zone, default `now()`)
- `updated_at` (Timestamp with time zone, default `now()`)

## 2. Supabase Edge Functions (Optional)

Für serverseitige Logik, die über einfache DB-Operationen hinausgeht.

- `/functions/send-notifications`: Versendet E-Mails/Benachrichtigungen bei Ereignissen (neue Bewerbung, Statusänderung, Interview-Einladung).
- `/functions/process-application`: Führt Validierungen durch, aktualisiert Zähler, etc.
- `/functions/match-candidates`: (Fortgeschritten) Schlägt Kandidaten für Jobs vor.
- `/functions/generate-report`: Erstellt Berichte für Unternehmen.

## 3. Supabase Storage

Zur Speicherung von Binärdaten.

- **Avatare:** Verlinkt über `profiles.avatar_url`.
- **Lebensläufe:** Verlinkt über `candidates.resume_url` oder eine separate `documents`-Tabelle.
- **Job-Anhänge:** Ggf. zusätzliche Dateien zu Stellenangeboten.

## 4. Row Level Security (RLS) Policies

**Dies ist der wichtigste Aspekt für die Sicherheit!** RLS-Richtlinien stellen sicher, dass Benutzer nur auf die Daten zugreifen können, für die sie berechtigt sind.

- **`profiles`:**
  - `SELECT`: Authentifizierte Benutzer können ihr eigenes Profil sehen. Admins können alle sehen. Ggf. können Unternehmen/Kandidaten öffentliche Teile anderer Profile sehen.
  - `UPDATE`: Benutzer können nur ihr eigenes Profil bearbeiten. Admins können alle bearbeiten.
- **`companies` / `candidates`:**
  - `SELECT`/`UPDATE`: Ähnlich wie `profiles`, basierend auf der verknüpften `id`.
- **`jobs`:**
  - `SELECT`: Authentifizierte Benutzer können Jobs mit Status 'open' sehen.
  - `INSERT`: Nur Benutzer mit Rolle 'company' oder 'admin'.
  - `UPDATE`/`DELETE`: Nur der Ersteller (`company_id == auth.uid()`) oder Admins.
- **`applications`:**
  - `SELECT`: Kandidaten sehen nur ihre eigenen (`candidate_id == auth.uid()`). Unternehmen sehen nur die für ihre Jobs (`job_id` gehört zu `company_id == auth.uid()`). Admins sehen alle.
  - `INSERT`: Nur Benutzer mit Rolle 'candidate'.
  - `UPDATE`: Kandidaten können ggf. den Status ihrer Bewerbung ändern (z.B. zurückziehen). Unternehmen können den Status ändern. Admins können alles ändern.
- **`interviews` / `appointments`:**
  - `SELECT`: Kandidaten sehen ihre (`candidate_id == auth.uid()`). Unternehmen sehen ihre (`company_id == auth.uid()`). Admins sehen alle.
  - `INSERT`: Unternehmen oder Admins.
  - `UPDATE`/`DELETE`: Beteiligte Parteien (je nach Status) oder Admins.

**Wichtig:** Standardmäßig sollte der Zugriff verweigert werden (`DENY`), und dann explizite `ALLOW`-Regeln für die benötigten Operationen hinzugefügt werden.

## 5. Next.js Integration

Die Interaktion zwischen Frontend und Supabase erfolgt über:

- **Server Actions (`app/.../actions.ts`):** Primär für Datenmutationen (Formularverarbeitung, Erstellen, Aktualisieren, Löschen). Sicherer direkter Zugriff auf Supabase vom Server.
- **Server Components:** Direkter Datenabruf (`SELECT`) aus Supabase für das serverseitige Rendering von Seiten.
- **Client Components:** Verwendung von `createClient` für Echtzeit-Abonnements oder clientseitige Interaktionen, wo nötig.
- **API Routes (`app/api/...`):** Für komplexere Endpunkte oder Integrationen, die nicht gut in Server Actions passen.
- **Middleware (`middleware.ts`):** Zur Überprüfung der Authentifizierung und ggf. Weiterleitung basierend auf der Rolle, bevor Seiten oder API-Routen erreicht werden.

Diese Struktur nutzt die Stärken von Supabase und Next.js, um ein robustes, sicheres und skalierbares Backend für die Job-Plattform zu schaffen.
