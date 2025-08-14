'use server';

/**
 * @fileOverview An AI agent for generating a project analysis report based on a date range.
 *
 * - generateProjectAnalysisReport - A function that handles the report generation process.
 * - GenerateProjectAnalysisReportInput - The input type for the generateProjectAnalysisReport function.
 * - GenerateProjectAnalysisReportOutput - The return type for the generateProjectAnalysisReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Project } from '@/lib/types';

const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  description: z.string(),
  status: z.enum(['Ongoing', 'Completed', 'Not Assigned']),
  studentIds: z.array(z.string()),
  startDate: z.string(),
  completionDate: z.string(),
});

const GenerateProjectAnalysisReportInputSchema = z.object({
  startDate: z.string().describe('The start date of the reporting period in YYYY-MM-DD format.'),
  endDate: z.string().describe('The end date of the reporting period in YYYY-MM-DD format.'),
  projects: z.array(ProjectSchema).describe('A list of all projects to consider for the report.'),
});
export type GenerateProjectAnalysisReportInput = z.infer<
  typeof GenerateProjectAnalysisReportInputSchema
>;

const GenerateProjectAnalysisReportOutputSchema = z.object({
  report: z
    .string()
    .describe(
      'A comprehensive analysis report including a summary, key outcomes, common themes, and challenges across the selected projects.'
    ),
});
export type GenerateProjectAnalysisReportOutput = z.infer<
  typeof GenerateProjectAnalysisReportOutputSchema
>;

export async function generateProjectAnalysisReport(
  input: GenerateProjectAnalysisReportInput
): Promise<GenerateProjectAnalysisReportOutput> {
  return generateProjectAnalysisReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectAnalysisReportPrompt',
  input: {schema: GenerateProjectAnalysisReportInputSchema},
  output: {schema: GenerateProjectAnalysisReportOutputSchema},
  prompt: `You are an expert project analyst. Your task is to generate a comprehensive report on capstone projects within a specified date range.

  Reporting Period:
  - Start Date: {{{startDate}}}
  - End Date: {{{endDate}}}

  Analyze the following projects that were active or completed within this period:
  {{#each projects}}
  ---
  Project Name: {{this.name}}
  Company: {{this.company}}
  Status: {{this.status}}
  Start Date: {{this.startDate}}
  Completion Date: {{this.completionDate}}
  Description: {{{this.description}}}
  ---
  {{/each}}

  Based on the provided data, generate a report that includes:
  1.  **Executive Summary:** A high-level overview of the projects in the period.
  2.  **Key Outcomes & Successes:** Common achievements and positive results across projects.
  3.  **Recurring Themes & Challenges:** Identify common obstacles, challenges, or recurring themes (e.g., specific technologies, project management hurdles, scope creep).
  4.  **Recommendations:** Suggest potential improvements for future project cohorts based on your analysis.

  The report should be well-structured, insightful, and professional.
`,
});

const generateProjectAnalysisReportFlow = ai.defineFlow(
  {
    name: 'generateProjectAnalysisReportFlow',
    inputSchema: GenerateProjectAnalysisReportInputSchema,
    outputSchema: GenerateProjectAnalysisReportOutputSchema,
  },
  async ({ startDate, endDate, projects }) => {
    // Filter projects that are within the date range.
    // A project is in range if its own date range overlaps with the reporting period.
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredProjects = projects.filter(p => {
        const projectStart = new Date(p.startDate);
        const projectEnd = new Date(p.completionDate);
        return projectStart <= end && projectEnd >= start;
    });

    if (filteredProjects.length === 0) {
      return { report: 'No projects found within the selected date range.' };
    }

    const {output} = await prompt({ startDate, endDate, projects: filteredProjects });
    return output!;
  }
);
