
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const todoTools: FunctionDeclaration[] = [
  {
    name: 'add_task',
    parameters: {
      type: Type.OBJECT,
      description: 'Create a new todo task.',
      properties: {
        title: { type: Type.STRING, description: 'The title of the task.' },
        description: { type: Type.STRING, description: 'Detailed description of the task.' },
        priority: { type: Type.STRING, description: 'Priority level: Low, Medium, or High.' },
        category: { type: Type.STRING, description: 'Category or tag for the task.' }
      },
      required: ['title']
    }
  },
  {
    name: 'list_tasks',
    parameters: {
      type: Type.OBJECT,
      description: 'Retrieve the current list of tasks.',
      properties: {
        status: { type: Type.STRING, description: 'Filter by status: Pending, Completed, or All.' }
      }
    }
  },
  {
    name: 'complete_task',
    parameters: {
      type: Type.OBJECT,
      description: 'Mark a specific task as completed.',
      properties: {
        task_id: { type: Type.STRING, description: 'The unique ID of the task to complete.' }
      },
      required: ['task_id']
    }
  },
  {
    name: 'delete_task',
    parameters: {
      type: Type.OBJECT,
      description: 'Delete a specific task.',
      properties: {
        task_id: { type: Type.STRING, description: 'The unique ID of the task to delete.' }
      },
      required: ['task_id']
    }
  }
];

export const getGeminiResponse = async (
  message: string, 
  history: { role: 'user' | 'model', parts: any[] }[] = []
) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Using gemini-3-flash-preview as per instructions for complex text/coding tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: h.parts })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: `You are the Panaversity AI Agent for the Hackathon II project. 
      Your goal is to help users manage their Todo tasks using the provided MCP-style tools. 
      Always confirm actions politely. If the user doesn't specify details like priority, 
      assume Medium. Keep your responses concise and helpful.`,
      tools: [{ functionDeclarations: todoTools }]
    }
  });

  return response;
};
