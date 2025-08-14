"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Save, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// In a real app, this would be a more sophisticated report type definition.
// For this example, we'll keep it simple.
export interface NewReportDefinition {
    title: string;
    description: string;
    category: string;
}

export function DefineReportForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !category) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill out all fields to define the report.',
            });
            return;
        }

        const newReport: NewReportDefinition = { title, description, category };
        
        // In a real app, this would be sent to a backend to be persisted.
        // For this demo, we'll store it in localStorage to simulate persistence
        // across the session.
        try {
            const existingReports = JSON.parse(localStorage.getItem('custom_reports') || '[]');
            localStorage.setItem('custom_reports', JSON.stringify([...existingReports, newReport]));

            toast({
                title: 'Report Defined!',
                description: `The "${title}" report has been added to the "${category}" category.`,
            });
            
            // Redirect back to the reports page to see the new report
            router.push('/reports');

        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Could not save report',
                description: 'There was an error saving the report definition.',
            });
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>New Report Details</CardTitle>
                <CardDescription>Configure the properties for your new custom report.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="report-title">Report Title</Label>
                        <Input id="report-title" placeholder="e.g., Quarterly Student Performance" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="report-description">Report Description</Label>
                        <Textarea id="report-description" placeholder="A brief description of what this report generates." value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="report-category">Report Category</Label>
                        <Input id="report-category" placeholder="e.g., Performance Analytics" value={category} onChange={e => setCategory(e.target.value)} />
                        <p className="text-xs text-muted-foreground">If the category exists, the report will be added to it. Otherwise, a new category will be created.</p>
                    </div>
                    <div className="flex justify-end">
                         <Button type="submit">
                            <Save className="mr-2"/> Save Definition
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
