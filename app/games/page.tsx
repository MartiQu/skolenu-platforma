'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'
import { supabase } from '../../lib/supabase'
import { DEFAULT_GAME_SUBJECT } from '../../lib/gameSubjects'
import { useGameResults } from '../hooks/useGameResults'
import type { GameResultState } from '../game/types'

const LearningSprintGame = dynamic(() => import('../components/games/LearningSprintGame'), { ssr: false })

export default function GamesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [started, setStarted] = useState(false)
  const [lastResult, setLastResult] = useState<GameResultState | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'demo'>('idle')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
  }, [])

  const { results, bestScore, saveResult, loading } = useGameResults(
    user,
    DEFAULT_GAME_SUBJECT.gameKey,
    DEFAULT_GAME_SUBJECT.id,
  )

  const latest = useMemo(() => results.slice(0, 5), [results])

  const handleFinish = async (result: GameResultState) => {
    setLastResult(result)
    if (!user) {
      setSaveState('demo')
      return
    }

    const ok = await saveResult({
      gameKey: DEFAULT_GAME_SUBJECT.gameKey,
      subjectKey: DEFAULT_GAME_SUBJECT.id,
      score: result.score,
      accuracy: result.accuracy,
      streak: result.streak,
      levelReached: result.levelReached,
    })
    setSaveState(ok ? 'saved' : 'idle')
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '20px 16px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>🎮 Spēles</h1>
          <p style={{ color: 'var(--text-muted)' }}>Duolingo tipa mini-spēles mācību progresam.</p>
        </div>
        <Link href="/" className="btn-secondary" style={{ textDecoration: 'none', width: 'auto' }}>← Uz sākumu</Link>
      </div>

      {!user && (
        <div className="card" style={{ marginBottom: 14, borderColor: 'rgba(245,158,11,0.45)' }}>
          Demo režīms: vari spēlēt bez ielogošanās, bet rezultāti netiks saglabāti.
        </div>
      )}

      {!started && (
        <div className="card" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 22, marginBottom: 6 }}>{DEFAULT_GAME_SUBJECT.name} Sprints</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 14 }}>{DEFAULT_GAME_SUBJECT.description}</p>
          <ul style={{ paddingLeft: 18, marginBottom: 14, color: 'var(--text-muted)' }}>
            <li>3 sirdis un kļūdu kontrole</li>
            <li>Raundi ar mācību uzdevumiem</li>
            <li>Punkti, streak un līmeņa progress</li>
          </ul>
          <button className="btn-primary" onClick={() => setStarted(true)}>Sākt spēli</button>
        </div>
      )}

      {started && (
        <LearningSprintGame
          subject={DEFAULT_GAME_SUBJECT}
          onFinish={handleFinish}
        />
      )}

      {(lastResult || results.length > 0) && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 18, marginBottom: 10 }}>📊 Rezultāti</h3>
          {lastResult && (
            <p style={{ marginBottom: 12 }}>
              Pēdējais: <strong>{lastResult.score}</strong> punkti · Precizitāte <strong>{lastResult.accuracy}%</strong> · Streak <strong>{lastResult.streak}</strong>
            </p>
          )}
          <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
            Labākais rezultāts: <strong style={{ color: '#10b981' }}>{Math.max(bestScore, lastResult?.score ?? 0)}</strong>
          </p>

          {saveState === 'saved' && <p style={{ color: '#10b981', marginBottom: 8 }}>Rezultāts saglabāts Supabase ✅</p>}
          {saveState === 'demo' && <p style={{ color: '#f59e0b', marginBottom: 8 }}>Demo režīms: rezultāts netika saglabāts.</p>}

          <h4 style={{ marginBottom: 8 }}>Pēdējie rezultāti</h4>
          {loading && <p style={{ color: 'var(--text-muted)' }}>Ielādē rezultātus...</p>}
          {!loading && latest.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Vēl nav saglabātu spēļu.</p>}
          <div style={{ display: 'grid', gap: 8 }}>
            {latest.map((entry) => (
              <div key={entry.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10 }}>
                <strong>{entry.score}p</strong> · {entry.accuracy}% precizitāte · streak {entry.streak} · līmenis {entry.level_reached}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
