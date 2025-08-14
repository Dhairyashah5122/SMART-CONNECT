
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export function LinkExternalSurveyForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="survey-title">Survey Title</Label>
        <Input id="survey-title" placeholder="e.g., Company Satisfaction Survey (External)" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="survey-url">Survey URL</Label>
        <Input id="survey-url" type="url" placeholder="https://forms.gle/your-survey-link" />
      </div>
      <div className="flex justify-end">
        <Button>
          <Save className="mr-2" />
          Save Survey Link
        </Button>
      </div>
    </form>
  );
}
