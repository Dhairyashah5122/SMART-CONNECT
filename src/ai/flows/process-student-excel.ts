'use server';
/**
 * @fileOverview An AI agent for processing student data from an Excel file.
 *
 * - processStudentExcel - A function that handles the Excel data processing.
 * - ProcessStudentExcelInput - The input type for the processStudentExcel function.
 * - ProcessStudentExcelOutput - The return type for the processStudentExcel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentSchema = z.object({
  firstName: z.string().describe("The student's first name."),
  lastName: z.string().describe("The student's last name."),
  email: z.string().email().describe("The student's email address."),
});

const ProcessStudentExcelInputSchema = z.object({
  excelDataUri: z
    .string()
    .describe(
      "An Excel file (.xlsx) encoded as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,<encoded_data>'."
    ),
});
export type ProcessStudentExcelInput = z.infer<typeof ProcessStudentExcelInputSchema>;

const ProcessStudentExcelOutputSchema = z.object({
  students: z
    .array(StudentSchema)
    .describe('A list of student records extracted from the Excel file.'),
});
export type ProcessStudentExcelOutput = z.infer<
  typeof ProcessStudentExcelOutputSchema
>;

export async function processStudentExcel(
  input: ProcessStudentExcelInput
): Promise<ProcessStudentExcelOutput> {
  return processStudentExcelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processStudentExcelPrompt',
  input: {schema: ProcessStudentExcelInputSchema},
  output: {schema: ProcessStudentExcelOutputSchema},
  prompt: `You are an expert at parsing Excel files and extracting structured data.

  Analyze the following Excel file and extract the student records.
  The file should contain columns for First Name, Last Name, and Email.
  Return the data as an array of student objects.

  Excel File:
  {{media url=excelDataUri}}
`,
});

const processStudentExcelFlow = ai.defineFlow(
  {
    name: 'processStudentExcelFlow',
    inputSchema: ProcessStudentExcelInputSchema,
    outputSchema: ProcessStudentExcelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
