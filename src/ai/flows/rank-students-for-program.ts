'use server';

/**
 * @fileOverview An AI agent for ranking student applications for a capstone program.
 *
 * - rankStudentsForProgram - Ranks students based on their qualifications for program admission.
 * - RankStudentsForProgramInput - The input type for the rankStudentsForProgram function.
 * - RankStudentsForProgramOutput - The return type for the rankStudentsForProgram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentApplicantSchema = z.object({
  id: z.string().describe("The student's unique identifier."),
  name: z.string().describe("The student's full name."),
  resume: z.string().describe("The text content of the student's resume."),
  gpa: z.number().describe("The student's Grade Point Average."),
  skills: z.array(z.string()).describe("A list of the student's skills."),
});

const RankedApplicantSchema = z.object({
    studentId: z.string().describe("The student's unique identifier."),
    holisticScore: z
        .number()
        .describe(
        'A holistic score from 0-100 indicating the student\'s overall suitability for the competitive capstone program. This should be a weighted average of their GPA, the relevance and diversity of their skills, and the quality of their experience described in the resume.'
        ),
    justification: z
        .string()
        .describe(
        'A brief (1-2 sentence) justification for the score, summarizing the student\'s key strengths and potential for success in the program.'
        ),
});


const RankStudentsForProgramInputSchema = z.object({
  students: z.array(StudentApplicantSchema).describe('A list of student applicants to evaluate for program admission.'),
});
export type RankStudentsForProgramInput = z.infer<typeof RankStudentsForProgramInputSchema>;

const RankStudentsForProgramOutputSchema = z.object({
  rankedStudents: z.array(RankedApplicantSchema).describe('A list of students ranked by their holistic score, from highest to lowest.')
});
export type RankStudentsForProgramOutput = z.infer<
  typeof RankStudentsForProgramOutputSchema
>;

export async function rankStudentsForProgram(
  input: RankStudentsForProgramInput
): Promise<RankStudentsForProgramOutput> {
  return rankStudentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankStudentsForProgramPrompt',
  input: {schema: RankStudentsForProgramInputSchema},
  output: {schema: RankStudentsForProgramOutputSchema},
  prompt: `You are an expert admissions officer for a highly competitive university capstone program.

  Your task is to conduct a holistic review of all student applicants. For EACH student, you must provide a holistic score (0-100) and a brief justification.
  The score should reflect the student's overall potential for success, considering their academic performance (GPA), the breadth and depth of their skills, and the quality of experience described in their resume.

  Rank the students from highest score to lowest in the final output array.

  Available Student Applicants:
  {{#each students}}
  ---
  Student ID: {{this.id}}
  Student Name: {{this.name}}
  GPA: {{this.gpa}}
  Skills: {{#each this.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Resume:
  {{{this.resume}}}
  ---
  {{/each}}

  Evaluate all students fairly and provide a ranked list based on your expert judgment.
`,
});

const rankStudentsFlow = ai.defineFlow(
  {
    name: 'rankStudentsForProgramFlow',
    inputSchema: RankStudentsForProgramInputSchema,
    outputSchema: RankStudentsForProgramOutputSchema,
  },
  async input => {
    if (input.students.length === 0) {
        return { rankedStudents: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
