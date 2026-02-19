export type Subject = 'english' | 'latvian' | 'math' | 'social'

export interface Question {
  id: number
  subject: Subject
  question: string
  options: string[]
  correct: number
  xp: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: UserStats) => boolean
}

export interface UserStats {
  xp: number
  level: number
  streak: number
  correctAnswers: number
  totalAnswers: number
  badgesEarned: string[]
  subjectProgress: Record<Subject, number>
  lastPlayedDate: string
}

export const SUBJECTS = {
  english: { name: 'Angļu valoda', icon: '🇬🇧', color: '#3b82f6' },
  latvian: { name: 'Latviešu valoda', icon: '🇱🇻', color: '#ef4444' },
  math: { name: 'Matemātika', icon: '🔢', color: '#8b5cf6' },
  social: { name: 'Sociālās zinātnes', icon: '🌍', color: '#10b981' },
}

export const XP_PER_LEVEL = 500

export function getLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getXPProgress(xp: number): number {
  return (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100
}

export const BADGES: Badge[] = [
  {
    id: 'first_answer',
    name: 'Pirmais solis',
    description: 'Atbildi uz pirmo jautājumu',
    icon: '🌱',
    condition: (s) => s.totalAnswers >= 1,
  },
  {
    id: 'streak_3',
    name: 'Karstā sērija',
    description: '3 dienas pēc kārtas',
    icon: '🔥',
    condition: (s) => s.streak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Nedēļas varonis',
    description: '7 dienas pēc kārtas',
    icon: '⚡',
    condition: (s) => s.streak >= 7,
  },
  {
    id: 'level_5',
    name: 'Pieredzējis',
    description: 'Sasniedz 5. līmeni',
    icon: '⭐',
    condition: (s) => s.level >= 5,
  },
  {
    id: 'level_10',
    name: 'Eksperts',
    description: 'Sasniedz 10. līmeni',
    icon: '👑',
    condition: (s) => s.level >= 10,
  },
  {
    id: 'correct_50',
    name: 'Zināšanu kalns',
    description: '50 pareizas atbildes',
    icon: '🏔️',
    condition: (s) => s.correctAnswers >= 50,
  },
  {
    id: 'correct_100',
    name: 'Simtnieks',
    description: '100 pareizas atbildes',
    icon: '💯',
    condition: (s) => s.correctAnswers >= 100,
  },
  {
    id: 'all_subjects',
    name: 'Universāls',
    description: 'Spēlē visus 4 priekšmetus',
    icon: '🌈',
    condition: (s) => Object.values(s.subjectProgress).every(v => v > 0),
  },
]

export const QUESTIONS: Question[] = [
  // ANGĻU VALODA
  { id: 1, subject: 'english', difficulty: 'easy', xp: 10, question: 'Choose the correct form: "She ___ to school every day."', options: ['go', 'goes', 'going', 'gone'], correct: 1 },
  { id: 2, subject: 'english', difficulty: 'easy', xp: 10, question: 'What is the past tense of "run"?', options: ['runned', 'ran', 'ranned', 'runs'], correct: 1 },
  { id: 3, subject: 'english', difficulty: 'medium', xp: 20, question: 'Which sentence is grammatically correct?', options: ['I have went there.', 'I have gone there.', 'I has gone there.', 'I gone there.'], correct: 1 },
  { id: 4, subject: 'english', difficulty: 'medium', xp: 20, question: '"Despite the rain, they ___ the game." Choose the correct option.', options: ['finished', 'finish', 'finishing', 'have finish'], correct: 0 },
  { id: 5, subject: 'english', difficulty: 'hard', xp: 30, question: 'What does "ambiguous" mean?', options: ['Very clear', 'Open to more than one interpretation', 'Completely wrong', 'Highly emotional'], correct: 1 },
  { id: 6, subject: 'english', difficulty: 'hard', xp: 30, question: 'Identify the correct passive voice: "The letter ___ yesterday."', options: ['was written', 'is written', 'were written', 'written'], correct: 0 },

  // LATVIEŠU VALODA
  { id: 7, subject: 'latvian', difficulty: 'easy', xp: 10, question: 'Kurš no šiem vārdiem ir lietvārds?', options: ['skriet', 'skaists', 'galds', 'ātri'], correct: 2 },
  { id: 8, subject: 'latvian', difficulty: 'easy', xp: 10, question: 'Kādā dzimtē ir vārds "māja"?', options: ['Vīriešu', 'Sieviešu', 'Vidus', 'Tam nav dzimtes'], correct: 1 },
  { id: 9, subject: 'latvian', difficulty: 'medium', xp: 20, question: 'Kurš teikums ir pareizs?', options: ['Es eju uz skola.', 'Es eju uz skolu.', 'Es iet uz skolu.', 'Es eju uz skolas.'], correct: 1 },
  { id: 10, subject: 'latvian', difficulty: 'medium', xp: 20, question: 'Kas ir metafora?', options: ['Tiešs salīdzinājums ar "kā"', 'Netiešs salīdzinājums bez "kā"', 'Vārdu atkārtojums', 'Jautājums tekstā'], correct: 1 },
  { id: 11, subject: 'latvian', difficulty: 'hard', xp: 30, question: 'Kurš no šiem ir salikts teikums?', options: ['Saule spīd.', 'Bērns skrien ātri.', 'Lietus lija, un bērni palika mājās.', 'Skaistā diena.'], correct: 2 },
  { id: 12, subject: 'latvian', difficulty: 'hard', xp: 30, question: 'Ko nozīmē "aliterācija"?', options: ['Atskaņu izmantošana', 'Viena skaņas atkārtošana rindā', 'Pretējo jēdzienu salīdzināšana', 'Teikuma inversija'], correct: 1 },

  // MATEMĀTIKA
  { id: 13, subject: 'math', difficulty: 'easy', xp: 10, question: 'Cik ir 15% no 200?', options: ['25', '30', '20', '35'], correct: 1 },
  { id: 14, subject: 'math', difficulty: 'easy', xp: 10, question: 'Atrisini: 3x + 6 = 18', options: ['x = 2', 'x = 4', 'x = 6', 'x = 3'], correct: 1 },
  { id: 15, subject: 'math', difficulty: 'medium', xp: 20, question: 'Kāda ir riņķa laukuma formula?', options: ['2πr', 'πr²', 'πd', '2πr²'], correct: 1 },
  { id: 16, subject: 'math', difficulty: 'medium', xp: 20, question: 'Atrisini: x² - 9 = 0', options: ['x = 3', 'x = -3', 'x = ±3', 'x = 9'], correct: 2 },
  { id: 17, subject: 'math', difficulty: 'hard', xp: 30, question: 'Kas ir sin(30°)?', options: ['√3/2', '1/2', '√2/2', '1'], correct: 1 },
  { id: 18, subject: 'math', difficulty: 'hard', xp: 30, question: 'Logaritms: log₂(64) = ?', options: ['4', '5', '6', '8'], correct: 2 },

  // SOCIĀLĀS ZINĀTNES
  { id: 19, subject: 'social', difficulty: 'easy', xp: 10, question: 'Kurā gadā Latvija atjaunoja neatkarību?', options: ['1989', '1990', '1991', '1993'], correct: 2 },
  { id: 20, subject: 'social', difficulty: 'easy', xp: 10, question: 'Kas ir demokrātija?', options: ['Valdīšana ar armijas palīdzību', 'Tautas vara', 'Viena cilvēka vara', 'Reliģiska vadība'], correct: 1 },
  { id: 21, subject: 'social', difficulty: 'medium', xp: 20, question: 'Cik deputāti ir Latvijas Saeimā?', options: ['50', '75', '100', '120'], correct: 2 },
  { id: 22, subject: 'social', difficulty: 'medium', xp: 20, question: 'Ko pēta ekonomika?', options: ['Dabas parādības', 'Ražošanu, sadali un patēriņu', 'Cilvēku psiholoģiju', 'Vēsturiskus notikumus'], correct: 1 },
  { id: 23, subject: 'social', difficulty: 'hard', xp: 30, question: 'Kas ir inflācija?', options: ['Valūtas kursa pieaugums', 'Cenu vispārējs pieaugums', 'Bezdarba samazināšanās', 'Eksporta pieaugums'], correct: 1 },
  { id: 24, subject: 'social', difficulty: 'hard', xp: 30, question: 'Kurš ir ANO Drošības padomes pastāvīgais loceklis?', options: ['Vācija', 'Japāna', 'Francija', 'Austrālija'], correct: 2 },
]

export const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  badgesEarned: [],
  subjectProgress: { english: 0, latvian: 0, math: 0, social: 0 },
  lastPlayedDate: '',
}
