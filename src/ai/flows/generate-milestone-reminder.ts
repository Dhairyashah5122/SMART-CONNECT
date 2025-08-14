'use server';

/**
 * @fileOverview An AI agent for generating milestone reminder messages.
 *
 * - generateMilestoneReminder - A function that handles the reminder generation process.
 * - GenerateMilestoneReminderInput - The input type for the generateMilestoneReminder function.
 * - GenerateMilestoneReminderOutput - The return type for the generateMilestoneReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMilestoneReminderInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  incompleteMilestones: z.array(z.string()).describe('A list of milestones that are incomplete or overdue.'),
});
export type GenerateMilestoneReminderInput = z.infer<typeof GenerateMilestoneReminderInputSchema>;

const GenerateMilestoneReminderOutputSchema = z.object({
  subject: z.string().describe('The subject line for the reminder email.'),
  body: z.string().describe('The body content for the reminder email.'),
});
export type GenerateMilestoneReminderOutput = z.infer<
  typeof GenerateMilestoneReminderOutputSchema
>;

export async function generateMilestoneReminder(
  input: GenerateMilestoneReminderInput
): Promise<GenerateMilestoneReminderOutput> {
  return generateMilestoneReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMilestoneReminderPrompt',
  input: {schema: GenerateMilestoneReminderInputSchema},
  output: {schema: GenerateMilestoneReminderOutputSchema},
  prompt: `You are an administrative assistant for the SMART Capstone program.

  Your task is to generate a friendly but firm reminder email to a student about their incomplete or overdue project milestones.
  The tone should be professional and clear, emphasizing the importance of these items for their project's success.
  List each incomplete milestone clearly.

  Student Name: {{{studentName}}}
  Incomplete Milestones:
  {{#each incompleteMilestones}}
  - {{{this}}}
  {{/each}}
`,
});

const generateMilestoneReminderFlow = ai.defineFlow(
  {
    name: 'generateMilestoneReminderFlow',
    inputSchema: GenerateMilestoneReminderInputSchema,
    outputSchema: GenerateMilestoneReminderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
