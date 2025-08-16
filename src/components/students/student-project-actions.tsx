

"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileVideo, FileText, Send, CheckCircle, Circle, ArrowRight, Video, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { projects, students } from "@/lib/data";
import type { Milestone } from "@/lib/types";

const initialMilestones: Milestone[] = [
  { id: "nda", text: "Submit Signed NDAs", status: "pending" as Milestone['status'], dueDate: '2024-01-20' },
  { id: "action-plan", text: "Submit Project Action Plan", status: "pending" as Milestone['status'], dueDate: '2024-02-01' },
  { id: "mid-review", text: "Complete Mid-Point Review", status: "pending" as Milestone['status'], dueDate: '2024-03-15' },
  { id: "video", text: "Upload 'Lesson Learned' Video", status: "pending" as Milestone['status'], dueDate: '2024-05-01' },
  { id: "survey", text: "Complete Post-Capstone Survey", status: "pending" as Milestone['status'], dueDate: '2024-05-10' },
];

const milestoneTypes: Record<string, string> = {
  nda: "submission",
  'action-plan': "submission",
  'mid-review': "review",
  video: "submission",
  survey: "link",
  'company-feedback-review': 'submission',
  'final-video': 'submission',
  'final-report': 'submission',
  'case-study': 'submission',
}

interface VideoFileState {
  file: File;
  url: string;
}


export function StudentProjectActions() {
    const [ndaFiles, setNdaFiles] = useState<File[]>([]);
    const { toast } = useToast();
    const student = students[0];
    const [milestones, setMilestones] = useState(student.studentProfile.milestones);
    const project = projects.find(p => p.id === student.studentProfile.projectId);
    
    const [lessonLearnedVideo, setLessonLearnedVideo] = useState<VideoFileState | null>(null);
    const [finalVideo, setFinalVideo] = useState<VideoFileState | null>(null);
    const [companyFeedbackVideo, setCompanyFeedbackVideo] = useState<VideoFileState | null>(null);


    const handleNdaFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            if (files.length > 4) {
                toast({
                    variant: "destructive",
                    title: "File Limit Exceeded",
                    description: "You can upload a maximum of 4 NDA files.",
                });
                return;
            }
            setNdaFiles(files);
        }
    };
    
    const handleVideoFileChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      setter: React.Dispatch<React.SetStateAction<VideoFileState | null>>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setter({ file, url });
        }
    };


    const handleMarkAsComplete = (id: string) => {
        if (id === 'nda' && ndaFiles.length === 0) {
             toast({
                variant: "destructive",
                title: "No Files Uploaded",
                description: "Please upload your NDA file(s) before marking as complete.",
            });
            return;
        }

        setMilestones(prev => prev.map(m => m.id === id ? {...m, status: 'completed'} : m));
        toast({
            title: "Milestone Updated",
            description: `You've marked "${milestones.find(m=>m.id === id)?.text}" as complete.`
        });
    }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>My Action Plan & Submissions</CardTitle>
                    <CardDescription>
                        Complete these steps to successfully finish your capstone project for "{project?.name}".
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {milestones.map(milestone => {
                             const type = milestoneTypes[milestone.id] || 'review';
                             return (
                             <li key={milestone.id} className="flex items-start gap-4">
                                <div>
                                    {milestone.status === 'completed' ? (
                                        <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                                    ) : (
                                        <Circle className="h-6 w-6 text-muted-foreground mt-1" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-2 pb-4 border-b">
                                    <p className="font-medium">{milestone.text}</p>
                                    
                                    {/* Specific content for each milestone */}
                                    {milestone.id === 'nda' && milestone.status === 'pending' && (
                                        <div className="p-4 rounded-md bg-secondary border space-y-2">
                                            <Label htmlFor="nda-upload">NDA Upload (up to 4 files)</Label>
                                            <Input id="nda-upload" type="file" onChange={handleNdaFileChange} accept=".pdf,.doc,.docx,.png,.jpg" multiple />
                                            <p className="text-xs text-muted-foreground">Please upload your signed Non-Disclosure Agreement(s).</p>
                                        </div>
                                    )}
                                    {milestone.id === 'action-plan' && milestone.status === 'pending' && (
                                         <div className="p-4 rounded-md bg-secondary border space-y-2">
                                            <Label htmlFor="action-plan-upload">Project Action Plan Document</Label>
                                            <Input id="action-plan-upload" type="file" accept=".pdf,.doc,.docx" />
                                        </div>
                                    )}
                                    {milestone.id === 'video' && milestone.status === 'pending' && (
                                        <div className="p-4 rounded-md bg-secondary border space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="video-upload" className="flex items-center gap-2"><FileVideo /> "Lesson Learned" Video</Label>
                                                <Input id="video-upload" type="file" accept="video/*" onChange={e => handleVideoFileChange(e, setLessonLearnedVideo)} />
                                            </div>
                                            {lessonLearnedVideo && (
                                                <div>
                                                    <video src={lessonLearnedVideo.url} controls className="w-full rounded-md max-h-60" />
                                                    <a href={lessonLearnedVideo.url} download={lessonLearnedVideo.file.name}>
                                                         <Button variant="outline" className="mt-2 w-full">
                                                            <Download className="mr-2"/> Download Uploaded Video
                                                        </Button>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {milestone.id === 'final-report' && milestone.status === 'pending' && (
                                         <div className="p-4 rounded-md bg-secondary border space-y-2">
                                            <Label htmlFor="final-report-upload">Final Report Document</Label>
                                            <Input id="final-report-upload" type="file" accept=".pdf,.doc,.docx" />
                                        </div>
                                    )}
                                     {milestone.id === 'case-study' && milestone.status === 'pending' && (
                                         <div className="p-4 rounded-md bg-secondary border space-y-2">
                                            <Label htmlFor="case-study-upload">Case Study Document</Label>
                                            <Input id="case-study-upload" type="file" accept=".pdf,.doc,.docx" />
                                        </div>
                                    )}
                                    {milestone.id === 'final-video' && milestone.status === 'pending' && (
                                        <div className="p-4 rounded-md bg-secondary border space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="final-video-upload" className="flex items-center gap-2"><Video /> Final Combined Video</Label>
                                                <Input id="final-video-upload" type="file" accept="video/*"  onChange={e => handleVideoFileChange(e, setFinalVideo)} />
                                                <p className="text-xs text-muted-foreground">Upload the final video combining student and company perspectives.</p>
                                            </div>
                                             {finalVideo && (
                                                <div>
                                                    <video src={finalVideo.url} controls className="w-full rounded-md max-h-60" />
                                                    <a href={finalVideo.url} download={finalVideo.file.name}>
                                                         <Button variant="outline" className="mt-2 w-full">
                                                            <Download className="mr-2"/> Download Uploaded Video
                                                        </Button>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {milestone.id === 'company-feedback-review' && milestone.status === 'pending' && (
                                        <div className="p-4 rounded-md bg-secondary border space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="company-feedback-video-upload" className="flex items-center gap-2"><Video /> Company Feedback Video</Label>
                                                <Input id="company-feedback-video-upload" type="file" accept="video/*" onChange={e => handleVideoFileChange(e, setCompanyFeedbackVideo)} />
                                                <p className="text-xs text-muted-foreground">Upload a video summarizing or responding to the company's feedback.</p>
                                            </div>
                                            {companyFeedbackVideo && (
                                                <div>
                                                    <video src={companyFeedbackVideo.url} controls className="w-full rounded-md max-h-60" />
                                                    <a href={companyFeedbackVideo.url} download={companyFeedbackVideo.file.name}>
                                                        <Button variant="outline" className="mt-2 w-full">
                                                            <Download className="mr-2"/> Download Uploaded Video
                                                        </Button>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {milestone.id === 'survey' && (
                                        <Button asChild variant="link" className="p-0 h-auto">
                                            <Link href="/surveys/student-capstone-feedback">
                                                Go to Survey page <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    )}

                                    {type !== 'link' && milestone.status === 'pending' && (
                                        <div className="flex justify-end">
                                            <Button size="sm" onClick={() => handleMarkAsComplete(milestone.id)}>
                                                <CheckCircle className="mr-2" /> Mark as Complete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        )})}
                    </ul>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>High-level information about your assigned project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Project Name</Label>
                        <p className="font-semibold">{project?.name}</p>
                    </div>
                     <div>
                        <Label>Company</Label>
                        <p className="font-semibold">{project?.company}</p>
                    </div>
                     <div>
                        <Label>Description</Label>
                        <p className="text-sm text-muted-foreground">{project?.description}</p>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                       <Link href="/projects/view-details">
                            <FileText className="mr-2" /> View Full Project Brief
                        </Link>
                    </Button>
                 </CardFooter>
            </Card>
        </div>
    </div>
  );
}

    