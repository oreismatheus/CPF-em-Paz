
import { GoogleGenAI, Type } from "@google/genai";
import { DailyLog, AIAnalysisReport, AnalysisPeriod } from "../types";

export const analyzeHabitsAndJournal = async (logs: DailyLog[], period: AnalysisPeriod): Promise<AIAnalysisReport | null> => {
  try {
    // Inicialização segura dentro da função
    const apiKey = process.env.API_KEY || "";
    if (!apiKey) {
      console.warn("API Key não encontrada.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Você é um analista de performance humana e espiritual. Analise os dados do usuário do período: ${period}.
      Dados: ${JSON.stringify(logs)}

      Forneça um relatório em PORTUGUÊS com os seguintes campos:
      1. Score (0 a 100) baseado na consistência dos hábitos e evolução do humor.
      2. Performance: Uma análise detalhada sobre como o usuário está indo. Considere os planos escritos no diário.
      3. Positivos: Lista de pontos onde o usuário brilhou.
      4. A melhorar: Lista de pontos de atenção.
      5. Alternativas: Sugestões práticas e alternativas para o usuário atingir seus objetivos.

      Seja direto, minimalista e motivador.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            performance: { type: Type.STRING },
            positives: { type: Type.ARRAY, items: { type: Type.STRING } },
            toImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
            alternatives: { type: Type.STRING },
          },
          required: ["score", "performance", "positives", "toImprove", "alternatives"],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) return null;
    return JSON.parse(text) as AIAnalysisReport;
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return null;
  }
};
