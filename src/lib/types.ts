export type Student = {
  id: string;
  name: string;
  email: string;
  skills: string[];
  resume: string;
};

export type Project = {
  id: string;
  name:string;
  company: string;
  description: string;
};

export type Survey = {
  id: string;
  title: string;
  status: 'Active' | 'Closed';
  responses: number;
  createdAt: string;
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