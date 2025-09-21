"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { User, UserRole, UserProvider } from "@/lib/auth";
import { 
    UserPlus, 
    Search, 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Shield, 
    Calendar,
    Users,
    GraduationCap,
    Building,
    UserCheck
} from "lucide-react";

export default function AdminUsersPage() {
    const { user, getUsers, addUser, updateUser, deleteUser } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student' as UserRole,
        provider: 'email' as UserProvider,
        avatar: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, selectedRole]);

    const loadUsers = async () => {
        try {
            const userList = await getUsers();
            setUsers(userList);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load users",
                variant: "destructive"
            });
        }
    };

    const filterUsers = () => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedRole !== 'all') {
            filtered = filtered.filter(user => user.role === selectedRole);
        }

        setFilteredUsers(filtered);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'student',
            provider: 'email',
            avatar: ''
        });
        setIsDialogOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            provider: user.provider,
            avatar: user.avatar || ''
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
                toast({
                    title: "Success",
                    description: "User updated successfully"
                });
            } else {
                // Add default permissions based on role
                const getRolePermissions = (role: UserRole): string[] => {
                    switch (role) {
                        case 'admin':
                            return ['read', 'write', 'delete', 'admin'];
                        case 'mentor':
                        case 'company':
                            return ['read', 'write'];
                        case 'student':
                        default:
                            return ['read'];
                    }
                };

                const userDataWithPermissions = {
                    ...formData,
                    permissions: getRolePermissions(formData.role)
                };

                await addUser(userDataWithPermissions);
                toast({
                    title: "Success",
                    description: "User added successfully"
                });
            }
            
            setIsDialogOpen(false);
            loadUsers();
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${editingUser ? 'update' : 'add'} user`,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await deleteUser(userId);
            toast({
                title: "Success",
                description: "User deleted successfully"
            });
            loadUsers();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive"
            });
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'student': return <GraduationCap className="h-4 w-4" />;
            case 'mentor': return <UserCheck className="h-4 w-4" />;
            case 'company': return <Building className="h-4 w-4" />;
            case 'admin': return <Shield className="h-4 w-4" />;
            default: return <Users className="h-4 w-4" />;
        }
    };

    const getRoleBadgeVariant = (role: UserRole) => {
        switch (role) {
            case 'admin': return 'default';
            case 'mentor': return 'secondary';
            case 'company': return 'outline';
            default: return 'secondary';
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>
                            You don't have permission to access this page. Admin access required.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage users, roles, and permissions
                    </p>
                </div>
                <Button onClick={handleAddUser}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.role === 'student').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mentors</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.role === 'mentor').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Companies</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.role === 'company').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        Search and filter users by role
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="student">Students</SelectItem>
                                <SelectItem value="mentor">Mentors</SelectItem>
                                <SelectItem value="company">Companies</SelectItem>
                                <SelectItem value="admin">Admins</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Users Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback>
                                                        {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                                                {getRoleIcon(user.role)}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No users found matching your criteria
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit User Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingUser ? 'Update user information and role' : 'Create a new user account'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email address"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select 
                                value={formData.role} 
                                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="mentor">Mentor</SelectItem>
                                    <SelectItem value="company">Company</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="provider">Provider</Label>
                            <Select 
                                value={formData.provider} 
                                onValueChange={(value) => setFormData({ ...formData, provider: value as UserProvider })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="google">Google</SelectItem>
                                    <SelectItem value="microsoft">Microsoft</SelectItem>
                                    <SelectItem value="westcliff">Westcliff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Avatar URL (optional)</Label>
                            <Input
                                id="avatar"
                                type="url"
                                value={formData.avatar}
                                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                    </form>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Saving...' : editingUser ? 'Update User' : 'Add User'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}