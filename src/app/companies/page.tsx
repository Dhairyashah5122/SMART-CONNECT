import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { companies } from "@/lib/data"
import { Upload, FileText, BarChart, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CompaniesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
         <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Company Management
          </h2>
          <p className="text-muted-foreground max-w-3xl">
            Manage company projects, review reports, and analyze satisfaction survey data.
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full" defaultValue={companies[0].id}>
        {companies.map((company) => (
          <AccordionItem value={company.id} key={company.id}>
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              {company.name}
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
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="mr-2" /> Upload
                        </Button>
                      </div>
                       <div className="space-y-2">
                        <Label>Project Charter</Label>
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="mr-2" /> Upload
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Company Survey</Label>
                        <Link href="/surveys" legacyBehavior>
                          <a>
                            <Button variant="secondary" className="w-full justify-start">
                              <FileText className="mr-2" /> View Survey
                              <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground"/>
                            </Button>
                          </a>
                        </Link>
                      </div>
                       <div className="space-y-2">
                        <Label>Gap Analysis</Label>
                         <Link href="/analysis" legacyBehavior>
                            <a>
                                <Button variant="secondary" className="w-full justify-start">
                                    <BarChart className="mr-2" /> View Analysis
                                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground"/>
                                </Button>
                            </a>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
    return <p className="text-sm font-medium text-muted-foreground">{children}</p>
}
