import { supabase } from './supabase'

export type GameResultInsert = {
  user_id: string
  game_key: string
  subject_key: string
  score: number
  accuracy: number
  streak: number
  level_reached: number
}

export type GameResult = GameResultInsert & {
  id: string
  completed_at: string
}

export async function saveGameResult(payload: GameResultInsert) {
  return supabase.from('game_results').insert(payload)
}

export async function getGameResults(userId: string, gameKey: string, subjectKey: string) {
  return supabase
    .from('game_results')
    .select('*')
    .eq('user_id', userId)
    .eq('game_key', gameKey)
    .eq('subject_key', subjectKey)
    .order('completed_at', { ascending: false })
    .limit(10)
}
