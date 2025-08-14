import type { Student, Project, Survey, SurveyResponse } from './types';

export const students: Student[] = [
  {
    id: '1',
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    skills: ['JavaScript', 'React', 'Node.js', 'Data Analysis'],
    resume: 'Aisha Khan has a strong background in web development and data analysis. She has worked on several projects involving front-end development with React and back-end with Node.js. She is also proficient in using data analysis tools to derive insights.',
  },
  {
    id: '2',
    name: 'Ben Carter',
    email: 'ben.carter@example.com',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Project Management'],
    resume: 'Ben Carter is a machine learning enthusiast with experience in developing predictive models using Python and TensorFlow. He has a proven track record of managing projects from conception to completion and is an excellent communicator.',
  },
  {
    id: '3',
    name: 'Carla Rodriguez',
    email: 'carla.rodriguez@example.com',
    skills: ['UX/UI Design', 'Figma', 'Adobe XD', 'User Research'],
    resume: 'Carla Rodriguez is a creative UX/UI designer with a passion for creating intuitive and user-friendly interfaces. She is skilled in using Figma and Adobe XD for prototyping and has conducted extensive user research to inform her design decisions.',
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david.lee@example.com',
    skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
    resume: 'David Lee is a software engineer specializing in building scalable microservices with Java and Spring Boot. He has experience deploying applications on AWS and is knowledgeable about cloud architecture best practices.',
  },
];

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'AI-Powered Data Visualization Platform',
    company: 'Innovate Inc.',
    description: 'Develop an interactive platform that uses AI to automatically generate insightful visualizations from raw data sets. Requires skills in data analysis, machine learning, and front-end development (React).',
  },
  {
    id: 'p2',
    name: 'Mobile-First E-commerce App',
    company: 'ShopSphere',
    description: 'Create a new mobile e-commerce application with a heavy focus on user experience and intuitive design. Looking for a student with strong UX/UI design skills and experience in user research.',
  },
  {
    id: 'p3',
    name: 'Cloud-Native Backend System',
    company: 'DataCore',
    description: 'Build a robust and scalable backend system for a high-traffic application using microservices architecture. Ideal candidates have experience with Java, Spring Boot, and cloud platforms like AWS.',
  },
];

export const surveys: Survey[] = [
  {
    id: 's1',
    title: 'Post-Internship Feedback 2024',
    status: 'Active',
    responses: 84,
    createdAt: '2024-05-10',
  },
  {
    id: 's2',
    title: 'Student Skills Self-Assessment',
    status: 'Active',
    responses: 112,
    createdAt: '2024-05-15',
  },
  {
    id: 's3',
    title: 'Project Interest Survey',
    status: 'Closed',
    responses: 95,
    createdAt: '2024-04-20',
  },
  {
    id: 's4',
    title: 'Safirnaction Objectives Alignment',
    status: 'Closed',
    responses: 76,
    createdAt: '2024-04-01',
  },
];

export const surveyData: SurveyResponse[] = [
    { month: 'January', responses: 12 },
    { month: 'February', responses: 19 },
    { month: 'March', responses: 25 },
    { month: 'April', responses: 32 },
    { month: 'May', responses: 45 },
    { month: 'June', responses: 51 },
];
