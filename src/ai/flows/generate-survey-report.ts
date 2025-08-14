'use server';

/**
 * @fileOverview An AI agent for generating a summary report from survey data.
 *
 * - generateSurveyReport - A function that handles the report generation process.
 * - GenerateSurveyReportInput - The input type for the generateSurveyReport function.
 * - GenerateSurveyReportOutput - The return type for the generateSurveyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSurveyReportInputSchema = z.object({
  surveyTitle: z.string().describe('The title of the survey.'),
  surveyData: z
    .string()
    .describe('The raw text data of the survey responses.'),
});
export type GenerateSurveyReportInput = z.infer<
  typeof GenerateSurveyReportInputSchema
>;

const GenerateSurveyReportOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key findings, trends, and overall sentiment from the survey data.'
    ),
});
export type GenerateSurveyReportOutput = z.infer<
  typeof GenerateSurveyReportOutputSchema
>;

export async function generateSurveyReport(
  input: GenerateSurveyReportInput
): Promise<GenerateSurveyReportOutput> {
  return generateSurveyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSurveyReportPrompt',
  input: {schema: GenerateSurveyReportInputSchema},
  output: {schema: GenerateSurveyReportOutputSchema},
  prompt: `You are an expert data analyst specializing in survey analysis.

  Analyze the provided survey data and generate a concise summary report.
  The summary should highlight key findings, recurring themes, and the overall sentiment of the responses.
  Keep the summary to 2-3 sentences.

  Survey Title: {{{surveyTitle}}}
  Survey Data:
  {{{surveyData}}}
`,
});

const generateSurveyReportFlow = ai.defineFlow(
  {
    name: 'generateSurveyReportFlow',
    inputSchema: GenerateSurveyReportInputSchema,
    outputSchema: GenerateSurveyReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
