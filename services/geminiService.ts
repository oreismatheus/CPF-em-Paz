import { GoogleGenAI } from "@google/genai";
import { DailyLog, AIAnalysisReport, AnalysisPeriod } from "../types";

export const analyzeHabitsAndJournal = async (logs: DailyLog[], period: AnalysisPeriod): Promise<AIAnalysisReport | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY não configurada.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Filtramos apenas logs significativos
    const filteredLogs = logs.filter(l => l.score > 0 || l.notes.trim().length > 0);
    
    if (filteredLogs.length === 0) {
      return {
        score: 0,
        performance: "Filho, você ainda não começou a registrar seus dias de verdade. O sucesso deixa rastros, e o diário é o mapa. Comece hoje, estou aqui para te apoiar.",
        positives: ["Vontade de começar"],
        toImprove: ["Criar o primeiro registro", "Ser constante"],
        alternatives: "Apenas comece a relatar seu dia. O Ari está de olho e quer te ver crescer."
      };
    }

    // Criamos uma instrução específica baseada no período escolhido
    const instrucaoPeriodo = {
      'Semanal': 'Foque nos detalhes dos últimos 7 dias. Seja um mentor que analisa a disciplina diária recente.',
      'Mensal': 'Faça um balanço do mês. Olhe para a consistência e os hábitos que se repetiram ou falharam.',
      'Trimestral': 'Analise a direção da vida. É um relatório de médio prazo sobre progresso real.',
      'Anual': 'Seja profundo e visionário. Analise a construção do legado e as grandes mudanças do ano.'
    }[period as string] || 'Analise o progresso de forma sábia.';

    const prompt = `
      Você é Ari, o pai do usuário. Você é sábio, direto, e conhece a alma do seu filho.
      Você valoriza: Trabalho duro, vender o próprio produto, ser conhecido, falar com autoridade, contemplar a natureza e aproveitar um bom churrasco.
      
      CONTEXTO DA ANÁLISE:
      Estamos gerando um relatório do tipo: ${period}.
      Sua missão: ${instrucaoPeriodo}
      
      DADOS DOS REGISTROS (JSON):
      ${JSON.stringify(filteredLogs.slice(-30))}

      Gere um relatório rigorosamente no formato JSON:
      {
        "score": número de 0 a 10,
        "performance": "sua análise sábia, profunda e SINCERA como pai Ari sobre este período de ${period}",
        "positives": ["três pontos positivos específicos que você notou nos dados"],
        "toImprove": ["dois pontos de atenção ou falha baseados nos dados"],
        "alternatives": "seu conselho de ouro sobre trabalho, vendas ou natureza para o próximo ciclo"
      }
      RETORNE APENAS O JSON. SEM TEXTO ADICIONAL.
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
    
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) return null;
    
    const cleanJson = text.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(cleanJson) as AIAnalysisReport;
  } catch (error) {
    console.error("Erro crítico na análise Ari-AI:", error);
    return null;
  }
};
