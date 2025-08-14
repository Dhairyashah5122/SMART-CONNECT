"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Send } from "lucide-react";
import { useState } from "react";

export function CreateSurveyForm() {
  const [questions, setQuestions] = useState([{ id: 1, text: "" }]);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: "" }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id: number, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Details</CardTitle>
        <CardDescription>Define the title and questions for your survey.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="survey-title">Survey Title</Label>
          <Input id="survey-title" placeholder="e.g., Company Satisfaction Survey" />
        </div>
        
        <div className="space-y-4">
            <Label>Questions</Label>
            {questions.map((q, index) => (
                <div key={q.id} className="flex items-center gap-2">
                    <Input 
                        placeholder={`Question ${index + 1}`}
                        value={q.text}
                        onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)} disabled={questions.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>

        <div className="flex justify-between items-center">
            <Button variant="outline" onClick={addQuestion}>
                <PlusCircle className="mr-2" />
                Add Question
            </Button>
            <Button>
                <Send className="mr-2" />
                Save and Publish
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
