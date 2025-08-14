

"use client"

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { students, mentors } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import type { User, UserRole } from '@/lib/types';


const adminUsers: User[] = [
    {
        id: 'admin1',
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        email: 'admin@synergyscope.com',
        role: 'Admin',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        profilePhotoUrl: `https://i.pravatar.cc/150?u=admin1`
    }
];

const studentUsers: User[] = students.map(s => ({...s, profilePhotoUrl: `https://i.pravatar.cc/150?u=${s.id}`}));
const mentorUsers: User[] = mentors.map(m => ({...m, profilePhotoUrl: `https://i.pravatar.cc/150?u=${m.id}`}));


export function RoleManager() {
  const [users, setUsers] = useState<User[]>([...adminUsers, ...mentorUsers, ...studentUsers]);
  const { toast } = useToast();

  const handleRoleChange = (userId: string, newRole: UserRole) => {
      const userToUpdate = users.find(u => u.id === userId);
      if (userToUpdate?.role === 'Admin' && users.filter(u => u.role === 'Admin').length === 1) {
          toast({
              variant: 'destructive',
              title: 'Cannot Change Role',
              description: 'You cannot remove the last administrator.'
          });
          return;
      }
      
      setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
          title: 'Role Updated',
          description: `${userToUpdate?.fullName}'s role has been changed to ${newRole}.`
      })
  }
  
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'destructive';
      case 'Mentor':
        return 'default';
      case 'Student':
        return 'secondary';
      default:
        return 'outline';
    }
  };


  return (
    <Card>
       <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Assign roles to users in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead className="w-[180px]">Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                 <TableCell className="font-medium">
                   <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profilePhotoUrl} data-ai-hint="person" />
                        <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.fullName}
                   </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                    </Badge>
                </TableCell>
                <TableCell>
                     <Select value={user.role} onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}>
                        <SelectTrigger id={`role-${user.id}`}>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Mentor">Mentor</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
