
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";

type Course = {
  id: string;
  title: string;
  code: string;
  schedule: string;
  delivery: "online" | "in-person";
  classroom?: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    title: "",
    code: "",
    schedule: "",
    delivery: "online",
    classroom: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [id]: value }));
  };

  const handleDeliveryChange = (value: "online" | "in-person") => {
    setNewCourse((prev) => ({ ...prev, delivery: value }));
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newCourse.title ||
      !newCourse.code ||
      !newCourse.schedule
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const courseToAdd: Course = {
      id: `c${Date.now()}`,
      ...newCourse,
    };
    setCourses((prev) => [...prev, courseToAdd]);
    setNewCourse({
      title: "",
      code: "",
      schedule: "",
      delivery: "online",
      classroom: "",
    });
  };

  const handleRemoveCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">
          Add, view, and manage course schedules and details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
          <CardDescription>
            Fill in the details to add a new course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddCourse}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                placeholder="Introduction to AI"
                value={newCourse.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                placeholder="CS101"
                value={newCourse.code}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule Time</Label>
              <Input
                id="schedule"
                placeholder="MWF 10:00 - 11:30"
                value={newCourse.schedule}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-3">
              <Label>Delivery Method</Label>
              <RadioGroup
                value={newCourse.delivery}
                onValueChange={handleDeliveryChange}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="font-normal">
                    Online
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person" className="font-normal">
                    In-Person
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classroom">Classroom Assignment</Label>
              <Input
                id="classroom"
                placeholder="Building A, Room 101"
                value={newCourse.classroom}
                onChange={handleInputChange}
                disabled={newCourse.delivery === "online"}
              />
            </div>
            <div className="lg:col-span-3 flex justify-end">
              <Button type="submit">
                <PlusCircle className="mr-2" /> Add Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
          <CardDescription>
            A list of all available courses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Classroom</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.schedule}</TableCell>
                    <TableCell className="capitalize">{course.delivery}</TableCell>
                    <TableCell>{course.classroom || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No courses added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
