
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
import { generateProjectAnalysisReport } from "@/ai/flows/generate-project-analysis-report"
import { projects as allProjects } from "@/lib/data"
import { Textarea } from "../ui/textarea"

const MOCK_INITIAL_REPORT = `
**Executive Summary:**
Projects initiated between Q1 and Q2 2024 focused heavily on AI/ML and mobile development. Overall, projects were successfully completed, with teams demonstrating strong technical execution. A recurring challenge was initial scope alignment with company stakeholders, which improved by mid-project.

**Key Outcomes & Successes:**
- **High Technical Proficiency:** Student teams consistently delivered high-quality code and functional prototypes, particularly in projects involving React and Python.
- **Successful Pivots:** The "AI-Powered Data Visualization Platform" project successfully pivoted to include a more advanced ML model, exceeding initial expectations.
- **Strong UX/UI Design:** The "Mobile-First E-commerce App" received positive feedback for its intuitive and user-centric design.

**Recurring Themes & Challenges:**
- **Initial Scope Ambiguity:** A common theme across multiple projects was a lack of clarity in the initial project requirements, leading to mid-project adjustments.
- **Stakeholder Communication Gaps:** Several final reports noted a desire for more frequent and structured feedback from company stakeholders during the development cycle.
- **Resource Constraints:** The "Data Pipeline Automation" team noted challenges related to accessing necessary cloud resources in a timely manner.

**Recommendations:**
1.  Implement a more rigorous project kick-off process with detailed requirement-gathering sessions to reduce scope ambiguity.
2.  Establish a mandatory bi-weekly check-in schedule between student teams and company stakeholders to improve communication.
3.  Streamline the process for requesting and provisioning project-specific resources (e.g., cloud services, software licenses).
`;


export function OverallProjectReportForm() {
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
        const analysisResult = await generateProjectAnalysisReport({
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            projects: allProjects
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
          <CardDescription>Select the date range for the project analysis report.</CardDescription>
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
            <CardDescription>The AI-generated analysis based on the selected date range will appear below.</CardDescription>
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
                <Textarea
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full h-full flex-1 p-4 border rounded-lg bg-secondary/30 min-h-[400px]"
                    placeholder="Generated report..."
                />
            )}
          </CardContent>
      </Card>
    </div>
  )
}
