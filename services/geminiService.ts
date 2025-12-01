import { GoogleGenAI, Type } from "@google/genai";
import { ImageAspectRatio, ImageSize } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  // Fast text generation (Flash-Lite)
  generateFastText: async (prompt: string): Promise<string> => {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest', // Fast responses
        contents: prompt,
      });
      return response.text || '';
    } catch (error) {
      console.error("Gemini Fast Text Error:", error);
      throw error;
    }
  },

  // Complex text generation with Thinking Mode (Pro)
  generateComplexText: async (prompt: string, useThinking = false): Promise<string> => {
    const ai = getAI();
    try {
      const config: any = {};
      
      if (useThinking) {
        config.thinkingConfig = { thinkingBudget: 32768 }; // Max budget
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: config
      });
      return response.text || '';
    } catch (error) {
      console.error("Gemini Complex Text Error:", error);
      throw error;
    }
  },

  // Research using Grounding (Flash + Google Search)
  researchTopic: async (query: string): Promise<{ text: string; sources: any[] }> => {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: `Research the following topic and provide a summary suitable for a blog post: ${query}`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      const text = response.text || '';
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      return { text, sources };
    } catch (error) {
      console.error("Gemini Research Error:", error);
      throw error;
    }
  },

  // Image Generation (Pro Image Preview)
  generateBlogImage: async (
    prompt: string, 
    aspectRatio: ImageAspectRatio = "16:9", 
    size: ImageSize = "1K"
  ): Promise<string> => {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: size
          }
        }
      });

      // Extract image
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data found in response");
    } catch (error) {
      console.error("Gemini Image Gen Error:", error);
      throw error;
    }
  },

  // Analyze Image (Pro)
  analyzeImage: async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: prompt }
          ]
        }
      });
      return response.text || '';
    } catch (error) {
      console.error("Gemini Vision Error:", error);
      throw error;
    }
  },

  // Chatbot
  getChatResponse: async (history: {role: string, parts: {text: string}[]}[], newMessage: string) => {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "You are a helpful assistant for a blog platform named BlogGetWay. Help users write content, suggest ideas, and manage their blog."
      }
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || '';
  }
};