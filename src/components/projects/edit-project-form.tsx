
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projects, students as allStudents, mentors as allMentors, courses as allCourses } from "@/lib/data";
import { Save, Trash2, UserPlus, BookPlus, UserCheck } from "lucide-react";
import type { Project, Student, Mentor, Course } from "@/lib/types";
import { MultiSelect } from "../ui/multi-select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";

export function EditProjectForm() {
    // In a real app, you'd fetch the project data based on an ID.
    // We'll use the first project and allow editing it.
    const [project, setProject] = useState<Project>(projects[0]);
    const { toast } = useToast();

    const assignedStudents = allStudents.filter(s => project.studentIds.includes(s.id));
    const unassignedStudents = allStudents.filter(s => !s.projectId || s.projectId === project.id);
    
    const assignedMentors = allMentors.filter(m => project.mentorIds.includes(m.id));
    
    const assignedCourses = allCourses.filter(c => project.courseIds.includes(c.id));

    const handleStudentChange = (value: string[]) => {
        setProject(p => ({ ...p, studentIds: value }));
    }

    const handleMentorChange = (value: string[]) => {
        setProject(p => ({ ...p, mentorIds: value }));
    }
    
    const handleCourseChange = (value: string[]) => {
        setProject(p => ({ ...p, courseIds: value }));
    }

    const handleSaveChanges = () => {
        // Here you would typically send the updated `project` object to your backend.
        console.log("Saving project:", project);
        toast({
            title: "Project Saved",
            description: `Changes to "${project.name}" have been saved successfully.`,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Project Details</CardTitle>
                <CardDescription>Update the information and assigned personnel for "{project.name}".</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {/* Basic Project Details */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="project-name">Project Name</Label>
                                <Input id="project-name" value={project.name} onChange={e => setProject(p => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company-name">Company</Label>
                                <Input id="company-name" value={project.company} disabled />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={project.description} onChange={e => setProject(p => ({ ...p, description: e.target.value }))} rows={4} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={project.status} onValueChange={(value) => setProject(p => ({...p, status: value as any}))}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Not Assigned">Not Assigned</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />
                    
                    {/* Student Management */}
                    <div className="space-y-4">
                         <h3 className="text-lg font-medium flex items-center gap-2"><UserPlus /> Student Assignments</h3>
                         <div className="space-y-2">
                             <Label htmlFor="assigned-students">Assigned Students</Label>
                             <MultiSelect
                                options={unassignedStudents.map(s => ({ value: s.id, label: s.fullName }))}
                                selected={project.studentIds}
                                onChange={handleStudentChange}
                                placeholder="Select students to assign..."
                                className="w-full"
                             />
                         </div>
                    </div>

                    <Separator />

                    {/* Mentor Management */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2"><UserCheck /> Mentor Assignments</h3>
                        <div className="space-y-2">
                            <Label htmlFor="assigned-mentors">Assigned Mentors</Label>
                             <MultiSelect
                                options={allMentors.map(m => ({ value: m.id, label: m.name }))}
                                selected={project.mentorIds}
                                onChange={handleMentorChange}
                                placeholder="Select mentors to assign..."
                                className="w-full"
                             />
                        </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Course Management */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2"><BookPlus /> Course Assignments</h3>
                        <div className="space-y-2">
                            <Label htmlFor="assigned-courses">Assigned Courses</Label>
                             <MultiSelect
                                options={allCourses.map(c => ({ value: c.id, label: `${c.code} - ${c.title}` }))}
                                selected={project.courseIds}
                                onChange={handleCourseChange}
                                placeholder="Select courses to assign..."
                                className="w-full"
                             />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSaveChanges}>
                            <Save className="mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
