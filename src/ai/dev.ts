import { config } from 'dotenv';
config();

import '@/ai/flows/comparative-analysis.ts';
import '@/ai/flows/match-students-to-projects.ts';
import '@/ai/flows/analyze-survey-data.ts';
import '@/ai/flows/extract-skills-from-resume.ts';
import '@/ai/flows/generate-reminder.ts';
import '@/ai/flows/process-student-excel.ts';
import '@/ai/flows/generate-nda-reminder.ts';
import '@/ai/flows/generate-survey-report.ts';
import '@/ai/flows/generate-success-story.ts';
import '@/ai/flows/generate-case-study.ts';
import '@/ai/flows/recommend-student-for-project.ts';
import '@/ai/flows/rank-students-for-project.ts';
import '@/ai/flows/rank-students-for-program.ts';
import '@/ai/flows/generate-project-analysis-report.ts';
