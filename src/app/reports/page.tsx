
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Send, Star, FilePenLine, BarChart4, Users, ChevronDown } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const reportTypes = [
   {
    title: 'Overall Project Analysis',
    description: 'Generates a summary and analysis of all projects within a selected date range.',
    href: '/reports/overall-analysis',
    icon: BarChart4,
    actionText: 'Generate',
    category: 'Project Analysis'
  },
  {
    title: 'Student Skills Matrix',
    description: 'A comprehensive report detailing the skills distribution across all registered students.',
    href: '/reports/student-skills-matrix',
    icon: Users,
    actionText: 'Generate',
    category: 'Student Reports'
  },
  {
    title: 'Project Matching Success Rate',
    description: 'Analyzes the effectiveness of student-project matches over a selected period.',
    category: 'Project Analysis'
  },
  {
    title: 'Survey Response Summary',
    description: 'Aggregates data from a specific survey to highlight key trends and insights.',
    category: 'Survey Reports'
  },
  {
    title: 'Alignment Gap Analysis Report',
    description: 'Generates a formal document based on the results of the comparative analysis.',
    category: 'Project Analysis'
  },
  {
    title: 'Success Story Report',
    description: 'Generates a success story from project reports uploaded by mentors.',
    href: '/showcase',
    icon: Star,
    actionText: 'Generate',
    category: 'Showcase'
  },
  {
    title: 'Case Study Generation',
    description: 'Creates a detailed case study from a project report.',
    href: '/showcase',
    icon: FilePenLine,
    actionText: 'Generate',
    category: 'Showcase'
  },
];

const reportCategories = ["All", ...Array.from(new Set(reportTypes.map(r => r.category)))];

export default function ReportsPage() {
  const [filter, setFilter] = useState('All');

  const filteredReports = filter === 'All' 
    ? reportTypes 
    : reportTypes.filter(report => report.category === filter);

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Generate Reports
            </h2>
            <p className="text-muted-foreground max-w-3xl">
              Create detailed reports to support decision-making, track progress, and share insights.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline">
                Filter by Type <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {reportCategories.map(category => (
                <DropdownMenuItem key={category} onSelect={() => setFilter(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.map((report) => {
          const Icon = report.icon || FileText;
          return (
          <Card key={report.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className="flex-shrink-0">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-grow">
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="mt-auto flex gap-2">
              {report.href ? (
                 <Button asChild className="w-full">
                    <Link href={report.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        {report.actionText || 'View'}
                    </Link>
                </Button>
              ) : (
                <Button className="w-full" disabled>
                    <Icon className="mr-2 h-4 w-4" />
                    Generate
                </Button>
              )}
                <Button variant="outline" className="w-full" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
                <Button variant="outline" className="w-full" disabled>
                    <Send className="mr-2 h-4 w-4" />
                    Email
                </Button>
            </CardContent>
          </Card>
        )})}
      </div>
    </div>
  );
}
