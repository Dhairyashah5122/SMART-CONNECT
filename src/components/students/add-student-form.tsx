"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, Sparkles } from "lucide-react";
import { extractSkillsFromResume, type ExtractSkillsFromResumeOutput } from "@/ai/flows/extract-skills-from-resume";
import { Badge } from "../ui/badge";

export function AddStudentForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email1, setEmail1] = useState('');
    const [email2, setEmail2] = useState('');
    const [resume, setResume] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState('');
    const [extractedSkills, setExtractedSkills] = useState<ExtractSkillsFromResumeOutput | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setResume(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setResumeText(text);
            };
            reader.readAsText(file);
        }
    };

    const handleExtractSkills = async () => {
        if (!resumeText) {
            alert('Please upload a resume first.');
            return;
        }
        setIsExtracting(true);
        setExtractedSkills(null);
        try {
            const result = await extractSkillsFromResume({ resume: resumeText });
            setExtractedSkills(result);
        } catch (error) {
            console.error("Error extracting skills:", error);
            alert("Failed to extract skills from resume.");
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        // Here you would typically send the data to your backend
        console.log({
            firstName,
            lastName,
            email1,
            email2,
            resume,
            skills: extractedSkills?.skills || [],
        });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        alert('Student added successfully!');
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail1('');
        setEmail2('');
        setResume(null);
        setResumeText('');
        setExtractedSkills(null);
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email1">Primary Email</Label>
                    <Input id="email1" type="email" placeholder="john.doe@example.com" value={email1} onChange={e => setEmail1(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email2">Secondary Email (Optional)</Label>
                    <Input id="email2" type="email" placeholder="personal.email@example.com" value={email2} onChange={e => setEmail2(e.target.value)} />
                </div>
            </div>
            <div className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="resume">Resume</Label>
                    <div className="flex items-center gap-4">
                        <Input id="resume" type="file" onChange={handleFileChange} accept=".txt,.pdf,.doc,.docx" className="flex-grow"/>
                        <Button type="button" variant="outline" onClick={handleExtractSkills} disabled={!resume || isExtracting}>
                            {isExtracting ? <Loader2 className="animate-spin" /> : <Sparkles />}
                            <span className="ml-2 hidden sm:inline">Extract Skills</span>
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Upload resume to automatically extract skills.</p>
                </div>
                {extractedSkills && (
                    <div className="space-y-2">
                        <Label>Extracted Skills</Label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-secondary/50">
                            {extractedSkills.skills.length > 0 ? (
                                extractedSkills.skills.map(skill => <Badge key={skill}>{skill}</Badge>)
                            ) : (
                                <p className="text-sm text-muted-foreground">No skills extracted.</p>
                            )}
                        </div>
                    </div>
                )}
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <UserPlus />}
                        <span className="ml-2">Add Student</span>
                </Button>
            </div>
        </form>
    )
}
