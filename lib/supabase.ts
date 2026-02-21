import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  xp: number
  level: number
  streak: number
  correct_answers: number
  total_answers: number
  badges_earned: string[]
  subject_progress: Record<string, number>
  last_played_date: string
}
