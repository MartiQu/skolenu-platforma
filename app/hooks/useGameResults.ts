'use client'

import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getGameResults, saveGameResult, type GameResult } from '../../lib/gameProgress'

type Payload = {
  gameKey: string
  subjectKey: string
  score: number
  accuracy: number
  streak: number
  levelReached: number
}

export function useGameResults(user: User | null, gameKey: string, subjectKey: string) {
  const [results, setResults] = useState<GameResult[]>([])
  const [loading, setLoading] = useState(false)

  const loadResults = useCallback(async () => {
    if (!user) {
      setResults([])
      return
    }

    setLoading(true)
    const { data } = await getGameResults(user.id, gameKey, subjectKey)
    setResults((data as GameResult[]) ?? [])
    setLoading(false)
  }, [gameKey, subjectKey, user])

  const saveResult = useCallback(async (payload: Payload) => {
    if (!user) return false

    const { error } = await saveGameResult({
      user_id: user.id,
      game_key: payload.gameKey,
      subject_key: payload.subjectKey,
      score: payload.score,
      accuracy: payload.accuracy,
      streak: payload.streak,
      level_reached: payload.levelReached,
    })

    if (error) return false
    await loadResults()
    return true
  }, [loadResults, user])

  useEffect(() => {
    loadResults()
  }, [loadResults])

  return {
    loading,
    results,
    bestScore: results[0]?.score ?? 0,
    loadResults,
    saveResult,
  }
}
