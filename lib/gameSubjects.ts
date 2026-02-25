export type LearningRound = {
  prompt: string
  correctItems: string[]
  wrongItems: string[]
  targetCorrect: number
}

export type GameSubject = {
  id: string
  name: string
  description: string
  gameKey: string
  rounds: LearningRound[]
}

export const GAME_SUBJECTS: Record<string, GameSubject> = {
  entrepreneurship: {
    id: 'entrepreneurship',
    name: 'Uzņēmējdarbība',
    description: 'Atpazīsti biznesa jēdzienus un trenē reakciju.',
    gameKey: 'subject-sprint',
    rounds: [
      {
        prompt: 'Savāc tikai ieņēmumu avotus',
        correctItems: ['Pārdošana', 'Abonements', 'Licences', 'Reklāmas ienākumi'],
        wrongItems: ['Izdevumi', 'Parāds', 'Soda nauda', 'Nodokļu maksājums'],
        targetCorrect: 5,
      },
      {
        prompt: 'Savāc tikai klientu vērtības piedāvājumus',
        correctItems: ['Ātra piegāde', 'Kvalitāte', 'Personalizācija', 'Atbalsts 24/7'],
        wrongItems: ['Krājuma zudumi', 'Birokrātija', 'Dīkstāve', 'Defekts'],
        targetCorrect: 6,
      },
      {
        prompt: 'Savāc tikai ilgtspējīgas izaugsmes rādītājus',
        correctItems: ['Atkārtoti pirkumi', 'Peļņas marža', 'LTV', 'NPS'],
        wrongItems: ['Churn pieaugums', 'Sūdzību skaits', 'Atcelti pasūtījumi', 'Nolietojums'],
        targetCorrect: 7,
      },
    ],
  },
}

export const DEFAULT_GAME_SUBJECT = GAME_SUBJECTS.entrepreneurship
