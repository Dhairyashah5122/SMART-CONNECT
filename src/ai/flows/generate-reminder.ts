'use server';

/**
 * @fileOverview An AI agent for generating survey reminder messages.
 *
 * - generateReminder - A function that handles the reminder generation process.
 * - GenerateReminderInput - The input type for the generateReminder function.
 * - GenerateReminderOutput - The return type for the generateReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReminderInputSchema = z.object({
  surveyTitle: z.string().describe('The title of the survey.'),
});
export type GenerateReminderInput = z.infer<typeof GenerateReminderInputSchema>;

const GenerateReminderOutputSchema = z.object({
  subject: z.string().describe('The subject line for the reminder email.'),
  body: z.string().describe('The body content for the reminder email.'),
});
export type GenerateReminderOutput = z.infer<
  typeof GenerateReminderOutputSchema
>;

export async function generateReminder(
  input: GenerateReminderInput
): Promise<GenerateReminderOutput> {
  return generateReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReminderPrompt',
  input: {schema: GenerateReminderInputSchema},
  output: {schema: GenerateReminderOutputSchema},
  prompt: `You are an assistant responsible for encouraging survey completion.

  Generate a friendly and professional reminder email for the following survey.
  The tone should be encouraging, not demanding. Mention the importance of their feedback.
  Keep the message concise.

  Survey Title: {{{surveyTitle}}}
`,
});

const generateReminderFlow = ai.defineFlow(
  {
    name: 'generateReminderFlow',
    inputSchema: GenerateReminderInputSchema,
    outputSchema: GenerateReminderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
