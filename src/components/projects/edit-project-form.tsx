
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projects, students } from "@/lib/data";
import { Save } from "lucide-react";

export function EditProjectForm() {
    // In a real app, you'd fetch the project data based on an ID.
    // For now, we'll use the first project from our mock data.
    const project = projects[0];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Project Details</CardTitle>
                <CardDescription>Update the information for "{project.name}".</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="project-name">Project Name</Label>
                            <Input id="project-name" defaultValue={project.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company-name">Company</Label>
                            <Input id="company-name" defaultValue={project.company} disabled />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" defaultValue={project.description} rows={5} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select defaultValue={project.status}>
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
                        <div className="space-y-2">
                            <Label htmlFor="assigned-students">Assigned Students</Label>
                            <Select>
                                <SelectTrigger id="assigned-students">
                                    {/* This would be a multi-select in a real implementation */}
                                    <SelectValue placeholder={`${project.studentIds.length} students assigned`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map(student => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button>
                            <Save className="mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
