'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing survey data using AI.
 *
 * - analyzeSurveyData - Analyzes survey data to identify key trends and insights.
 * - AnalyzeSurveyDataInput - The input type for the analyzeSurveyData function.
 * - AnalyzeSurveyDataOutput - The return type for the analyzeSurveyData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSurveyDataInputSchema = z.object({
  surveyData: z
    .string()
    .describe('The survey data to analyze, provided as a string.'),
  projectScope: z
    .string()
    .describe('The project scope description for comparative analysis.'),
  safirnactionObjectives: z
    .string()
    .describe('The objectives of Safirnaction for alignment analysis.'),
});
export type AnalyzeSurveyDataInput = z.infer<typeof AnalyzeSurveyDataInputSchema>;

const AnalyzeSurveyDataOutputSchema = z.object({
  keyTrends: z
    .string()
    .describe('Key trends and insights identified from the survey data.'),
  thematicAnalysis: z
    .string()
    .describe('A thematic analysis of the survey responses, identifying recurring themes.'),
  sentimentAnalysis: z
    .string()
    .describe('An analysis of the overall sentiment (positive, negative, neutral) of the survey responses.'),
  projectAlignment: z
    .string()
    .describe(
      'Comparative analysis between project scope, student outcomes, and Safirnaction objectives, highlighting gaps and alignments.'
    ),
});
export type AnalyzeSurveyDataOutput = z.infer<typeof AnalyzeSurveyDataOutputSchema>;

export async function analyzeSurveyData(input: AnalyzeSurveyDataInput): Promise<AnalyzeSurveyDataOutput> {
  return analyzeSurveyDataFlow(input);
}

const analyzeSurveyDataPrompt = ai.definePrompt({
  name: 'analyzeSurveyDataPrompt',
  input: {schema: AnalyzeSurveyDataInputSchema},
  output: {schema: AnalyzeSurveyDataOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing survey data and providing insights.

  Analyze the following survey data to identify key trends, perform a thematic analysis, and determine the overall sentiment.
  Survey Data: {{{surveyData}}}

  Perform a comparative analysis between the project scope, student outcomes (derived from survey data), and Safirnaction objectives to highlight the gaps and alignments.
  Project Scope: {{{projectScope}}}
  Safirnaction Objectives: {{{safirnactionObjectives}}}

  Provide the key trends, thematic analysis, sentiment analysis, and the comparative analysis in a structured format.
  Follow the output schema.
  `,
});

const analyzeSurveyDataFlow = ai.defineFlow(
  {
    name: 'analyzeSurveyDataFlow',
    inputSchema: AnalyzeSurveyDataInputSchema,
    outputSchema: AnalyzeSurveyDataOutputSchema,
  },
  async input => {
    const {output} = await analyzeSurveyDataPrompt(input);
    return output!;
  }
);
