
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Send } from "lucide-react";
import { Separator } from "../ui/separator";

export function CompanyApplicationForm() {
  return (
    <form className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" placeholder="Acme Corporation" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary-industry">Primary Industry</Label>
            <Input id="primary-industry" placeholder="Technology" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-age">How long has your company been in business?</Label>
            <Input id="company-age" type="number" placeholder="5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee-count">How many employees do you have?</Label>
            <Select>
              <SelectTrigger id="employee-count">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-1000">201-1000</SelectItem>
                <SelectItem value="1000+">1000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="website-url">Company Website URL (if applicable)</Label>
            <Input id="website-url" type="url" placeholder="https://acme.com" />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Person</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="salutation">Salutation</Label>
            <Select>
                <SelectTrigger id="salutation">
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="mr">Mr.</SelectItem>
                    <SelectItem value="ms">Ms.</SelectItem>
                    <SelectItem value="mrs">Mrs.</SelectItem>
                    <SelectItem value="dr">Dr.</SelectItem>
                    <SelectItem value="prof">Prof.</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-full-name">Full Name</Label>
            <Input id="contact-full-name" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="professional-title">Professional Title</Label>
            <Input id="professional-title" placeholder="Project Manager" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email Address</Label>
            <Input id="contact-email" type="email" placeholder="jane.doe@acme.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone Number (include area code)</Label>
            <Input id="contact-phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alternative-contact">Alternative Contact (name and email)</Label>
            <Input id="alternative-contact" placeholder="John Smith, john.smith@acme.com" />
          </div>
        </div>
      </div>

       <Separator />

       <div className="space-y-4">
        <h3 className="text-lg font-medium">Company Location</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="primary-operating-location">Primary Operating Location</Label>
                <Input id="primary-operating-location" placeholder="e.g., California, USA" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="non-us-hq">HQ Location if Outside U.S.</Label>
                <Input id="non-us-hq" placeholder="e.g., London, UK" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="mailing-address">Street / Mailing Address</Label>
                <Input id="mailing-address" placeholder="123 Main St" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="city-state-postal">City, State, Postal Code</Label>
                <Input id="city-state-postal" placeholder="San Francisco, CA 94103" />
            </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Project Details</h3>
        <div className="space-y-2">
          <Label htmlFor="project-scope">Project Scope Description (1-2 paragraphs)</Label>
          <Textarea id="project-scope" rows={5} placeholder="Describe the project goals, deliverables, and any relevant background information." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-expectations">What are your primary expectations from the SMART team?</Label>
          <Textarea id="project-expectations" rows={3} placeholder="e.g., A functional prototype, a market research report, a data analysis model..." />
        </div>
         <div className="space-y-2">
          <Label htmlFor="specific-expertise">Specific expertise or skills required</Label>
          <Textarea id="specific-expertise" rows={2} placeholder="e.g., Python, UI/UX Design, Machine Learning..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <Label>Is the information/data for the project currently available?</Label>
                <RadioGroup defaultValue="yes" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="info-yes" />
                        <Label htmlFor="info-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="info-no" />
                        <Label htmlFor="info-no" className="font-normal">No</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="space-y-3">
                <Label>Are you willing to share this info with the student team under an NDA?</Label>
                 <RadioGroup defaultValue="yes" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="nda-yes" />
                        <Label htmlFor="nda-yes" className="font-normal">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="nda-no" />
                        <Label htmlFor="nda-no" className="font-normal">No</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
      </div>

      <Separator />

       <div className="space-y-4">
          <h3 className="text-lg font-medium">Program Awareness</h3>
            <div className="space-y-2">
                <Label htmlFor="source-awareness">How did you hear about the SMART™ Program?</Label>
                <Input id="source-awareness" placeholder="e.g., Westcliff University website, colleague, event..." />
            </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          <Send className="mr-2" />
          Submit Application
        </Button>
      </div>
    </form>
  )
}
