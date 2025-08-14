import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { companies } from "@/lib/data"
import { Upload, FileText, BarChart, ExternalLink, PlusCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "../ui/badge"

export function CompanyList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Companies</CardTitle>
        <CardDescription>
          Manage company projects, review reports, and analyze satisfaction survey data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue={companies.length > 0 ? companies[0].id : undefined}>
          {companies.map((company) => (
            <AccordionItem value={company.id} key={company.id}>
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                <div className="flex items-center gap-4">
                  <span>{company.name}</span>
                   <Badge 
                      variant={company.surveyCompleted ? 'default' : 'secondary'}
                      className={company.surveyCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {company.surveyCompleted ? <CheckCircle className="mr-2" /> : <Clock className="mr-2" />}
                      Survey {company.surveyCompleted ? 'Completed' : 'Pending'}
                    </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <div className="flex flex-col gap-4">
                  {company.projects.map(project => (
                    <Card key={project.id}>
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Final Report</Label>
                          <div className="flex gap-2">
                            <Input type="file" className="w-full" />
                            <Button variant="outline" size="icon"><Upload /></Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Project Charter</Label>
                          <div className="flex gap-2">
                            <Input type="file" className="w-full" />
                            <Button variant="outline" size="icon"><Upload /></Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Company Survey</Label>
                           <Button asChild variant="secondary" className="w-full justify-start">
                             <Link href="/surveys/company-satisfaction" >
                              <FileText className="mr-2" /> View Survey
                              <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground"/>
                            </Link>
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Gap Analysis</Label>
                           <Button asChild variant="secondary" className="w-full justify-start">
                            <Link href="/analysis" >
                                <BarChart className="mr-2" /> View Analysis
                                <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground"/>
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="mt-4">
                    <Button variant="outline">
                      <PlusCircle className="mr-2" /> Add New Project
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

function Label({ children }: { children: React.ReactNode }) {
    return <p className="text-sm font-medium text-muted-foreground">{children}</p>
}
