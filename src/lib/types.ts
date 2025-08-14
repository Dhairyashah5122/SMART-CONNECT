export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email1: string;
  email2?: string;
  skills: string[];
  resume: string;
  status: 'Approved' | 'Pending';
  projectId?: string;
  mentorId?: string;
};

export type Project = {
  id: string;
  name:string;
  company: string;
  description: string;
  finalReportUrl?: string;
  projectCharterUrl?: string;
};

export type Survey = {
  id: string;
  title: string;
  status: 'Active' | 'Closed';
  responses: number;
  totalParticipants: number;
  createdAt: string;
  lastReminderSent?: string;
};

export type SurveyResponse = {
  month: string;
  responses: number;
};

export type Mentor = {
  id: string;
  name: string;
  skills: string[];
  pastProjects: string[];
  mentees: Student[];
};

export type Company = {
    id: string;
    name: string;
    projects: Project[];
}
