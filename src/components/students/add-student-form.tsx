"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, Sparkles } from "lucide-react";
import {
  extractSkillsFromResume,
  type ExtractSkillsFromResumeOutput,
} from "@/ai/flows/extract-skills-from-resume";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export function AddStudentForm() {
  const [resume, setResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [extractedSkills, setExtractedSkills] =
    useState<ExtractSkillsFromResumeOutput | null>(null);
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
      alert("Please upload a resume first.");
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
    // Form data would be collected here from state or a form library like react-hook-form
    console.log({
      // Collect all form fields here
      skills: extractedSkills?.skills || [],
    });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    alert("Student added successfully!");
    // Reset form would happen here
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input id="full-name" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="student-id">Student ID #</Label>
            <Input id="student-id" placeholder="123456" required />
        </div>
         <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="primary-institution">Primary Institution</Label>
          <Input id="primary-institution" placeholder="Westcliff University" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="program">Program Enrolled In</Label>
          <Input id="program" placeholder="BSc in Computer Science" />
        </div>
         <div className="space-y-2">
            <Label htmlFor="gpa">Current GPA</Label>
            <Input id="gpa" type="number" step="0.1" placeholder="3.8" />
        </div>
      </div>

      <div className="space-y-4">
         <div className="space-y-2">
            <Label htmlFor="email-address">Email Address</Label>
            <Input id="email-address" type="email" placeholder="student@westcliff.edu" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="secondary-email">Secondary Email Address</Label>
            <Input id="secondary-email" type="email" placeholder="personal@email.com" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input id="phone-number" type="tel" placeholder="+1 (123) 456-7890" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-advisor">Who is your Student Advisor?</Label>
          <Input id="student-advisor" placeholder="Dr. Smith" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="languages">Languages other than English</Label>
          <Input id="languages" placeholder="Spanish, Mandarin" />
        </div>
         <div className="space-y-2">
          <Label htmlFor="desired-session">Desired Session for SMART Capstone Project</Label>
          <Input id="desired-session" placeholder="Fall 2024" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resume">Resume Upload</Label>
          <div className="flex items-center gap-4">
            <Input id="resume" type="file" onChange={handleFileChange} accept=".txt,.pdf,.doc,.docx" className="flex-grow"/>
            <Button type="button" variant="outline" onClick={handleExtractSkills} disabled={!resume || isExtracting} size="icon">
                {isExtracting ? <Loader2 className="animate-spin" /> : <Sparkles />}
                <span className="sr-only">Extract Skills</span>
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
        
        <div className="space-y-2">
          <Label htmlFor="project-interests">Project Interests</Label>
          <Textarea id="project-interests" placeholder="AI/ML, Web Development, UI/UX Design..." />
        </div>

         <div className="space-y-2">
          <Label htmlFor="workshop">Mandatory Workshop Selection</Label>
          <Select>
            <SelectTrigger id="workshop">
              <SelectValue placeholder="Select a workshop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workshop-a">Workshop A - Topic 1</SelectItem>
              <SelectItem value="workshop-b">Workshop B - Topic 2</SelectItem>
              <SelectItem value="workshop-c">Workshop C - Topic 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-4">
            <Checkbox id="acknowledgement" required />
            <Label htmlFor="acknowledgement" className="text-sm font-normal">
            I acknowledge the mandatory requirements.
            </Label>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="animate-spin" /> : <UserPlus />}
            <span className="ml-2">Add Student</span>
        </Button>
      </div>
    </form>
  );
}
