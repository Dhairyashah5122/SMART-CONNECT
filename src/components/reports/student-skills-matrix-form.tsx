
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { generateSkillsMatrixReport } from "@/ai/flows/generate-skills-matrix-report"
import { students as allStudents } from "@/lib/data"

const MOCK_INITIAL_REPORT = `
**Executive Summary:**
The student cohort registered between January and March 2024 demonstrates a strong aptitude for modern software development and data-driven technologies. The skill set is heavily weighted towards web development (React, Node.js) and data analysis (Python, SQL), making this group well-suited for a wide range of capstone projects in these domains.

**Top 10 Most Common Skills:**
1.  **Python:** 4 students
2.  **JavaScript:** 3 students
3.  **React:** 2 students
4.  **Node.js:** 2 students
5.  **Data Analysis:** 2 students
6.  **Machine Learning:** 2 students
7.  **Project Management:** 1 student
8.  **UX/UI Design:** 1 student
9.  **Java:** 1 student
10. **AWS:** 1 student

**Skill Frequency Breakdown:**
There is a high prevalence of skills related to web technologies and data science, indicating a strong interest in these high-demand fields. Foundational programming languages like Python and JavaScript are the most common. Specialized skills in areas like cybersecurity and cloud computing are present but less frequent.

**Unique & Notable Skills:**
- **Penetration Testing:** Held by one student, indicating specialized cybersecurity expertise.
- **TensorFlow:** A specific and valuable machine learning framework.
- **User Research:** A key skill in product design and user experience.
`;


export function StudentSkillsMatrixForm() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(MOCK_INITIAL_REPORT);
  const { toast } = useToast();

  const handleGenerate = async () => {
      if (!startDate || !endDate) {
           toast({
              variant: 'destructive',
              title: 'Date Range Required',
              description: 'Please select both a start and end date.',
          });
          return;
      }
      setIsLoading(true);
      setResult(null);

      try {
        const analysisResult = await generateSkillsMatrixReport({
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            students: allStudents
        })
        setResult(analysisResult.report);
      } catch (error) {
           console.error('Error in report generation:', error);
          toast({
              variant: 'destructive',
              title: 'Generation Failed',
              description: 'An error occurred during report generation. Please try again.',
          });
      } finally {
          setIsLoading(false);
      }
  }

  return (
     <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Period</CardTitle>
          <CardDescription>Select the registration date range for the skills analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="grid gap-2 flex-1">
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
                </div>
                <div className="grid gap-2 flex-1">
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
            </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={!startDate || !endDate || isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Generate Report
          </Button>
        </CardFooter>
      </Card>
      
      <Card className='flex flex-col'>
          <CardHeader>
            <CardTitle>Generated Report</CardTitle>
            <CardDescription>The AI-generated skills analysis will appear below.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {isLoading && (
            <div className="flex items-center justify-center rounded-lg border h-full bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            )}
            {!isLoading && !result && (
            <div className="flex items-center justify-center rounded-lg border h-full bg-card text-center text-muted-foreground p-8">
                <p>Generated report will appear here.</p>
            </div>
            )}
            {result && (
                <ScrollArea className='h-[400px]'>
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg bg-secondary/30 whitespace-pre-wrap">
                        {result}
                    </div>
                </ScrollArea>
            )}
          </CardContent>
      </Card>
    </div>
  )
}
