'use server';

/**
 * @fileOverview AI-powered comparative analysis flow.
 *
 * - comparativeAnalysis - A function that performs comparative analysis between project scopes, student outcomes, and Safirnaction objectives.
 * - ComparativeAnalysisInput - The input type for the comparativeAnalysis function.
 * - ComparativeAnalysisOutput - The return type for the comparativeAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComparativeAnalysisInputSchema = z.object({
  projectCharter: z
    .string()
    .describe(
      "The project charter document, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  finalReport: z
    .string()
    .describe(
      "The final report document, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  safirnactionObjectives: z
    .string()
    .describe('Description of Safirnaction objectives.'),
});

export type ComparativeAnalysisInput = z.infer<typeof ComparativeAnalysisInputSchema>;

const ComparativeAnalysisOutputSchema = z.object({
  analysis: z.string().describe('The comparative analysis result.'),
  gaps: z.string().describe('Identified gaps between project scope, student outcomes, and Safirnaction objectives.'),
  alignments: z
    .string()
    .describe('Identified alignments between project scope, student outcomes, and Safirnaction objectives.'),
});

export type ComparativeAnalysisOutput = z.infer<typeof ComparativeAnalysisOutputSchema>;

export async function comparativeAnalysis(
  input: ComparativeAnalysisInput
): Promise<ComparativeAnalysisOutput> {
  return comparativeAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'comparativeAnalysisPrompt',
  input: {schema: ComparativeAnalysisInputSchema},
  output: {schema: ComparativeAnalysisOutputSchema},
  prompt: `You are an expert in performing comparative analysis between project scopes, student outcomes, and organizational objectives.

  Analyze the following information to identify gaps and alignments:

  Project Charter: {{media url=projectCharter}}
  Final Report: {{media url=finalReport}}
  Safirnaction Objectives: {{{safirnactionObjectives}}}

  The Project Charter defines the project scope. The Final Report details the student outcomes.
  Provide a detailed analysis, highlighting the gaps and alignments between these three aspects.
  Ensure the analysis is clear, concise, and actionable.
  
  Output the analysis, gaps and alignments in a structured format.`,
});

const comparativeAnalysisFlow = ai.defineFlow(
  {
    name: 'comparativeAnalysisFlow',
    inputSchema: ComparativeAnalysisInputSchema,
    outputSchema: ComparativeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
