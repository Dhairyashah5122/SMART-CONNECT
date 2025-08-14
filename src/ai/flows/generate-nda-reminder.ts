'use server';

/**
 * @fileOverview An AI agent for generating NDA reminder messages.
 *
 * - generateNdaReminder - A function that handles the NDA reminder generation process.
 * - GenerateNdaReminderInput - The input type for the generateNdaReminder function.
 * - GenerateNdaReminderOutput - The return type for the generateNdaReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNdaReminderInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  projectName: z.string().describe('The name of the project.'),
});
export type GenerateNdaReminderInput = z.infer<typeof GenerateNdaReminderInputSchema>;

const GenerateNdaReminderOutputSchema = z.object({
  subject: z.string().describe('The subject line for the reminder email.'),
  body: z.string().describe('The body content for the reminder email.'),
});
export type GenerateNdaReminderOutput = z.infer<
  typeof GenerateNdaReminderOutputSchema
>;

export async function generateNdaReminder(
  input: GenerateNdaReminderInput
): Promise<GenerateNdaReminderOutput> {
  return generateNdaReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNdaReminderPrompt',
  input: {schema: GenerateNdaReminderInputSchema},
  output: {schema: GenerateNdaReminderOutputSchema},
  prompt: `You are an administrative assistant for the SMART Capstone program.

  Generate a friendly and professional reminder email to a student who needs to sign their Non-Disclosure Agreement (NDA).
  The tone should be encouraging and clear, not demanding. Emphasize that signing the NDA is a required step to begin working on their project.
  Keep the message concise.

  Student Name: {{{studentName}}}
  Project Name: {{{projectName}}}
`,
});

const generateNdaReminderFlow = ai.defineFlow(
  {
    name: 'generateNdaReminderFlow',
    inputSchema: GenerateNdaReminderInputSchema,
    outputSchema: GenerateNdaReminderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
