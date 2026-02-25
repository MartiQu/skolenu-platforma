export type FallingItem = {
  id: number
  lane: number
  y: number
  speed: number
  label: string
  isCorrect: boolean
}

export type GameSnapshot = {
  score: number
  lives: number
  streak: number
  levelProgress: number
  roundIndex: number
  totalRounds: number
  prompt: string
}

export type GameResultState = {
  score: number
  accuracy: number
  streak: number
  levelReached: number
}
