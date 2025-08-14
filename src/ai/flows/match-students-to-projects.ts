// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI agent for matching students to projects based on skills and interests.
 *
 * - matchStudentsToProjects - A function that handles the student-project matching process.
 * - MatchStudentsToProjectsInput - The input type for the matchStudentsToProjects function.
 * - MatchStudentsToProjectsOutput - The return type for the matchStudentsToProjects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchStudentsToProjectsInputSchema = z.object({
  studentResume: z.string().describe('The resume of the student.'),
  projectDescription: z.string().describe('The description of the project scope.'),
});
export type MatchStudentsToProjectsInput = z.infer<
  typeof MatchStudentsToProjectsInputSchema
>;

const MatchStudentsToProjectsOutputSchema = z.object({
  matchScore: z
    .number()
    .describe(
      'A score indicating the compatibility between the student and the project (0-100).'
    ),
  justification: z
    .string()
    .describe(
      'An explanation of why the student is a good fit for the project, highlighting relevant skills and experiences.'
    ),
});
export type MatchStudentsToProjectsOutput = z.infer<
  typeof MatchStudentsToProjectsOutputSchema
>;

export async function matchStudentsToProjects(
  input: MatchStudentsToProjectsInput
): Promise<MatchStudentsToProjectsOutput> {
  return matchStudentsToProjectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchStudentsToProjectsPrompt',
  input: {schema: MatchStudentsToProjectsInputSchema},
  output: {schema: MatchStudentsToProjectsOutputSchema},
  prompt: `You are an AI assistant designed to match students to projects based on their skills and interests.

  Analyze the student's resume and the project description to determine the suitability of the student for the project.
  Provide a match score (0-100) and a justification for the score.

  Student Resume: {{{studentResume}}}
  Project Description: {{{projectDescription}}}
`,
});

const matchStudentsToProjectsFlow = ai.defineFlow(
  {
    name: 'matchStudentsToProjectsFlow',
    inputSchema: MatchStudentsToProjectsInputSchema,
    outputSchema: MatchStudentsToProjectsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
