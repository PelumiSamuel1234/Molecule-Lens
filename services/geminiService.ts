
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { PubChemProperty, KeyProperties } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please ensure the process.env.API_KEY environment variable is configured.");
  // Potentially throw an error or use a fallback if crucial for app startup,
  // but for now, functions will fail gracefully if API_KEY is missing.
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
const TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

export async function generateQuickBio(moleculeName: string, properties: PubChemProperty | null): Promise<string> {
  if (!ai) return "Gemini API key not configured. Quick Bio unavailable.";
  if (!properties) return "Insufficient data for Quick Bio.";

  const synonyms = properties.Synonyms.slice(0, 3).join(', ');
  const prompt = `You are a science communicator.
Given the following data for ${moleculeName} (Molecular Formula: ${properties.MolecularFormula}, IUPAC Name/Synonyms: ${properties.IUPACName || synonyms}, Molecular Weight: ${properties.MolecularWeight} g/mol), write a concise 50-75 word 'Quick Bio' for a general audience.
Explain what it is and its most common uses or effects. Avoid overly technical jargon.
Example: Caffeine is a natural stimulant most commonly found in coffee and tea. It works by blocking adenosine receptors in the brain, leading to increased alertness and reduced fatigue. Many people use it to stay awake and improve focus.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating Quick Bio with Gemini:", error);
    return "Could not generate Quick Bio at this time.";
  }
}

export async function generateKeyProperties(moleculeName: string): Promise<KeyProperties | null> {
  if (!ai) {
    console.warn("Gemini API key not configured. Key Properties unavailable.");
    return null; 
  }

  const prompt = `For the molecule '${moleculeName}', provide its:
1. Common Classification (e.g., Alkaloid, Stimulant, Analgesic, Carbohydrate, Amino Acid, Neurotransmitter).
2. Where it is commonly Found In or Derived From (e.g., Coffee beans, Willow bark, Produced in the human body, Synthetic).
3. Its primary Biochemical Role or Mechanism of Action in simple terms (e.g., Blocks adenosine receptors, Inhibits prostaglandin synthesis, Building block for proteins, Transmits nerve signals).
Present each as a short phrase or sentence.
Output ONLY in JSON format: { "classification": "string", "foundIn": "string", "biochemicalRole": "string" }
Ensure the output is a single valid JSON object and nothing else.
Example for Caffeine:
{
  "classification": "Stimulant, Alkaloid",
  "foundIn": "Coffee beans, tea leaves, cocoa beans",
  "biochemicalRole": "Blocks adenosine receptors in the brain, reducing drowsiness and increasing alertness."
}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    let jsonStr = response.text.trim();
    // Remove markdown fences if present
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    return JSON.parse(jsonStr) as KeyProperties;
  } catch (error) {
    console.error("Error generating Key Properties with Gemini or parsing JSON:", error);
    return null;
  }
}
    