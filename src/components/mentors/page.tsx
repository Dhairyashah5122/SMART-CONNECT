

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
import { UserPlus, Trash2, Edit, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' '),
            fullName: name,
            email,
            role: 'Mentor',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            mentorProfile: {
              skills: skills.split(',').map(s => s.trim()).filter(Boolean),
              status,
              pastProjects: [],
              menteeIds: [],
            }
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

function EditSkillsDialog({ mentor, onSkillsUpdate }: { mentor: Mentor, onSkillsUpdate: (mentorId: string, skills: string[]) => void }) {
    const [currentSkills, setCurrentSkills] = useState(mentor.mentorProfile.skills);
    const [newSkill, setNewSkill] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleAddSkill = () => {
        if(newSkill && !currentSkills.includes(newSkill)) {
            setCurrentSkills([...currentSkills, newSkill]);
            setNewSkill('');
        }
    }
    
    const handleRemoveSkill = (skillToRemove: string) => {
        setCurrentSkills(currentSkills.filter(skill => skill !== skillToRemove));
    }

    const handleSave = () => {
        onSkillsUpdate(mentor.id, currentSkills);
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Skills for {mentor.fullName}</DialogTitle>
                    <DialogDescription>Add or remove skills below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Add new skill" 
                            value={newSkill} 
                            onChange={(e) => setNewSkill(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill();}}}
                        />
                        <Button onClick={handleAddSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-secondary/50">
                        {currentSkills.length > 0 ? (
                             currentSkills.map(skill => (
                                <Badge key={skill} variant="default">
                                    {skill}
                                    <button onClick={() => handleRemoveSkill(skill)} className="ml-2 rounded-full hover:bg-white/20 p-0.5">
                                        <X className="h-3 w-3"/>
                                    </button>
                                </Badge>
                             ))
                        ) : (
                            <p className="text-sm text-muted-foreground p-2">No skills assigned.</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}><Check className="mr-2"/>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function EditProjectsDialog({ mentor, onProjectsUpdate }: { mentor: Mentor, onProjectsUpdate: (mentorId: string, projects: string[]) => void }) {
    const [currentProjects, setCurrentProjects] = useState(mentor.mentorProfile.pastProjects);
    const [newProject, setNewProject] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleAddProject = () => {
        if(newProject && !currentProjects.includes(newProject)) {
            setCurrentProjects([...currentProjects, newProject]);
            setNewProject('');
        }
    }
    
    const handleRemoveProject = (projectToRemove: string) => {
        setCurrentProjects(currentProjects.filter(project => project !== projectToRemove));
    }

    const handleSave = () => {
        onProjectsUpdate(mentor.id, currentProjects);
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Past Projects for {mentor.fullName}</DialogTitle>
                    <DialogDescription>Add or remove past project titles below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Add new project title" 
                            value={newProject} 
                            onChange={(e) => setNewProject(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddProject();}}}
                        />
                        <Button onClick={handleAddProject}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-secondary/50">
                        {currentProjects.length > 0 ? (
                             currentProjects.map(project => (
                                <Badge key={project} variant="secondary">
                                    {project}
                                    <button onClick={() => handleRemoveProject(project)} className="ml-2 rounded-full hover:bg-black/20 dark:hover:bg-white/20 p-0.5">
                                        <X className="h-3 w-3"/>
                                    </button>
                                </Badge>
                             ))
                        ) : (
                            <p className="text-sm text-muted-foreground p-2">No past projects listed.</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}><Check className="mr-2"/>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function MentorList({ mentors, onRemoveMentor, onUpdateMentorSkills, onUpdateMentorProjects }: { mentors: Mentor[], onRemoveMentor: (id: string) => void, onUpdateMentorSkills: (id: string, skills: string[]) => void, onUpdateMentorProjects: (id: string, projects: string[]) => void }) {
    
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
                            <TableHead>Past Projects</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Mentees</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mentors.map(mentor => (
                            <TableRow key={mentor.id}>
                                <TableCell className="font-medium">{mentor.fullName}</TableCell>
                                <TableCell>{mentor.email}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {mentor.mentorProfile.skills.slice(0, 2).map(skill => (
                                                <Badge key={skill} variant="secondary">{skill}</Badge>
                                            ))}
                                            {mentor.mentorProfile.skills.length > 2 && <Badge variant="outline">+{mentor.mentorProfile.skills.length - 2}</Badge>}
                                        </div>
                                         <EditSkillsDialog mentor={mentor} onSkillsUpdate={onUpdateMentorSkills}/>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {mentor.mentorProfile.pastProjects.slice(0, 1).map(project => (
                                                <Badge key={project} variant="outline" className="truncate">{project}</Badge>
                                            ))}
                                             {mentor.mentorProfile.pastProjects.length > 1 && <Badge variant="outline">+{mentor.mentorProfile.pastProjects.length - 1}</Badge>}
                                        </div>
                                         <EditProjectsDialog mentor={mentor} onProjectsUpdate={onUpdateMentorProjects}/>
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <Badge variant={getStatusVariant(mentor.mentorProfile.status)} className={getStatusClass(mentor.mentorProfile.status)}>
                                        {mentor.mentorProfile.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{students.filter(s => s.studentProfile.mentorId === mentor.id).length}</TableCell>
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
    
    const updateMentorSkills = (mentorId: string, skills: string[]) => {
        setMentors(prev => prev.map(m => m.id === mentorId ? {...m, mentorProfile: { ...m.mentorProfile, skills } } : m));
        toast({
            title: 'Skills Updated',
            description: `Skills for mentor have been successfully updated.`,
        });
    }

    const updateMentorProjects = (mentorId: string, projects: string[]) => {
        setMentors(prev => prev.map(m => m.id === mentorId ? {...m, mentorProfile: { ...m.mentorProfile, pastProjects: projects } } : m));
        toast({
            title: 'Past Projects Updated',
            description: `Past projects for mentor have been successfully updated.`,
        });
    }

    const removeMentor = (id: string) => {
        const mentorToRemove = mentors.find(m => m.id === id);
        if (students.some(s => s.studentProfile.mentorId === id)) {
            toast({
                variant: 'destructive',
                title: 'Cannot Remove Mentor',
                description: `${mentorToRemove?.fullName} is currently assigned to students and cannot be removed.`,
            });
            return;
        }

        setMentors(prev => prev.filter(mentor => mentor.id !== id));
        toast({
            title: 'Mentor Removed',
            description: `${mentorToRemove?.fullName} has been removed.`,
        });
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold">Mentor Management</h1>
                <p className="text-muted-foreground">Add, view, or remove mentors from the program.</p>
            </div>
            <AddMentorForm onAddMentor={addMentor} />
            <MentorList 
                mentors={mentors} 
                onRemoveMentor={removeMentor} 
                onUpdateMentorSkills={updateMentorSkills}
                onUpdateMentorProjects={updateMentorProjects} 
            />
        </div>
    )
}
