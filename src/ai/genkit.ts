// AI Configuration for SMART Connect System
// Supports multiple AI providers: OpenAI, Google AI, Hugging Face, Ollama

interface AIProvider {
  name: string;
  endpoint: string;
  model: string;
  enabled: boolean;
}

interface AIConfig {
  providers: AIProvider[];
  defaultProvider: string;
  timeout: number;
}

export const aiConfig: AIConfig = {
  providers: [
    {
      name: 'openai',
      endpoint: 'https://api.openai.com/v1',
      model: 'gpt-3.5-turbo',
      enabled: !!process.env.OPENAI_API_KEY
    },
    {
      name: 'google',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta',
      model: 'gemini-1.5-flash',
      enabled: !!process.env.GOOGLE_API_KEY
    },
    {
      name: 'huggingface',
      endpoint: 'https://api-inference.huggingface.co/models',
      model: 'microsoft/DialoGPT-medium',
      enabled: !!process.env.HUGGINGFACE_API_KEY
    },
    {
      name: 'ollama',
      endpoint: 'http://localhost:11434/api',
      model: 'llama2:7b',
      enabled: true // Ollama runs locally
    }
  ],
  defaultProvider: 'ollama', // Default to free local provider
  timeout: 30000
};

export const getAvailableProviders = (): AIProvider[] => {
  return aiConfig.providers.filter(provider => provider.enabled);
};

export const getDefaultProvider = (): AIProvider | null => {
  const available = getAvailableProviders();
  const defaultProvider = available.find(p => p.name === aiConfig.defaultProvider);
  return defaultProvider || available[0] || null;
};