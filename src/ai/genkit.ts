import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openai} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    googleAI(),
    process.env.OPENAI_API_KEY ? openai({apiKey: process.env.OPENAI_API_KEY}) : undefined,
  ].filter(p => p),
  model: 'googleai/gemini-1.5-flash-latest',
});
