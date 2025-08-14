export type Student = {
  id: string;
  timestamp?: string;
  emailAddress: string;
  fullName: string;
  studentId: string;
  gender?: string;
  primaryInstitution?: string;
  secondaryEmailAddress?: string;
  phoneNumber?: string;
  studentAdvisor?: string;
  languages?: string;
  degreesAndCertificates?: string;
  programEnrolledIn?: string;
  currentGpa?: number;
  desiredSession?: string;
  projectInterests?: string[];
  employmentStatus?: 'Employed' | 'Unemployed' | 'Part-time';
  durationAtCompany?: string;
  dailyDuties?: string;
  skills: string[];
  resume: string; // Keep as text content for now
  ndaFile?: string; // data URI
  consentLetter?: boolean;
  acknowledgement?: boolean;
  status: 'Approved' | 'Pending';
  projectId?: string;
  mentorId?: string;
  ndaStatus?: 'Signed' | 'Pending';
  postCapstoneSurveyStatus?: 'Completed' | 'Pending' | 'Not Started';
  // Deprecating old fields for new ones
  firstName: string; // Can be derived from fullName
  lastName: string; // Can be derived from fullName
  email1: string; // Replaced by emailAddress
};

export type Project = {
  id: string;
  name: string;
  company: string;
  description: string;
  finalReportUrl?: string;
  projectCharterUrl?: string;
  status: 'Ongoing' | 'Completed' | 'Not Assigned';
  studentIds: string[];
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
  month: string;
  responses: number;
};

export type Mentor = {
  id: string;
  name: string;
  email: string;
  skills: string[];
  pastProjects: string[];
  mentees: Student[];
};

export type Company = {
  id: string;
  name: string;
  projects: Project[];
};
