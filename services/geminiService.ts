
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ArtStyle, ElementStylePair } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper to convert file to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const identifyImageElements = async (imageFile: File): Promise<string[]> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: "Identify the main, distinct subjects or elements in this image. The subjects should be things that can be artistically stylized. Provide a list of 3-5 elements." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            elements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        },
      },
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.elements || [];
  } catch (error) {
    console.error("Error identifying image elements:", error);
    return ["Full Image"]; // Fallback
  }
};

export const generateArtPreview = async (imageFile: File, elementsToStyle: ElementStylePair[]): Promise<string | null> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    let prompt = "Using the provided image as a reference, create a new piece of art. The style should be luxurious, high-end, and suitable for a glowing art frame. ";
    prompt += "The background should be dark and atmospheric to emphasize the glow. ";

    if (elementsToStyle.length === 0 || elementsToStyle.some(e => e.element === 'Full Image')) {
        prompt += `Redraw the entire image in a glowing '${elementsToStyle[0]?.style || 'Colored Glow'}' style.`;
    } else {
        elementsToStyle.forEach(item => {
            let styleDescription = '';
            switch(item.style) {
                case 'Outline': styleDescription = 'a crisp, glowing outline'; break;
                case 'Pencil Sketch': styleDescription = 'a detailed, glowing pencil sketch style'; break;
                case 'Colored Glow': styleDescription = 'a vibrant, painterly colored glow'; break;
            }
            prompt += `The element '${item.element}' should be rendered in ${styleDescription}. `;
        });
        prompt += "Elements not mentioned should blend seamlessly into the dark background."
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    return null;

  } catch (error) {
    console.error("Error generating art preview:", error);
    return null;
  }
};
