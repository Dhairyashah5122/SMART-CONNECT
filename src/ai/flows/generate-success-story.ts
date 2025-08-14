'use server';

/**
 * @fileOverview An AI agent for generating a success story from a project report.
 *
 * - generateSuccessStory - A function that handles the success story generation process.
 * - GenerateSuccessStoryInput - The input type for the generateSuccessStory function.
 * - GenerateSuccessStoryOutput - The return type for the generateSuccessStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSuccessStoryInputSchema = z.object({
  projectReport: z
    .string()
    .describe(
      'The project report document, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type GenerateSuccessStoryInput = z.infer<
  typeof GenerateSuccessStoryInputSchema
>;

const GenerateSuccessStoryOutputSchema = z.object({
  successStory: z
    .string()
    .describe(
      'A compelling success story highlighting the project achievements.'
    ),
});
export type GenerateSuccessStoryOutput = z.infer<
  typeof GenerateSuccessStoryOutputSchema
>;

export async function generateSuccessStory(
  input: GenerateSuccessStoryInput
): Promise<GenerateSuccessStoryOutput> {
  return generateSuccessStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSuccessStoryPrompt',
  input: {schema: GenerateSuccessStoryInputSchema},
  output: {schema: GenerateSuccessStoryOutputSchema},
  prompt: `You are an expert in writing compelling success stories based on project reports.

  Analyze the following project report and write a short, impactful success story.
  Focus on the key achievements, challenges overcome, and the overall positive impact of the project.
  The tone should be engaging and celebratory.

  Project Report: {{media url=projectReport}}
`,
});

const generateSuccessStoryFlow = ai.defineFlow(
  {
    name: 'generateSuccessStoryFlow',
    inputSchema: GenerateSuccessStoryInputSchema,
    outputSchema: GenerateSuccessStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
