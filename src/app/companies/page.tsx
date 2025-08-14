import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, List, FilePenLine } from "lucide-react";
import { CompanyApplicationForm } from '@/components/companies/company-application-form';
import { CompanyList } from '@/components/companies/company-list';

export default function CompaniesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Company Hub
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Onboard new companies or manage existing partnerships and projects.
        </p>
      </div>

      <Tabs defaultValue="application">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="application"><FilePenLine className="mr-2"/>New Company Application</TabsTrigger>
          <TabsTrigger value="manage"><List className="mr-2"/>Manage Companies</TabsTrigger>
        </TabsList>
        <TabsContent value="application">
          <Card>
            <CardHeader>
              <CardTitle>Company Application Form</CardTitle>
              <CardDescription>
                Submit this form to propose a new project for the SMART Capstone program.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyApplicationForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage">
          <CompanyList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
