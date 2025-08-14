

"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { mentors as initialMentors, students } from "@/lib/data";
import type { Mentor } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type MentorStatus = 'Active' | 'Inactive' | 'Available' | 'Not Available';

function AddMentorForm({ onAddMentor }: { onAddMentor: (mentor: Mentor) => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [skills, setSkills] = useState('');
    const [status, setStatus] = useState<MentorStatus>('Available');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !skills) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill out all fields to add a mentor.',
            });
            return;
        }

        const newMentor: Mentor = {
            id: `m${Date.now()}`,
            name,
            email,
            skills: skills.split(',').map(s => s.trim()),
            status,
            pastProjects: [],
            mentees: [],
        };

        onAddMentor(newMentor);
        setName('');
        setEmail('');
        setSkills('');
        setStatus('Available');

        toast({
            title: 'Mentor Added',
            description: `${name} has been successfully added.`,
        });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Mentor</CardTitle>
                <CardDescription>Fill in the details to add a new mentor to the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="mentor-name">Full Name</Label>
                        <Input id="mentor-name" placeholder="Dr. Evelyn Reed" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="mentor-email">Email Address</Label>
                        <Input id="mentor-email" type="email" placeholder="e.reed@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="mentor-status">Status</Label>
                        <Select value={status} onValueChange={(value: MentorStatus) => setStatus(value)}>
                            <SelectTrigger id="mentor-status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="Not Available">Not Available</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 md:col-span-3">
                        <Label htmlFor="mentor-skills">Skills (comma-separated)</Label>
                        <Textarea id="mentor-skills" placeholder="AI/ML, Data Science, Python..." value={skills} onChange={e => setSkills(e.target.value)} />
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                         <Button type="submit">
                            <UserPlus className="mr-2"/> Add Mentor
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

function MentorList({ mentors, onRemoveMentor }: { mentors: Mentor[], onRemoveMentor: (id: string) => void }) {
    
    const getStatusVariant = (status: MentorStatus) => {
        switch (status) {
            case 'Active':
            case 'Available':
                return 'default';
            case 'Inactive':
                return 'secondary';
            case 'Not Available':
                return 'destructive';
            default:
                return 'outline';
        }
    }
    
    const getStatusClass = (status: MentorStatus) => {
         switch (status) {
            case 'Active':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
             case 'Available':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            case 'Not Available':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default:
                return '';
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Mentors</CardTitle>
                <CardDescription>A list of all mentors in the program.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Skills</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Mentees</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mentors.map(mentor => (
                            <TableRow key={mentor.id}>
                                <TableCell className="font-medium">{mentor.name}</TableCell>
                                <TableCell>{mentor.email}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {mentor.skills.slice(0, 4).map(skill => (
                                            <Badge key={skill} variant="secondary">{skill}</Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <Badge variant={getStatusVariant(mentor.status)} className={getStatusClass(mentor.status)}>
                                        {mentor.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{students.filter(s => s.mentorId === mentor.id).length}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => onRemoveMentor(mentor.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function MentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
    const { toast } = useToast();

    const addMentor = (mentor: Mentor) => {
        setMentors(prev => [...prev, mentor]);
    }

    const removeMentor = (id: string) => {
        const mentorToRemove = mentors.find(m => m.id === id);
        if (students.some(s => s.mentorId === id)) {
            toast({
                variant: 'destructive',
                title: 'Cannot Remove Mentor',
                description: `${mentorToRemove?.name} is currently assigned to students and cannot be removed.`,
            });
            return;
        }

        setMentors(prev => prev.filter(mentor => mentor.id !== id));
        toast({
            title: 'Mentor Removed',
            description: `${mentorToRemove?.name} has been removed.`,
        });
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold">Mentor Management</h1>
                <p className="text-muted-foreground">Add, view, or remove mentors from the program.</p>
            </div>
            <AddMentorForm onAddMentor={addMentor} />
            <MentorList mentors={mentors} onRemoveMentor={removeMentor} />
        </div>
    )
}
