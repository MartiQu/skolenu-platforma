'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SUBJECTS, BADGES, QUESTIONS, getLevel, getXPProgress, XP_PER_LEVEL, type UserStats, type Subject } from '../lib/data'
import Quiz from './components/Quiz'
import Leaderboard from './components/Leaderboard'
import Auth from './components/Auth'
import type { User } from '@supabase/supabase-js'

type View = 'home' | 'quiz' | 'leaderboard' | 'profile'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [view, setView] = useState<View>('home')
  const [activeSubject, setActiveSubject] = useState<Subject>('english')
  const [xpPopup, setXpPopup] = useState<string | null>(null)
  const [newBadge, setNewBadge] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else { setStats(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId: string) {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      let streak = data.streak

      if (data.last_played_date === yesterday) {
        streak = streak + 1
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
        subjectProgress: data.subject_progress || { english: 0, latvian: 0, math: 0, social: 0 },
        lastPlayedDate: data.last_played_date,
      })
    }
    setLoading(false)
  }

  async function handleAnswer(correct: boolean, xp: number, subject: Subject) {
    if (!user || !stats) return

    const newXP = stats.xp + (correct ? xp : 0)
    const newCorrect = stats.correctAnswers + (correct ? 1 : 0)
    const newTotal = stats.totalAnswers + 1
    const newLevel = getLevel(newXP)
    const newSubjectProgress = {
      ...stats.subjectProgress,
      [subject]: stats.subjectProgress[subject] + (correct ? 1 : 0)
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

    const newBadges = BADGES.filter(b =>
      !stats.badgesEarned.includes(b.id) && b.condition(newStats)
    )
    if (newBadges.length > 0) {
      newStats.badgesEarned = [...stats.badgesEarned, ...newBadges.map(b => b.id)]
      setNewBadge(`${newBadges[0].icon} ${newBadges[0].name}`)
      setTimeout(() => setNewBadge(null), 3000)
    }

    if (correct) {
      setXpPopup(`+${xp} XP`)
      setTimeout(() => setXpPopup(null), 2000)
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
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setView('home')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48 }}>⚔️</div>
        <p style={{ color: 'var(--text-muted)' }}>Ielādē...</p>
      </div>
    )
  }

  if (!user || !stats) {
    return <Auth onSuccess={() => loadProfile(user?.id ?? '')} />
  }

  const level = getLevel(stats.xp)
  const xpProgress = getXPProgress(stats.xp)
  const xpInLevel = stats.xp % XP_PER_LEVEL

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 100px' }}>
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}
      {newBadge && (
        <div className="xp-popup" style={{ background: '#f59e0b', top: 70 }}>
          🏆 Jauna nozīmīte: {newBadge}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '24px 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>⚔️ Zināšanu Cietoksnis</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Līmenis {level} • {xpInLevel}/{XP_PER_LEVEL} XP</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22 }}>🔥 {stats.streak}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>dienu sērija</div>
        </div>
      </div>

      <div className="progress-bar" style={{ marginBottom: 24 }}>
        <div className="progress-fill" style={{ width: `${xpProgress}%` }} />
      </div>

      {view !== 'home' && view !== 'quiz' && (
        <button className="btn-secondary" onClick={() => setView('home')} style={{ marginBottom: 16 }}>
          ← Atpakaļ
        </button>
      )}

      {/* HOME */}
      {view === 'home' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>{level}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Līmenis</div>
            </div>
            <div className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>{stats.correctAnswers}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pareizas</div>
            </div>
            <div className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#6366f1' }}>{stats.badgesEarned.length}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nozīmītes</div>
            </div>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Izvēlies priekšmetu</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {(Object.entries(SUBJECTS) as [Subject, typeof SUBJECTS[Subject]][]).map(([key, subject]) => (
              <div
                key={key}
                className="card"
                style={{ cursor: 'pointer', textAlign: 'center' }}
                onClick={() => { setActiveSubject(key); setView('quiz') }}
              >
                <div className="subject-icon">{subject.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{subject.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {stats.subjectProgress[key]} pareizas
                </div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-fill" style={{
                    width: `${Math.min(stats.subjectProgress[key] / QUESTIONS.filter(q => q.subject === key).length * 100, 100)}%`,
                    background: subject.color
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <button className="btn-primary" onClick={() => setView('leaderboard')}>🏆 Ranglists</button>
            <button className="btn-secondary" onClick={() => setView('profile')}>👤 Profils</button>
          </div>
        </>
      )}

      {view === 'quiz' && (
        <Quiz subject={activeSubject} onAnswer={handleAnswer} onBack={() => setView('home')} />
      )}

      {view === 'leaderboard' && (
        <Leaderboard myStats={stats} />
      )}

      {view === 'profile' && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>👤 Mans profils</h2>

          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>Kopējais XP</span>
              <span style={{ fontWeight: 700, color: '#6366f1' }}>{stats.xp} XP</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>Pareizības %</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>
                {stats.totalAnswers > 0 ? Math.round(stats.correctAnswers / stats.totalAnswers * 100) : 0}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Atbildēti jautājumi</span>
              <span style={{ fontWeight: 700 }}>{stats.totalAnswers}</span>
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🏅 Nozīmītes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {BADGES.map(badge => {
              const earned = stats.badgesEarned.includes(badge.id)
              return (
                <div key={badge.id} className="card" style={{ opacity: earned ? 1 : 0.4, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 28 }}>{badge.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>{badge.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{badge.description}</div>
                </div>
              )
            })}
          </div>

          <button className="btn-secondary" onClick={handleLogout}>
            🚪 Izrakstīties
          </button>
        </div>
      )}
    </div>
  )
}
