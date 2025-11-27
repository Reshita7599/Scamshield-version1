import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RiskLevel, SecurityAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      enum: [RiskLevel.SAFE, RiskLevel.SUSPICIOUS, RiskLevel.MALICIOUS, RiskLevel.UNKNOWN],
    },
    score: {
      type: Type.INTEGER,
      description: "A safety score from 0 (very dangerous) to 100 (very safe)",
    },
    summary: {
      type: Type.STRING,
      description: "A brief summary of the findings.",
    },
    details: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific technical reasons for the verdict.",
    },
    recommendation: {
      type: Type.STRING,
      description: "Actionable advice for the user.",
    },
  },
  required: ["riskLevel", "score", "summary", "details", "recommendation"],
};

export const analyzeSecurityData = async (
  input: string,
  type: 'URL' | 'EMAIL' | 'TRANSACTION' | 'CODE'
): Promise<SecurityAnalysisResult> => {
  const modelId = "gemini-2.5-flash"; // Good balance of speed and reasoning
  
  let prompt = "";
  
  switch (type) {
    case 'URL':
      prompt = `Analyze this URL for cybersecurity threats (Phishing, Malware, XSS, etc.). URL: "${input}"`;
      break;
    case 'EMAIL':
      prompt = `Analyze this email content for SPAM, Phishing, or Social Engineering attacks. Content: "${input}"`;
      break;
    case 'TRANSACTION':
      prompt = `Analyze this financial transaction data for potential fraud or anomalies. Specifically evaluate the 'amount', 'location', and 'time' if provided. Look for high amounts, unusual locations (geo-velocity), rapid succession, or odd timing (e.g., late night). Data: "${input}"`;
      break;
    case 'CODE':
      prompt = `Analyze this code snippet for security vulnerabilities (SQL Injection, Buffer Overflow, Hardcoded secrets, etc.). Code: "${input}"`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert cybersecurity analyst. Be conservative and highlight potential risks. Output JSON only."
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SecurityAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      riskLevel: RiskLevel.UNKNOWN,
      score: 0,
      summary: "Analysis failed due to an error.",
      details: ["API connection failed or input was invalid."],
      recommendation: "Try again later."
    };
  }
};

export const checkPasswordStrength = async (password: string): Promise<SecurityAnalysisResult> => {
   // Specialized prompt for passwords
   try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the strength of this password: "${password}". Do not reveal the password in output.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a password cracking expert. Estimate entropy and guessability. Score 0 (weak) to 100 (strong)."
      },
    });
     const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as SecurityAnalysisResult;
   } catch (error) {
     return {
        riskLevel: RiskLevel.UNKNOWN,
        score: 0,
        summary: "Error checking password",
        details: [],
        recommendation: "Use a longer password."
     }
   }
}