
'use server';

/**
 * @fileOverview An AI agent for generating a student skills matrix report based on a date range.
 *
 * - generateSkillsMatrixReport - A function that handles the report generation process.
 * - GenerateSkillsMatrixReportInput - The input type for the generateSkillsMatrixReport function.
 * - GenerateSkillsMatrixReportOutput - The return type for the generateSkillsMatrixReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Student } from '@/lib/types';

const StudentSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  skills: z.array(z.string()),
  registrationDate: z.string(),
});

const GenerateSkillsMatrixReportInputSchema = z.object({
  startDate: z.string().describe('The start date of the reporting period in YYYY-MM-DD format.'),
  endDate: z.string().describe('The end date of the reporting period in YYYY-MM-DD format.'),
  students: z.array(StudentSchema).describe('A list of all students to consider for the report.'),
});
export type GenerateSkillsMatrixReportInput = z.infer<
  typeof GenerateSkillsMatrixReportInputSchema
>;

const GenerateSkillsMatrixReportOutputSchema = z.object({
  report: z
    .string()
    .describe(
      'A comprehensive skills matrix report including a summary, top skills, skill frequency, and notable unique skills.'
    ),
});
export type GenerateSkillsMatrixReportOutput = z.infer<
  typeof GenerateSkillsMatrixReportOutputSchema
>;

export async function generateSkillsMatrixReport(
  input: GenerateSkillsMatrixReportInput
): Promise<GenerateSkillsMatrixReportOutput> {
  return generateSkillsMatrixReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSkillsMatrixReportPrompt',
  input: {schema: GenerateSkillsMatrixReportInputSchema},
  output: {schema: GenerateSkillsMatrixReportOutputSchema},
  prompt: `You are an expert talent analyst. Your task is to generate a comprehensive skills matrix report for students registered within a specified date range.

  Reporting Period:
  - Start Date: {{{startDate}}}
  - End Date: {{{endDate}}}

  Analyze the skills from the following students registered in this period:
  {{#each students}}
  ---
  Student Name: {{this.fullName}}
  Skills: {{#each this.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  ---
  {{/each}}

  Based on the provided data, generate a report that includes:
  1.  **Executive Summary:** A high-level overview of the collective skillset of the student cohort.
  2.  **Top 10 Most Common Skills:** A list of the 10 most frequently occurring skills and how many students possess them.
  3.  **Skill Frequency Breakdown:** A brief analysis of the distribution of skills (e.g., "Web development and data analysis skills are highly prevalent...").
  4.  **Unique & Notable Skills:** Identify any rare or particularly valuable skills that appear in only one or two students.

  The report should be well-structured, insightful, and professional.
`,
});

const generateSkillsMatrixReportFlow = ai.defineFlow(
  {
    name: 'generateSkillsMatrixReportFlow',
    inputSchema: GenerateSkillsMatrixReportInputSchema,
    outputSchema: GenerateSkillsMatrixReportOutputSchema,
  },
  async ({ startDate, endDate, students }) => {
    // Filter students who were registered within the date range.
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredStudents = students.filter(s => {
        const studentRegDate = new Date(s.registrationDate);
        return studentRegDate >= start && studentRegDate <= end;
    });

    if (filteredStudents.length === 0) {
      return { report: 'No students were registered within the selected date range.' };
    }

    const {output} = await prompt({ startDate, endDate, students: filteredStudents });
    return output!;
  }
);
