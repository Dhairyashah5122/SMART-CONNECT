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
import { Input } from "@/components/ui/input"

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
                          <Link href="/surveys" passHref>
                            <Button variant="secondary" className="w-full justify-start">
                              <FileText className="mr-2" /> View Survey
                              <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground"/>
                            </Button>
                          </Link>
                        </div>
                        <div className="space-y-2">
                          <Label>Gap Analysis</Label>
                          <Link href="/analysis" passHref>
                            <Button variant="secondary" className="w-full justify-start">
                                <BarChart className="mr-2" /> View Analysis
                                <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground"/>
                            </Button>
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
      </CardContent>
    </Card>
  )
}

function Label({ children }: { children: React.ReactNode }) {
    return <p className="text-sm font-medium text-muted-foreground">{children}</p>
}
