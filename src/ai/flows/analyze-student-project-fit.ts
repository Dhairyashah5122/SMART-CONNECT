'use server';

/**
 * @fileOverview An AI agent for providing a detailed analysis of student-project compatibility.
 *
 * - analyzeStudentProjectFit - A function that handles the analysis process.
 * - AnalyzeStudentProjectFitInput - The input type for the function.
 * - AnalyzeStudentProjectFitOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentAnalysisSchema = z.object({
  id: z.string().describe("The student's unique identifier."),
  name: z.string().describe("The student's full name."),
  resume: z.string().describe("The text content of the student's resume."),
});

const AnalysisResultSchema = z.object({
    studentId: z.string().describe("The student's unique identifier."),
    studentName: z.string().describe("The student's full name."),
    compatibilityScore: z
        .number()
        .describe(
        'A score from 0-100 indicating how well the student\'s skills and experience match the project requirements.'
        ),
    justification: z
        .string()
        .describe(
        'A detailed explanation for the compatibility score, referencing both the project description and the student\'s resume.'
        ),
    strengths: z.array(z.string()).describe("A list of the student's key strengths for this specific project."),
    gaps: z.array(z.string()).describe("A list of potential gaps or areas where the student may need support for this project."),
});


const AnalyzeStudentProjectFitInputSchema = z.object({
  projectDescription: z.string().describe('The description of the project scope.'),
  students: z.array(StudentAnalysisSchema).describe('A list of students to analyze for the project.'),
});
export type AnalyzeStudentProjectFitInput = z.infer<typeof AnalyzeStudentProjectFitInputSchema>;

const AnalyzeStudentProjectFitOutputSchema = z.object({
  analysis: z.array(AnalysisResultSchema).describe('A list containing the detailed analysis for each student.')
});
export type AnalyzeStudentProjectFitOutput = z.infer<
  typeof AnalyzeStudentProjectFitOutputSchema
>;

export async function analyzeStudentProjectFit(
  input: AnalyzeStudentProjectFitInput
): Promise<AnalyzeStudentProjectFitOutput> {
  return analyzeStudentProjectFitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentProjectFitPrompt',
  input: {schema: AnalyzeStudentProjectFitInputSchema},
  output: {schema: AnalyzeStudentProjectFitOutputSchema},
  prompt: `You are an expert academic advisor and talent-to-project matcher for a university capstone program.

  Your task is to provide a detailed analysis of each student's suitability for a given project.
  For each student, you must provide:
  1. A compatibility score (0-100).
  2. A detailed justification for the score.
  3. A list of specific strengths the student brings to this project.
  4. A list of potential gaps or areas where the student might need support.

  Analyze the project description and each student's resume carefully.

  Project Description:
  {{{projectDescription}}}

  Students to Analyze:
  {{#each students}}
  ---
  Student ID: {{this.id}}
  Student Name: {{this.name}}
  Resume:
  {{{this.resume}}}
  ---
  {{/each}}

  Provide a separate, complete analysis for each student in the output array.
`,
});

const analyzeStudentProjectFitFlow = ai.defineFlow(
  {
    name: 'analyzeStudentProjectFitFlow',
    inputSchema: AnalyzeStudentProjectFitInputSchema,
    outputSchema: AnalyzeStudentProjectFitOutputSchema,
  },
  async input => {
    if (input.students.length === 0) {
        return { analysis: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
