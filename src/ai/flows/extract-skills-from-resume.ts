'use server';

/**
 * @fileOverview An AI agent for extracting skills from a student's resume.
 *
 * - extractSkillsFromResume - A function that handles the skill extraction process.
 * - ExtractSkillsFromResumeInput - The input type for the extractSkillsFromResume function.
 * - ExtractSkillsFromResumeOutput - The return type for the extractSkillsFromResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsFromResumeInputSchema = z.object({
  resume: z.string().describe('The full text content of the student\'s resume.'),
});
export type ExtractSkillsFromResumeInput = z.infer<
  typeof ExtractSkillsFromResumeInputSchema
>;

const ExtractSkillsFromResumeOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe(
      'A list of technical and soft skills extracted from the resume.'
    ),
});
export type ExtractSkillsFromResumeOutput = z.infer<
  typeof ExtractSkillsFromResumeOutputSchema
>;

export async function extractSkillsFromResume(
  input: ExtractSkillsFromResumeInput
): Promise<ExtractSkillsFromResumeOutput> {
  return extractSkillsFromResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSkillsFromResumePrompt',
  input: {schema: ExtractSkillsFromResumeInputSchema},
  output: {schema: ExtractSkillsFromResumeOutputSchema},
  prompt: `You are an expert at parsing resumes and extracting key information.

  Analyze the following resume text and identify all the technical and soft skills mentioned.
  Return the skills as an array of strings.

  Resume Text:
  {{{resume}}}
`,
});

const extractSkillsFromResumeFlow = ai.defineFlow(
  {
    name: 'extractSkillsFromResumeFlow',
    inputSchema: ExtractSkillsFromResumeInputSchema,
    outputSchema: ExtractSkillsFromResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
