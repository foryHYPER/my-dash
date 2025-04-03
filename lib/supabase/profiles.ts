export type Role = 'admin' | 'company' | 'candidate'

export interface Profile {
  id: string
  email?: string
  full_name?: string
  role?: Role
  created_at?: string
  updated_at?: string
} 