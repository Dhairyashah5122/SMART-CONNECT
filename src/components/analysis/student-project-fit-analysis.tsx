
"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { projects, students } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import {
  analyzeStudentProjectFit,
  type AnalyzeStudentProjectFitOutput,
} from "@/ai/flows/analyze-student-project-fit"
import { Loader2, Sparkles, Check, AlertTriangle, ArrowRight } from "lucide-react"
import { MultiSelect } from "../ui/multi-select"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Separator } from "../ui/separator"

export function StudentProjectFitAnalysis() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeStudentProjectFitOutput | null>(null)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!selectedProjectId || selectedStudentIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a project and at least one student.",
      })
      return
    }
    setIsLoading(true)
    setAnalysisResult(null)

    try {
      const project = projects.find((p) => p.id === selectedProjectId)!
      const selectedStudents = students
        .filter((s) => selectedStudentIds.includes(s.id))
        .map((s) => ({
          id: s.id,
          name: s.fullName,
          resume: s.studentProfile.resumeText,
        }))

      const result = await analyzeStudentProjectFit({
        projectDescription: project.description,
        students: selectedStudents,
      })
      setAnalysisResult(result)
    } catch (error) {
      console.error("Error analyzing student-project fit:", error)
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred during the analysis.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId)
  const studentOptions = students
    .filter(
      (s) =>
        s.studentProfile.status === "Approved" && !s.studentProfile.projectId
    )
    .map((s) => ({ value: s.id, label: s.fullName }))

  return (
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle>Student-Project Compatibility Analysis</CardTitle>
        <CardDescription>
          Select a project and one or more students to get a detailed
          AI-powered analysis of their fit.
        </CardDescription>
      </CardHeader>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-select">1. Select a Project</Label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger id="project-select">
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects
                    .filter((p) => p.status === "Not Assigned")
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedProject && (
              <div className="space-y-2">
                <Label>Project Description</Label>
                <p className="text-sm text-muted-foreground p-3 bg-secondary/30 border rounded-lg h-24 overflow-y-auto">
                  {selectedProject.description}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="student-select">2. Select Students</Label>
              <MultiSelect
                options={studentOptions}
                selected={selectedStudentIds}
                onChange={setSelectedStudentIds}
                placeholder="Select students to analyze..."
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Only approved, unassigned students are shown.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleAnalyze}
              disabled={
                isLoading || !selectedProjectId || selectedStudentIds.length === 0
              }
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Analyze Compatibility
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              The AI's evaluation of each student for the selected project will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading && (
              <div className="flex items-center justify-center rounded-lg border h-full bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && !analysisResult && (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed h-full bg-card text-center text-muted-foreground p-8">
                <p>Results will be displayed here after analysis.</p>
              </div>
            )}
            {analysisResult && (
              <div className="space-y-4">
                {analysisResult.analysis.map((result) => (
                  <Card key={result.studentId} className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <Avatar className="h-16 w-16 border">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${result.studentId}`} data-ai-hint="person" />
                            <AvatarFallback>{result.studentName.charAt(0)}</AvatarFallback>
                        </Avatar>
                         <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-lg">{result.studentName}</p>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary">{Math.round(result.compatibilityScore)}%</p>
                                    <p className="text-xs text-muted-foreground">Compatibility</p>
                                </div>
                            </div>
                            <Progress value={result.compatibilityScore} className="h-2" />
                            <p className="text-sm text-muted-foreground pt-1 italic">
                                "{result.justification}"
                            </p>
                        </div>
                    </div>
                     <Separator className="my-4" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2"><Check className="text-green-500"/> Key Strengths</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2"><AlertTriangle className="text-amber-500"/> Potential Gaps</h4>
                             <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {result.gaps.map((g, i) => <li key={i}>{g}</li>)}
                            </ul>
                        </div>
                     </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
