
import { HabitDefinition } from './types';

export const HABITS: HabitDefinition[] = [
  { id: 'bibleReading', label: 'Leitura das Escrituras', icon: '📖' },
  { id: 'physicalExercise', label: 'Exercício Físico', icon: '🏃‍♂️' },
  { id: 'hardWork', label: 'Trabalho Árduo', icon: '💼' },
  { id: 'bookReading', label: 'Leitura de Livros', icon: '📚' },
  { id: 'sleepingWell', label: 'Dormir Bem', icon: '😴' },
  { id: 'hygiene', label: 'Estou Limpo', icon: '✨' },
  { id: 'drinkingWater', label: 'Beber Água (2L)', icon: '💧' },
  { id: 'journaling', label: 'Escrever no diário', icon: '📝' },
];

export const MOOD_LABELS = ['Terrível', 'Ruim', 'Neutro', 'Bom', 'Excelente'];
export const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😁'];
export const WEATHER_LABELS = ['Tempestade', 'Chuva', 'Nublado', 'Sol entre Nuvens', 'Ensolarado'];
export const WEATHER_ICONS = ['⛈️', '🌧️', '☁️', '⛅', '☀️'];

export const DAILY_CHALLENGES = [
  "Fazer um vídeo para a rede social.",
  "Falar com um estranho hoje.",
  "Prospectar um novo cliente.",
  "Prestar um serviço anônimo a alguém.",
  "Escrever um testemunho curto.",
  "Estudar um capítulo adicional das escrituras.",
  "Fazer 15 minutos de meditação profunda."
];

export const SCRIPTURES = [
  { text: "Pois eis que este é meu trabalho e minha glória: Levar a efeito a imortalidade e vida eterna do homem.", ref: "Moisés 1:39" },
  { text: "E agora, meus filhos, lembrai-vos, lembrai-vos de que é sobre a rocha de nosso Redentor, que é Cristo... que deveis construir vossos alicerces.", ref: "Helamã 5:12" },
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "Se algum de vós tem falta de sabedoria, peça-a a Deus.", ref: "Tiago 1:5" },
  { text: "Buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", ref: "Mateus 6:33" }
];
