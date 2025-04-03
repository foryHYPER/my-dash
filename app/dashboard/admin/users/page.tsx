'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { deleteUser, updateUserRole, getAllUsers } from '@/app/actions/admin'

type Role = 'admin' | 'company' | 'candidate'

interface User {
  id: string
  email: string
  last_sign_in_at: string
  profile?: {
    role: Role
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | ''>('')

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const result = await getAllUsers()
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch users')
      }

      // Transform the data to match our User type
      const transformedUsers: User[] = result.data.map(user => ({
        id: user.id,
        email: user.email || '',
        last_sign_in_at: user.last_sign_in_at || new Date().toISOString(),
        profile: user.profile ? {
          role: (user.profile.role as Role) || 'candidate'
        } : undefined
      }))

      setUsers(transformedUsers)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
      if (err instanceof Error && err.message.includes('Insufficient permissions')) {
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser) return

    try {
      const result = await deleteUser(selectedUser.id)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      setUsers(users.filter(user => user.id !== selectedUser.id))
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  async function handleUpdateRole() {
    if (!selectedUser || !selectedRole) return

    try {
      const result = await updateUserRole(selectedUser.id, selectedRole)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, profile: { ...user.profile, role: selectedRole } }
          : user
      ))
      setIsRoleDialogOpen(false)
      setSelectedUser(null)
      setSelectedRole('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.profile?.role || 'N/A'}</TableCell>
              <TableCell>{new Date(user.last_sign_in_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user)
                      setIsRoleDialogOpen(true)
                    }}
                  >
                    Change Role
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedUser(user)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a new role for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={setSelectedRole as (value: string) => void}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 