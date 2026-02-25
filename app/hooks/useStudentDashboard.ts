'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { BADGES, getLevel, type Subject, type UserStats } from '../../lib/data'
import { supabase } from '../../lib/supabase'
import { buildDashboardSummary } from '../../lib/dashboard/mockData'

const EMPTY_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  badgesEarned: [],
  subjectProgress: { english: 0, latvian: 0, math: 0, social: 0 },
  lastPlayedDate: '',
}

export function useStudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (!data) {
      setStats(EMPTY_STATS)
      setLoading(false)
      return
    }

    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    let streak = data.streak

    if (data.last_played_date === yesterday) {
      streak += 1
      await supabase.from('profiles').update({ streak }).eq('id', userId)
    } else if (data.last_played_date !== today && data.last_played_date !== '') {
      streak = 0
      await supabase.from('profiles').update({ streak: 0 }).eq('id', userId)
    }

    setStats({
      xp: data.xp,
      level: getLevel(data.xp),
      streak,
      correctAnswers: data.correct_answers,
      totalAnswers: data.total_answers,
      badgesEarned: data.badges_earned || [],
      subjectProgress: data.subject_progress || EMPTY_STATS.subjectProgress,
      lastPlayedDate: data.last_played_date,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else {
        setStats(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadProfile])

  const summary = useMemo(() => {
    if (!user || !stats) return null
    return buildDashboardSummary(user, stats)
  }, [user, stats])

  const answerQuestion = useCallback(async (correct: boolean, xp: number, subject: Subject) => {
    if (!user || !stats) return null

    const newXP = stats.xp + (correct ? xp : 0)
    const newCorrect = stats.correctAnswers + (correct ? 1 : 0)
    const newTotal = stats.totalAnswers + 1
    const newLevel = getLevel(newXP)
    const newSubjectProgress = {
      ...stats.subjectProgress,
      [subject]: stats.subjectProgress[subject] + (correct ? 1 : 0),
    }
    const today = new Date().toDateString()

    const newStats: UserStats = {
      ...stats,
      xp: newXP,
      level: newLevel,
      correctAnswers: newCorrect,
      totalAnswers: newTotal,
      subjectProgress: newSubjectProgress,
      lastPlayedDate: today,
    }

    const newBadges = BADGES.filter((b) => !stats.badgesEarned.includes(b.id) && b.condition(newStats))
    if (newBadges.length > 0) {
      newStats.badgesEarned = [...stats.badgesEarned, ...newBadges.map((b) => b.id)]
    }

    setStats(newStats)

    await supabase.from('profiles').update({
      xp: newXP,
      level: newLevel,
      correct_answers: newCorrect,
      total_answers: newTotal,
      subject_progress: newSubjectProgress,
      badges_earned: newStats.badgesEarned,
      last_played_date: today,
    }).eq('id', user.id)

    return { newBadges }
  }, [stats, user])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return { user, stats, summary, loading, answerQuestion, loadProfile, signOut }
}
