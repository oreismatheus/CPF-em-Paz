
import { GoogleGenAI, Type } from "@google/genai";
import { DailyLog, AIAnalysisReport, AnalysisPeriod } from "../types";

export const analyzeHabitsAndJournal = async (logs: DailyLog[], period: AnalysisPeriod): Promise<AIAnalysisReport | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY não configurada.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const filteredLogs = logs.filter(l => l.score > 0 || l.notes.trim().length > 0);
    
    const prompt = `
      Você é Ari, o pai do usuário. Um homem sábio, experiente, que já viveu muito e entende profundamente a psicologia humana e os negócios.
      Você ama seu filho e quer que ele seja um homem de valor, próspero e feliz.
      
      Sua voz deve ser a de um mentor experiente. Seus conselhos devem orbitar em torno de:
      - Trabalho duro e sem preguiça.
      - Vender seu produto e ser conhecido no mundo.
      - Falar com clareza e autoridade.
      - Aproveitar a vida, contemplar a natureza e curtir um bom churrasco.
      - Cuidar de si mesmo e de quem se ama.

      Analise o progresso dele no período: ${period}. Use uma linguagem acolhedora, mas firme e sábia.
      Não seja técnico. Seja o Ari, o pai dele.

      Histórico de Dados Recentes:
      ${JSON.stringify(filteredLogs.slice(-60))}

      Sua tarefa é gerar um relatório em JSON seguindo rigorosamente este esquema:
      {
        "score": número de 0 a 10 (ex: 7.8),
        "performance": "uma análise sábia dos seus dias, como um pai que vê além do óbvio, focando no esforço e na alma do filho",
        "positives": ["ponto de orgulho 1", "ponto de orgulho 2", "ponto de orgulho 3"],
        "toImprove": ["onde você está vacilando 1", "onde precisa de mais garra 2"],
        "alternatives": "o conselho do seu pai, Ari: uma diretriz sobre vendas, trabalho, natureza ou simplesmente aproveitar a vida"
      }

      Responda APENAS com o objeto JSON purificado.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as AIAnalysisReport;
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return null;
  }
};
