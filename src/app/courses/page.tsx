
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2, Download, User, Users } from "lucide-react";
import { students as allStudents, mentors as allMentors } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Course = {
  id: string;
  title: string;
  code: string;
  schedule: string;
  delivery: "online" | "in-person";
  classroom?: string;
  studentIds: string[];
  mentorId?: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    title: "",
    code: "",
    schedule: "",
    delivery: "online",
    classroom: "",
    studentIds: [],
    mentorId: undefined,
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

  const handleStudentSelection = (studentId: string) => {
    setNewCourse((prev) => {
        const newStudentIds = prev.studentIds.includes(studentId)
            ? prev.studentIds.filter(id => id !== studentId)
            : [...prev.studentIds, studentId];
        return { ...prev, studentIds: newStudentIds };
    });
  }

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
      studentIds: [],
      mentorId: undefined,
    });
  };

  const handleRemoveCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };
  
  const handleDownloadRoster = (course: Course) => {
    const mentor = allMentors.find(m => m.id === course.mentorId);
    const students = allStudents.filter(s => course.studentIds.includes(s.id));
    
    const rosterData = {
        courseTitle: course.title,
        courseCode: course.code,
        mentor: mentor ? mentor.name : "N/A",
        students: students.map(s => ({
            name: s.fullName,
            email: s.emailAddress,
        }))
    };
    
    console.log("Downloading Roster for LMS:", rosterData);
    alert(`Roster data for ${course.title} logged to the console.`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">
          Add, view, and manage course schedules and student rosters.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
          <CardDescription>
            Fill in the details to add a new course and assign participants.
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
            <div className="space-y-2">
                <Label htmlFor="mentorId">Assign Mentor</Label>
                <Select value={newCourse.mentorId} onValueChange={(value) => setNewCourse(p => ({...p, mentorId: value}))}>
                    <SelectTrigger id="mentorId">
                        <SelectValue placeholder="Select a mentor" />
                    </SelectTrigger>
                    <SelectContent>
                        {allMentors.map(mentor => (
                            <SelectItem key={mentor.id} value={mentor.id}>
                                {mentor.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2 lg:col-span-2">
                <Label>Assign Students</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                           {newCourse.studentIds.length > 0 ? `${newCourse.studentIds.length} student(s) selected` : "Select students"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                         <div className="p-4 space-y-2">
                            {allStudents.map(student => (
                                <div key={student.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`student-${student.id}`}
                                        checked={newCourse.studentIds.includes(student.id)}
                                        onCheckedChange={() => handleStudentSelection(student.id)}
                                    />
                                    <Label htmlFor={`student-${student.id}`} className="font-normal">
                                        {student.fullName}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
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
            A list of all available courses and their assigned participants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title & Code</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => {
                    const mentor = allMentors.find(m => m.id === course.mentorId);
                    const students = allStudents.filter(s => course.studentIds.includes(s.id));
                    return (
                      <TableRow key={course.id}>
                        <TableCell>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-xs text-muted-foreground">{course.code}</p>
                        </TableCell>
                        <TableCell>{course.schedule}</TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="capitalize">{course.delivery}</Badge>
                            {course.delivery === 'in-person' && <p className="text-xs text-muted-foreground mt-1">{course.classroom || 'N/A'}</p>}
                        </TableCell>
                        <TableCell>{mentor?.name || 'N/A'}</TableCell>
                        <TableCell>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="link" className="p-0 h-auto" disabled={students.length === 0}>
                                        {students.length} assigned
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="space-y-2">
                                        <p className="font-semibold text-sm">Student Roster</p>
                                        {students.map(s => <p key={s.id} className="text-xs">{s.fullName}</p>)}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadRoster(course)}
                            className="mr-2"
                          >
                            <Download className="mr-2 h-3 w-3" /> Roster
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                })
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
