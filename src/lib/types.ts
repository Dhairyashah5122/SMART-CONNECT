

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
    // Role-specific profile data
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
    rejectionReason?: string;
};

// Profile for Mentors, linked to a User
export type MentorProfile = {
    skills: string[];
    pastProjects: string[];
    status: 'Active' | 'Inactive' | 'Available';
};

export type Milestone = {
    id: string;
    text: string;
    status: 'pending' | 'completed';
    dueDate: string;
};

// Redefined Student to use the new User/Profile structure
export type Student = User & {
    studentProfile: StudentProfile;
};

// Redefined Mentor to use the new User/Profile structure
export type Mentor = User & {
    mentorProfile: MentorProfile;
};

export type Project = {
  id: string;
  name: string;
  companyId: string; // Link to Company table
  description: string;
  finalReportUrl?: string;
  projectCharterUrl?: string;
  status: 'Ongoing' | 'Completed' | 'Not Assigned';
  studentIds: string[]; // Array of User IDs
  mentorIds: string[]; // Array of User IDs
  courseIds: string[]; // Array of Course IDs
  startDate: string;
  completionDate: string;
  createdAt: string;
  updatedAt: string;
};

export type Survey = {
  id: string;
  title: string;
  type: 'Student Satisfaction' | 'Company Feedback' | 'Mentor Review' | 'Self-Assessment';
  status: 'Active' | 'Closed';
  totalParticipants: number;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
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
  industry: string;
  websiteUrl?: string;
  contactName: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  title: string;
  code: string;
  schedule: string;
  delivery: "online" | "in-person";
  classroom?: string;
  mentorId?: string; // User ID of the mentor
  createdAt: string;
  updatedAt: string;
};

// This join table would be implicit in a NoSQL DB like Firestore
// but is good to define for clarity.
export type CourseEnrollment = {
    courseId: string;
    studentId: string; // User ID of the student
}
