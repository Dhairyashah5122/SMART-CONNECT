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


export function OverallProjectReportForm() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
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
