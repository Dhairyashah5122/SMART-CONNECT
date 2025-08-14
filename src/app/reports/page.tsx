

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Send, Star, FilePenLine, BarChart4, Users, ChevronDown, Calendar as CalendarIcon, UserCheck, Activity } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const reportTypes = [
   {
    title: 'Overall Project Analysis',
    description: 'Generates a summary and analysis of all projects within a selected date range.',
    href: '/reports/overall-analysis',
    icon: BarChart4,
    actionText: 'Generate',
    category: 'Project Analysis',
    isDateBased: true,
  },
  {
    title: 'Student Skills Matrix',
    description: 'A comprehensive report detailing the skills distribution across all registered students.',
    href: '/reports/student-skills-matrix',
    icon: Users,
    actionText: 'Generate',
    category: 'Student Reports',
    isDateBased: true,
  },
    {
    title: 'Mentor Activity Report',
    description: 'Analyzes mentor engagement, such as mentee interactions and report submissions, over a selected period.',
    icon: UserCheck,
    actionText: 'Generate',
    category: 'Project Analysis',
    isDateBased: true,
  },
  {
    title: 'Student Engagement Report',
    description: 'Tracks student participation, milestone completion, and platform activity over a selected period.',
    icon: Activity,
    actionText: 'Generate',
    category: 'Student Analytics',
    isDateBased: true,
  },
  {
    title: 'Project Matching Success Rate',
    description: 'Analyzes the effectiveness of student-project matches over a selected period.',
    category: 'Project Analysis',
    isDateBased: true,
  },
  {
    title: 'Survey Response Summary',
    description: 'Aggregates data from a specific survey to highlight key trends and insights.',
    category: 'Survey Reports',
    isDateBased: false,
  },
  {
    title: 'Alignment Gap Analysis Report',
    description: 'Generates a formal document based on the results of the comparative analysis.',
    category: 'Project Analysis',
    isDateBased: false,
  },
  {
    title: 'Success Story Report',
    description: 'Generates a success story from project reports uploaded by mentors.',
    href: '/showcase',
    icon: Star,
    actionText: 'Generate',
    category: 'Showcase',
    isDateBased: false,
  },
  {
    title: 'Case Study Generation',
    description: 'Creates a detailed case study from a project report.',
    href: '/showcase',
    icon: FilePenLine,
    actionText: 'Generate',
    category: 'Showcase',
    isDateBased: false,
  },
];

const reportCategories = ["All", ...Array.from(new Set(reportTypes.map(r => r.category)))];

export default function ReportsPage() {
  const [filter, setFilter] = useState('All');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filteredReports = filter === 'All' 
    ? reportTypes 
    : reportTypes.filter(report => report.category === filter);

  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
         <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Generate Reports
            </h2>
            <p className="text-muted-foreground max-w-3xl">
              Create detailed reports to support decision-making, track progress, and share insights.
            </p>
          </div>
          <div className="flex items-center gap-2">
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
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>Date Range Filter</CardTitle>
          <CardDescription>
            Select a date range below to enable generation for date-sensitive reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={{ before: startDate }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReports.map((report) => {
          const Icon = report.icon || FileText;
          const isDateRangeRequired = report.isDateBased;
          const canGenerate = !isDateRangeRequired || (isDateRangeRequired && startDate && endDate);

          const generateHref = () => {
            if (!report.href) return '';
            if (isDateRangeRequired && startDate && endDate) {
                return `${report.href}?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`;
            }
            return report.href;
          }

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
                 <Button asChild className="w-full" disabled={!canGenerate}>
                    <Link href={generateHref()}>
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
