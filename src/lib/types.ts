

export type UserRole = 'Admin' | 'Mentor' | 'Student';

// Core User Information
export type User = {
    id: string; // Corresponds to Firebase Auth UID
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    fullName: string; // Combined for display purposes
    profilePhotoUrl?: string;
    createdAt: string;
    updatedAt: string;
    studentProfile?: StudentProfile;
    mentorProfile?: MentorProfile;
};

// Profile for Students, linked to a User
export type StudentProfile = {
    studentIdNumber: string;
    gpa: number;
    program: string;
    resumeText: string;
    skills: string[];
    status: 'Pending' | 'Approved' | 'Rejected';
    ndaStatus: 'Signed' | 'Pending';
    registrationDate: string;
    milestones: Milestone[];
    projectId?: string;
    mentorId?: string;
    rejectionReason?: string;
};

// Profile for Mentors, linked to a User
export type MentorProfile = {
    skills: string[];
    pastProjects: string[];
    status: 'Active' | 'Inactive' | 'Available' | 'Not Available';
    menteeIds: string[];
};

export type Milestone = {
    id: string;
    text: string;
    status: 'pending' | 'completed';
    dueDate: string;
};

// Redefined Student to use the new User/Profile structure
export type Student = User & {
    role: 'Student';
    studentProfile: StudentProfile;
};

// Redefined Mentor to use the new User/Profile structure
export type Mentor = User & {
    role: 'Mentor';
    mentorProfile: MentorProfile;
};


export type Project = {
  id: string;
  name: string;
  company: string;
  description: string;
  finalReportUrl?: string;
  projectCharterUrl?: string;
  status: 'Ongoing' | 'Completed' | 'Not Assigned';
  studentIds: string[]; // Array of User IDs
  mentorIds: string[]; // Array of User IDs
  courseIds: string[]; // Array of Course IDs
  startDate: string;
  completionDate: string;
};

export type Survey = {
  id: string;
  title: string;
  type: 'Student Satisfaction' | 'Company Feedback' | 'Mentor Review' | 'Self-Assessment';
  status: 'Active' | 'Closed';
  responses: number;
  totalParticipants: number;
  createdAt: string;
  dueDate: string;
  lastReminderSent?: string;
};

export type SurveyResponse = {
    id: string;
    surveyId: string; // Foreign Key to Surveys.id
    userId: string; // Foreign Key to Users.id (the respondent)
    responseData: Record<string, any>; // JSON or similar flexible type
    submittedAt: string;
};

export type Company = {
  id:string;
  name: string;
  projects: Project[];
  surveyCompleted: boolean;
};

export type Course = {
  id: string;
  title: string;
  code: string;
  schedule: string;
  delivery: "online" | "in-person";
  classroom?: string;
  studentIds: string[];
  mentorId?: string; // User ID of the mentor
};

// This join table would be implicit in a NoSQL DB like Firestore
// but is good to define for clarity.
export type CourseEnrollment = {
    courseId: string;
    studentId: string; // User ID of the student
}
