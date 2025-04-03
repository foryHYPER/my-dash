'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/service-role'
import { createClient } from '@/lib/supabase/server'

// Type for user management
type UserManagementResult = {
  success: boolean
  error?: string
}

/**
 * Delete a user and all their associated data
 * This action requires admin privileges
 */
export async function deleteUser(userId: string): Promise<UserManagementResult> {
  try {
    // First, verify that the requesting user has admin privileges
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if the current user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Insufficient permissions' }
    }

    // Delete user's profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      throw profileError
    }

    // Delete the user's auth record
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      throw authError
    }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }
  }
}

/**
 * Update a user's role
 * This action requires admin privileges
 */
export async function updateUserRole(userId: string, newRole: 'admin' | 'company' | 'candidate'): Promise<UserManagementResult> {
  try {
    // Verify admin privileges
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if the current user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Insufficient permissions' }
    }

    // Update the user's role
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (updateError) {
      throw updateError
    }

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }
  }
}

/**
 * Get all users with their profiles
 * This action requires admin privileges
 */
export async function getAllUsers() {
  try {
    // Verify admin privileges
    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if the current user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Insufficient permissions' }
    }

    // Get all users using the admin client
    const { data: users, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      throw authError
    }

    // Get all profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')

    if (profileError) {
      throw profileError
    }

    // Combine user and profile data
    const usersWithProfiles = users.users.map(user => {
      const userProfile = profiles.find(profile => profile.id === user.id)
      return {
        ...user,
        profile: userProfile || null
      }
    })

    return { success: true, data: usersWithProfiles }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }
  }
} 