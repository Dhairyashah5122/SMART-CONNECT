'use server';

/**
 * @fileOverview An AI agent for generating a case study from a project report.
 *
 * - generateCaseStudy - A function that handles the case study generation process.
 * - GenerateCaseStudyInput - The input type for the generateCaseStudy function.
 * - GenerateCaseStudyOutput - The return type for the generateCaseStudy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaseStudyInputSchema = z.object({
  projectReport: z
    .string()
    .describe(
      'The project report document, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type GenerateCaseStudyInput = z.infer<
  typeof GenerateCaseStudyInputSchema
>;

const GenerateCaseStudyOutputSchema = z.object({
  caseStudy: z
    .string()
    .describe(
      'A detailed case study including sections for Introduction, Problem Statement, Solution, Results, and Conclusion.'
    ),
});
export type GenerateCaseStudyOutput = z.infer<
  typeof GenerateCaseStudyOutputSchema
>;

export async function generateCaseStudy(
  input: GenerateCaseStudyInput
): Promise<GenerateCaseStudyOutput> {
  return generateCaseStudyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaseStudyPrompt',
  input: {schema: GenerateCaseStudyInputSchema},
  output: {schema: GenerateCaseStudyOutputSchema},
  prompt: `You are an expert in creating professional case studies from project reports.

  Analyze the following project report and generate a detailed case study.
  The case study should have the following sections:
  1.  **Introduction:** Briefly introduce the project and the client.
  2.  **Problem Statement:** Clearly define the problem the project aimed to solve.
  3.  **Solution:** Describe the solution implemented by the student team.
  4.  **Results:** Highlight the key outcomes and impact of the project.
  5.  **Conclusion:** Summarize the project and its success.

  Project Report: {{media url=projectReport}}
`,
});

const generateCaseStudyFlow = ai.defineFlow(
  {
    name: 'generateCaseStudyFlow',
    inputSchema: GenerateCaseStudyInputSchema,
    outputSchema: GenerateCaseStudyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
