
"use client";

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
import { Send, Star } from "lucide-react";

export default function StudentCapstoneFeedbackPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Post-Capstone Student Feedback Survey</CardTitle>
          <CardDescription>
            Your feedback is invaluable for the continuous improvement of the SMART Capstone program. Please answer the following questions thoughtfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="company-name">Q01_1: Company Name Worked With</Label>
                    <Input id="company-name" placeholder="Innovate Inc." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="mentor-name">Q02_2: Mentor Name</Label>
                    <Input id="mentor-name" placeholder="Dr. Evelyn Reed" />
                </div>
            </div>

            <Separator />
            
            {/* Expectations */}
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="pre-capstone-expectations">Q03_3: What were your primary expectations from the capstone project before you started?</Label>
                    <Textarea id="pre-capstone-expectations" rows={3} placeholder="e.g., Gain real-world experience, build my portfolio..." />
                </div>
                <div className="space-y-2">
                    <Label>Q04_4: On a scale of 1-5, how well were your expectations fulfilled?</Label>
                    <Slider defaultValue={[4]} max={5} step={1} />
                     <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not at all</span>
                        <span>Completely Fulfilled</span>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Workload and Team */}
            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label>Q05_8: How would you rate the manageability of the project workload? (1-5)</Label>
                    <Slider defaultValue={[3]} max={5} step={1} />
                     <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Overwhelming</span>
                        <span>Very Manageable</span>
                    </div>
                </div>
                 <div className="space-y-3">
                    <Label>Q06_12: Was the size of your team adequate for the project scope?</Label>
                    <RadioGroup defaultValue="yes" className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="team-size-yes" /><Label htmlFor="team-size-yes" className="font-normal">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="team-size-no" /><Label htmlFor="team-size-no" className="font-normal">No</Label></div>
                         <div className="flex items-center space-x-2"><RadioGroupItem value="na" id="team-size-na" /><Label htmlFor="team-size-na" className="font-normal">N/A (Individual Project)</Label></div>
                    </RadioGroup>
                </div>
            </div>

            <Separator />

            {/* Skills Learned */}
             <div className="space-y-4">
                 <div className="space-y-3">
                    <Label>Q07_5: Which skills did you learn or improve during the capstone? (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       <div className="flex items-center space-x-2"><Checkbox id="skill-comm" /><Label htmlFor="skill-comm" className="font-normal">Written/Oral Communication</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="skill-pres" /><Label htmlFor="skill-pres" className="font-normal">Presentation</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="skill-mark" /><Label htmlFor="skill-mark" className="font-normal">Marketing/Research</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="skill-strat" /><Label htmlFor="skill-strat" className="font-normal">Strategy</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="skill-team" /><Label htmlFor="skill-team" className="font-normal">Teamwork</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="skill-time" /><Label htmlFor="skill-time" className="font-normal">Time Management</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="skill-crit" /><Label htmlFor="skill-crit" className="font-normal">Critical Thinking</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="skill-eth" /><Label htmlFor="skill-eth" className="font-normal">Ethics</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="skill-info" /><Label htmlFor="skill-info" className="font-normal">Information Literacy</Label></div>
                       <div className="flex items-center space-x-2"><Checkbox id="skill-quant" /><Label htmlFor="skill-quant" className="font-normal">Quantitative Reasoning</Label></div>
                    </div>
                 </div>
            </div>

            <Separator />
            
            {/* Client and Project Experience */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Q08_10: How would you rate your relationship with the client? (1-5)</Label>
                    <Slider defaultValue={[4]} max={5} step={1} />
                     <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Poor</span>
                        <span>Excellent</span>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="client-explain">Q09_11: Please explain your rating for the client relationship.</Label>
                    <Textarea id="client-explain" rows={2} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="capstone-highlights">Q10_14: What were the highlights of the capstone project?</Label>
                    <Textarea id="capstone-highlights" rows={3} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="capstone-challenges">Q11_15: What were the main challenges you faced?</Label>
                    <Textarea id="capstone-challenges" rows={3} />
                </div>
            </div>
            
             <Separator />

            {/* Mentor Feedback */}
             <div className="space-y-4">
                <Label>Q12_17: How would you rate your mentor on the following qualities?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-2">
                        <p className="font-medium text-sm">Effective Communicator</p>
                        <Slider defaultValue={[4]} max={5} step={1} />
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium text-sm">Provided Timely Support</p>
                        <Slider defaultValue={[5]} max={5} step={1} />
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium text-sm">Delivered Detailed Instructions</p>
                        <Slider defaultValue={[3]} max={5} step={1} />
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium text-sm">Demonstrated Professional Knowledge</p>
                        <Slider defaultValue={[5]} max={5} step={1} />
                    </div>
                     <div className="space-y-2">
                        <p className="font-medium text-sm">Provided Quality Feedback</p>
                        <Slider defaultValue={[4]} max={5} step={1} />
                    </div>
                </div>
             </div>

             <Separator />

            {/* Final Thoughts */}
             <div className="space-y-4">
                 <div className="space-y-3">
                    <Label>Q13_18: Was the length of the capstone project sufficient?</Label>
                    <RadioGroup defaultValue="yes" className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="len-yes" /><Label htmlFor="len-yes" className="font-normal">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="len-no" /><Label htmlFor="len-no" className="font-normal">No</Label></div>
                    </RadioGroup>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="len-explain">Q14_19: If no, please explain:</Label>
                    <Textarea id="len-explain" rows={2} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="changes-suggested">Q15_16: What changes would you suggest for future capstone projects?</Label>
                    <Textarea id="changes-suggested" rows={3} />
                </div>
                 <div className="space-y-3">
                    <Label>Q16_20: Would you recommend the capstone project to your peers?</Label>
                    <RadioGroup defaultValue="yes" className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="rec-yes" /><Label htmlFor="rec-yes" className="font-normal">Yes</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="rec-no" /><Label htmlFor="rec-no" className="font-normal">No</Label></div>
                    </RadioGroup>
                </div>
             </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg">
                    <Send className="mr-2" />
                    Submit Feedback
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
