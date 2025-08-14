import type { Student, Project, Survey, SurveyResponse, Mentor, Company } from './types';

export const students: Student[] = [
  {
    id: '1',
    firstName: 'Aisha',
    lastName: 'Khan',
    fullName: 'Aisha Khan',
    email1: 'aisha.khan@example.com',
    emailAddress: 'aisha.khan@example.com',
    studentId: 'S001',
    skills: ['JavaScript', 'React', 'Node.js', 'Data Analysis'],
    resume: 'Aisha Khan has a strong background in web development and data analysis. She has worked on several projects involving front-end development with React and back-end with Node.js. She is also proficient in using data analysis tools to derive insights.',
    status: 'Approved',
    projectId: 'p1',
    mentorId: 'm1',
    ndaStatus: 'Signed',
  },
  {
    id: '2',
    firstName: 'Ben',
    lastName: 'Carter',
    fullName: 'Ben Carter',
    email1: 'ben.carter@example.com',
    emailAddress: 'ben.carter@example.com',
    studentId: 'S002',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Project Management'],
    resume: 'Ben Carter is a machine learning enthusiast with experience in developing predictive models using Python and TensorFlow. He has a proven track record of managing projects from conception to completion and is an excellent communicator.',
    status: 'Approved',
    projectId: 'p1',
    mentorId: 'm1',
    ndaStatus: 'Pending',
  },
  {
    id: '3',
    firstName: 'Carla',
    lastName: 'Rodriguez',
    fullName: 'Carla Rodriguez',
    email1: 'carla.rodriguez@example.com',
    emailAddress: 'carla.rodriguez@example.com',
    studentId: 'S003',
    skills: ['UX/UI Design', 'Figma', 'Adobe XD', 'User Research'],
    resume: 'Carla Rodriguez is a creative UX/UI designer with a passion for creating intuitive and user-friendly interfaces. She is skilled in using Figma and Adobe XD for prototyping and has conducted extensive user research to inform her design decisions.',
    status: 'Approved',
    projectId: 'p2',
    mentorId: 'm1',
    ndaStatus: 'Signed',
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Lee',
    fullName: 'David Lee',
    email1: 'david.lee@example.com',
    emailAddress: 'david.lee@example.com',
    studentId: 'S004',
    skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
    resume: 'David Lee is a software engineer specializing in building scalable microservices with Java and Spring Boot. He has experience deploying applications on AWS and is knowledgeable about cloud architecture best practices.',
    status: 'Pending',
    ndaStatus: 'Pending',
  },
];

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'AI-Powered Data Visualization Platform',
    company: 'Innovate Inc.',
    description: 'Develop an interactive platform that uses AI to automatically generate insightful visualizations from raw data sets. Requires skills in data analysis, machine learning, and front-end development (React).',
    status: 'Ongoing',
    studentIds: ['1', '2'],
  },
  {
    id: 'p2',
    name: 'Mobile-First E-commerce App',
    company: 'ShopSphere',
    description: 'Create a new mobile e-commerce application with a heavy focus on user experience and intuitive design. Looking for a student with strong UX/UI design skills and experience in user research.',
    status: 'Ongoing',
    studentIds: ['3'],
  },
  {
    id: 'p3',
    name: 'Cloud-Native Backend System',
    company: 'DataCore',
    description: 'Build a robust and scalable backend system for a high-traffic application using microservices architecture. Ideal candidates have experience with Java, Spring Boot, and cloud platforms like AWS.',
    status: 'Completed',
    studentIds: [],
  },
  {
    id: 'p4',
    name: 'Data Pipeline Automation',
    company: 'Innovate Inc.',
    description: 'Design and implement a fully automated data pipeline for real-time analytics.',
    status: 'Not Assigned',
    studentIds: [],
  }
];

export const surveys: Survey[] = [
  {
    id: 's1',
    title: 'Post-Internship Feedback 2024',
    status: 'Active',
    responses: 84,
    totalParticipants: 150,
    createdAt: '2024-05-10',
    lastReminderSent: '2024-06-20',
  },
  {
    id: 's2',
    title: 'Student Skills Self-Assessment',
    status: 'Active',
    responses: 112,
    totalParticipants: 150,
    createdAt: '2024-05-15',
  },
  {
    id: 's3',
    title: 'Project Interest Survey',
    status: 'Closed',
    responses: 95,
    totalParticipants: 100,
    createdAt: '2024-04-20',
  },
  {
    id: 's4',
    title: 'Safirnaction Objectives Alignment',
    status: 'Closed',
    responses: 76,
    totalParticipants: 80,
    createdAt: '2024-04-01',
  },
    {
    id: 's5',
    title: 'Innovate Inc. Satisfaction Survey',
    status: 'Active',
    responses: 15,
    totalParticipants: 25,
    createdAt: '2024-06-01',
    lastReminderSent: '2024-06-15',
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

const menteesForDrReed = students.slice(0, 3);

export const mentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Dr. Evelyn Reed',
    skills: ['AI/ML', 'Data Science', 'Python', 'Natural Language Processing'],
    pastProjects: [
      'Sentiment Analysis for Customer Feedback',
      'Predictive Maintenance for Industrial IoT',
      'Image Recognition for Retail',
    ],
    mentees: menteesForDrReed,
  },
];


export const companies: Company[] = [
    {
        id: 'c1',
        name: 'Innovate Inc.',
        projects: [projects[0]],
    },
    {
        id: 'c2',
        name: 'ShopSphere',
        projects: [projects[1]],
    },
    {
        id: 'c3',
        name: 'DataCore',
        projects: [projects[2]],
    }
]
