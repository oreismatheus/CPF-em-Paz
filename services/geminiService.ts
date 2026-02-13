
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
    
    // Filtramos apenas logs que tenham alguma atividade ou anotação
    const filteredLogs = logs.filter(l => l.score > 0 || l.notes.trim().length > 0);
    
    const prompt = `
      Você é o pai do usuário, um homem sábio, experiente e que entende de psicologia humana. 
      Você quer que seu filho prospere em todas as áreas. Sua linguagem deve ser acolhedora, mas cheia de autoridade moral e sabedoria prática.
      
      Seus valores fundamentais que devem transparecer nos conselhos:
      1. Trabalho Duro e Vendas: "Venda seu produto", "Seja conhecido", "Trabalhe duro", "Fuja da preguiça".
      2. Apreciação da Vida: "Contemple a natureza", "Aproveite um bom churrasco", "Cuide de quem você ama".
      3. Equilíbrio: Saiba quando acelerar no trabalho e quando parar para ver o pôr do sol.

      Analise o progresso dele no período: ${period}.
      
      Histórico de Dados Recentes:
      ${JSON.stringify(filteredLogs.slice(-60))}

      Sua tarefa é gerar um relatório em JSON seguindo rigorosamente este esquema:
      {
        "score": número de 0 a 10 (ex: 8.2),
        "performance": "uma análise sábia e profunda dos dias dele, falando como um pai que observa os detalhes da alma e do esforço do filho",
        "positives": ["ponto positivo 1", "ponto positivo 2", "ponto positivo 3"],
        "toImprove": ["ponto de atenção 1", "ponto de atenção 2"],
        "alternatives": "o conselho de ouro do pai: algo sobre trabalho, natureza, vendas ou o prazer de viver bem"
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
