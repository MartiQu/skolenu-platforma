'use client'

import { useState, useEffect } from 'react'
import { SUBJECTS, BADGES, QUESTIONS, DEFAULT_STATS, getLevel, getXPProgress, XP_PER_LEVEL, type UserStats, type Subject } from '../lib/data'
import Quiz from './components/Quiz'
import Leaderboard from './components/Leaderboard'

type View = 'home' | 'quiz' | 'leaderboard' | 'profile'

export default function Home() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS)
  const [view, setView] = useState<View>('home')
  const [activeSubject, setActiveSubject] = useState<Subject>('english')
  const [xpPopup, setXpPopup] = useState<string | null>(null)
  const [newBadge, setNewBadge] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('skolenu-stats')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Update streak
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      if (parsed.lastPlayedDate === yesterday) {
        parsed.streak = (parsed.streak || 0) + 1
      } else if (parsed.lastPlayedDate !== today && parsed.lastPlayedDate !== '') {
        parsed.streak = 0
      }
      setStats(parsed)
    }
  }, [])

  function saveStats(newStats: UserStats) {
    const today = new Date().toDateString()
    const updated = { ...newStats, lastPlayedDate: today }
    localStorage.setItem('skolenu-stats', JSON.stringify(updated))
    setStats(updated)
  }

  function handleAnswer(correct: boolean, xp: number, subject: Subject) {
    setStats(prev => {
      const newXP = prev.xp + (correct ? xp : 0)
      const newCorrect = prev.correctAnswers + (correct ? 1 : 0)
      const newTotal = prev.totalAnswers + 1
      const newLevel = getLevel(newXP)
      const newSubjectProgress = {
        ...prev.subjectProgress,
        [subject]: prev.subjectProgress[subject] + (correct ? 1 : 0)
      }

      const newStats: UserStats = {
        ...prev,
        xp: newXP,
        level: newLevel,
        correctAnswers: newCorrect,
        totalAnswers: newTotal,
        subjectProgress: newSubjectProgress,
      }

      // Check badges
      const newBadges = BADGES.filter(b =>
        !prev.badgesEarned.includes(b.id) && b.condition(newStats)
      )
      if (newBadges.length > 0) {
        newStats.badgesEarned = [...prev.badgesEarned, ...newBadges.map(b => b.id)]
        setNewBadge(`${newBadges[0].icon} ${newBadges[0].name}`)
        setTimeout(() => setNewBadge(null), 3000)
      }

      if (correct) {
        setXpPopup(`+${xp} XP`)
        setTimeout(() => setXpPopup(null), 2000)
      }

      saveStats(newStats)
      return newStats
    })
  }

  const level = getLevel(stats.xp)
  const xpProgress = getXPProgress(stats.xp)
  const xpInLevel = stats.xp % XP_PER_LEVEL

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 100px' }}>
      {/* XP Popup */}
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}

      {/* Badge Popup */}
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

      {/* XP Bar */}
      <div className="progress-bar" style={{ marginBottom: 24 }}>
        <div className="progress-fill" style={{ width: `${xpProgress}%` }} />
      </div>

      {/* Navigation */}
      {view !== 'home' && view !== 'quiz' && (
        <button className="btn-secondary" onClick={() => setView('home')} style={{ marginBottom: 16 }}>
          ← Atpakaļ
        </button>
      )}

      {/* HOME VIEW */}
      {view === 'home' && (
        <>
          {/* Stats Row */}
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

          {/* Subjects */}
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

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <button className="btn-primary" onClick={() => setView('leaderboard')}>
              🏆 Ranglists
            </button>
            <button className="btn-secondary" onClick={() => setView('profile')}>
              👤 Profils
            </button>
          </div>
        </>
      )}

      {/* QUIZ VIEW */}
      {view === 'quiz' && (
        <Quiz
          subject={activeSubject}
          onAnswer={handleAnswer}
          onBack={() => setView('home')}
        />
      )}

      {/* LEADERBOARD VIEW */}
      {view === 'leaderboard' && (
        <Leaderboard myStats={stats} />
      )}

      {/* PROFILE VIEW */}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {BADGES.map(badge => {
              const earned = stats.badgesEarned.includes(badge.id)
              return (
                <div key={badge.id} className="card" style={{
                  opacity: earned ? 1 : 0.4,
                  padding: 14,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 28 }}>{badge.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4 }}>{badge.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{badge.description}</div>
                </div>
              )
            })}
          </div>

          <button
            className="btn-secondary"
            style={{ marginTop: 24 }}
            onClick={() => {
              if (confirm('Vai tiešām vēlies dzēst visus datus?')) {
                localStorage.removeItem('skolenu-stats')
                setStats(DEFAULT_STATS)
              }
            }}
          >
            🗑️ Atiestatīt progresu
          </button>
        </div>
      )}
    </div>
  )
}
