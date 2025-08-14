'use server';

/**
 * @fileOverview An AI agent for ranking multiple students for a single project.
 *
 * - rankStudentsForProject - A function that handles the student ranking process.
 * - RankStudentsForProjectInput - The input type for the rankStudentsForProject function.
 * - RankStudentsForProjectOutput - The return type for the rankStudentsForProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentCandidateSchema = z.object({
  id: z.string().describe("The student's unique identifier."),
  name: z.string().describe("The student's full name."),
  resume: z.string().describe("The text content of the student's resume."),
});

const RankedStudentSchema = z.object({
    studentId: z.string().describe("The student's unique identifier."),
    matchScore: z
        .number()
        .describe(
        'A score indicating the compatibility between the student and the project (0-100).'
        ),
    justification: z
        .string()
        .describe(
        'A brief (1-2 sentence) explanation of why the student is a good fit for the project, highlighting relevant skills and experiences.'
        ),
});


const RankStudentsForProjectInputSchema = z.object({
  projectDescription: z.string().describe('The description of the project scope.'),
  students: z.array(StudentCandidateSchema).describe('A list of available students to evaluate.'),
});
export type RankStudentsForProjectInput = z.infer<typeof RankStudentsForProjectInputSchema>;

const RankStudentsForProjectOutputSchema = z.object({
  rankedStudents: z.array(RankedStudentSchema).describe('A ranked list of students with their match scores and justifications.')
});
export type RankStudentsForProjectOutput = z.infer<
  typeof RankStudentsForProjectOutputSchema
>;

export async function rankStudentsForProject(
  input: RankStudentsForProjectInput
): Promise<RankStudentsForProjectOutput> {
  return rankStudentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankStudentsPrompt',
  input: {schema: RankStudentsForProjectInputSchema},
  output: {schema: RankStudentsForProjectOutputSchema},
  prompt: `You are an expert talent acquisition agent specializing in matching students to capstone projects.

  Your task is to analyze the project description and the resumes of all available students. For EACH student, provide a match score (0-100) and a brief (1-2 sentence) justification for their fit.
  Rank the students from highest score to lowest score in the final output array.

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
`,
});

const rankStudentsFlow = ai.defineFlow(
  {
    name: 'rankStudentsFlow',
    inputSchema: RankStudentsForProjectInputSchema,
    outputSchema: RankStudentsForProjectOutputSchema,
  },
  async input => {
    if (input.students.length === 0) {
        return { rankedStudents: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
