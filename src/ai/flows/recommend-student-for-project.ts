'use server';

/**
 * @fileOverview An AI agent for recommending the best student for a project.
 *
 * - recommendStudentForProject - A function that handles the student recommendation process.
 * - RecommendStudentInput - The input type for the recommendStudentForProject function.
 * - RecommendStudentOutput - The return type for the recommendStudentForProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Student } from '@/lib/types';


const StudentCandidateSchema = z.object({
  id: z.string().describe("The student's unique identifier."),
  name: z.string().describe("The student's full name."),
  resume: z.string().describe("The text content of the student's resume."),
});

const RecommendStudentInputSchema = z.object({
  projectDescription: z.string().describe('The description of the project scope.'),
  students: z.array(StudentCandidateSchema).describe('A list of available students to evaluate.'),
});
export type RecommendStudentInput = z.infer<typeof RecommendStudentInputSchema>;

const RecommendStudentOutputSchema = z.object({
  studentId: z.string().describe("The ID of the best-matched student."),
  matchScore: z
    .number()
    .describe(
      'A score indicating the compatibility between the recommended student and the project (0-100).'
    ),
  justification: z
    .string()
    .describe(
      'An explanation of why the recommended student is the best fit for the project, highlighting relevant skills and experiences.'
    ),
});
export type RecommendStudentOutput = z.infer<
  typeof RecommendStudentOutputSchema
>;

export async function recommendStudentForProject(
  input: RecommendStudentInput
): Promise<RecommendStudentOutput> {
  return recommendStudentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendStudentPrompt',
  input: {schema: RecommendStudentInputSchema},
  output: {schema: RecommendStudentOutputSchema},
  prompt: `You are an expert talent acquisition agent specializing in matching students to capstone projects.

  Your task is to analyze the project description and the resumes of all available students to identify the single best candidate for the project.

  Project Description:
  {{{projectDescription}}}

  Available Students:
  {{#each students}}
  ---
  Student ID: {{this.id}}
  Student Name: {{this.name}}
  Resume:
  {{{this.resume}}}
  ---
  {{/each}}

  Evaluate all students based on their skills, experience, and how well they align with the project's requirements.
  
  After your evaluation, provide the ID of the single best student, a match score (0-100) for that student, and a detailed justification for your recommendation.
  Your justification should clearly explain why this student is a better fit than the others.
`,
});

const recommendStudentFlow = ai.defineFlow(
  {
    name: 'recommendStudentFlow',
    inputSchema: RecommendStudentInputSchema,
    outputSchema: RecommendStudentOutputSchema,
  },
  async input => {
    // If there are no students, we can't make a recommendation.
    if (input.students.length === 0) {
        throw new Error("No students available to recommend from.");
    }
    const {output} = await prompt(input);
    return output!;
  }
);
