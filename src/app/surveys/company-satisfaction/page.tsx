
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function CompanySatisfactionSurveyPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Company Satisfaction Survey</CardTitle>
          <CardDescription>
            Thank you for your participation in the SMART Capstone program. Your feedback is crucial for our continuous improvement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="company-name">Company/Organization Name</Label>
                    <Input id="company-name" placeholder="Acme Corporation" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="contact-name">Your Name & Job Title</Label>
                    <Input id="contact-name" placeholder="Jane Doe, Project Manager" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="jane.doe@acme.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="participation-date">Participation Date in the SMART Project</Label>
                    <Input id="participation-date" type="date" />
                </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="project-expectations">What were your primary expectations from the SMART team?</Label>
                    <Textarea id="project-expectations" rows={3} placeholder="e.g., A functional prototype, a market research report..." />
                </div>
                <div className="space-y-2">
                    <Label>On a scale of 1-5, how well were your expectations fulfilled?</Label>
                    <Slider defaultValue={[3]} max={5} step={1} />
                     <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not at all</span>
                        <span>Completely Fulfilled</span>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="weekly-hours">On average, how many hours per week did you spend with the team on this project?</Label>
                    <Input id="weekly-hours" type="number" placeholder="5" />
                </div>
                 <div className="space-y-3">
                    <Label>Was the workload acceptable?</Label>
                    <RadioGroup defaultValue="yes" className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="workload-yes" /><Label htmlFor="workload-yes" className="font-normal">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="workload-no" /><Label htmlFor="workload-no" className="font-normal">No</Label></div>
                    </RadioGroup>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="workload-explanation">If no, please explain:</Label>
                    <Textarea id="workload-explanation" rows={2} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="requirements-satisfaction">Were you satisfied with the SMART team's ability to adhere to the project requirements?</Label>
                    <Textarea id="requirements-satisfaction" rows={3} />
                </div>
                <div className="space-y-3">
                    <Label>Did the team have sufficient time to complete the project?</Label>
                    <RadioGroup defaultValue="yes" className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="time-yes" /><Label htmlFor="time-yes" className="font-normal">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="time-no" /><Label htmlFor="time-no" className="font-normal">No</Label></div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label>On a scale of 1-5, how would you rate the structure of the project?</Label>
                    <Slider defaultValue={[4]} max={5} step={1} />
                     <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Poorly Structured</span>
                        <span>Well Structured</span>
                    </div>
                </div>
            </div>

            <Separator />

             <div className="space-y-4">
                 <div className="space-y-3">
                    <Label>What were the highlights of the project? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="flex items-center space-x-2"><Checkbox id="hl-quality" /><Label htmlFor="hl-quality" className="font-normal">Quality of work</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="hl-communication" /><Label htmlFor="hl-communication" className="font-normal">Communication</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="hl-professionalism" /><Label htmlFor="hl-professionalism" className="font-normal">Professionalism</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="hl-timeliness" /><Label htmlFor="hl-timeliness" className="font-normal">Timeliness</Label></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="other-highlights">Other highlights:</Label>
                    <Input id="other-highlights" />
                </div>
                <div className="space-y-3">
                    <Label>What were the challenges of the project? (Select all that apply)</Label>
                     <div className="grid grid-cols-2 gap-2">
                       <div className="flex items-center space-x-2"><Checkbox id="ch-quality" /><Label htmlFor="ch-quality" className="font-normal">Quality of work</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="ch-communication" /><Label htmlFor="ch-communication" className="font-normal">Communication</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="ch-professionalism" /><Label htmlFor="ch-professionalism" className="font-normal">Professionalism</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="ch-timeliness" /><Label htmlFor="ch-timeliness" className="font-normal">Timeliness</Label></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="other-challenges">Other challenges:</Label>
                    <Input id="other-challenges" />
                </div>
             </div>
             
             <Separator />

             <div className="space-y-4">
                <div className="space-y-3">
                    <Label>Would you be willing to pay a nominal fee for future projects?</Label>
                    <RadioGroup defaultValue="yes" className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="fee-yes" /><Label htmlFor="fee-yes" className="font-normal">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="fee-no" /><Label htmlFor="fee-no" className="font-normal">No</Label></div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label>On a scale of 1-5, how likely are you to collaborate with Westcliff again?</Label>
                    <Slider defaultValue={[5]} max={5} step={1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not Likely</span>
                        <span>Very Likely</span>
                    </div>
                </div>
                 <div className="space-y-3">
                    <Label>Are you interested in joining the SMART DBA Advisory Board?</Label>
                    <RadioGroup defaultValue="no" className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="board-yes" /><Label htmlFor="board-yes" className="font-normal">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="board-no" /><Label htmlFor="board-no" className="font-normal">No</Label></div>
                    </RadioGroup>
                </div>
                 <div className="space-y-3">
                    <Label>Would you be willing to provide a testimonial?</Label>
                    <RadioGroup defaultValue="yes" className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="testimonial-yes" /><Label htmlFor="testimonial-yes" className="font-normal">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="testimonial-no" /><Label htmlFor="testimonial-no" className="font-normal">No</Label></div>
                    </RadioGroup>
                </div>
             </div>

            <div className="flex justify-end">
                <Button type="submit">
                <Send className="mr-2" />
                Submit Survey
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
