'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { GameSubject } from '../../../lib/gameSubjects'
import type { FallingItem, GameResultState, GameSnapshot } from '../../game/types'

type Props = {
  subject: GameSubject
  onFinish: (result: GameResultState) => void
}

const LANES = 3
const SPAWN_MS = 850
const ROUND_MS = 18000

export default function LearningSprintGame({ subject, onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const itemIdRef = useRef(1)
  const spawnElapsedRef = useRef(0)
  const roundElapsedRef = useRef(0)
  const totalCorrectRef = useRef(0)
  const totalPickedRef = useRef(0)
  const runningRef = useRef(false)
  const itemsRef = useRef<FallingItem[]>([])
  const laneRef = useRef(1)
  const stateRef = useRef({ score: 0, lives: 3, streak: 0, roundIndex: 0 })

  const [session, setSession] = useState(0)
  const [snapshot, setSnapshot] = useState<GameSnapshot>({
    score: 0,
    lives: 3,
    streak: 0,
    levelProgress: 0,
    roundIndex: 0,
    totalRounds: subject.rounds.length,
    prompt: subject.rounds[0].prompt,
  })

  const layout = useMemo(() => {
    const width = typeof window === 'undefined' ? 360 : Math.min(window.innerWidth - 32, 640)
    const height = Math.min(Math.max(window.innerHeight * 0.56, 360), 520)
    return { width, height }
  }, [])

  const finishGame = (finalRoundIndex: number) => {
    if (!runningRef.current) return
    runningRef.current = false
    const accuracy = totalPickedRef.current > 0 ? Math.round((totalCorrectRef.current / totalPickedRef.current) * 100) : 0
    onFinish({
      score: stateRef.current.score,
      accuracy,
      streak: stateRef.current.streak,
      levelReached: finalRoundIndex + 1,
    })
  }

  const resetGame = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    itemIdRef.current = 1
    spawnElapsedRef.current = 0
    roundElapsedRef.current = 0
    totalCorrectRef.current = 0
    totalPickedRef.current = 0
    stateRef.current = { score: 0, lives: 3, streak: 0, roundIndex: 0 }
    laneRef.current = 1
    itemsRef.current = []
    runningRef.current = true

    setSnapshot({
      score: 0,
      lives: 3,
      streak: 0,
      levelProgress: 0,
      roundIndex: 0,
      totalRounds: subject.rounds.length,
      prompt: subject.rounds[0].prompt,
    })
    setSession((prev) => prev + 1)
  }

  useEffect(() => {
    resetGame()
  }, [subject.id])

  useEffect(() => {
    if (!runningRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let last = performance.now()

    const draw = () => {
      ctx.clearRect(0, 0, layout.width, layout.height)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, layout.width, layout.height)

      for (let lane = 1; lane < LANES; lane += 1) {
        ctx.strokeStyle = 'rgba(148,163,184,0.35)'
        ctx.beginPath()
        ctx.moveTo((layout.width / LANES) * lane, 0)
        ctx.lineTo((layout.width / LANES) * lane, layout.height)
        ctx.stroke()
      }

      itemsRef.current.forEach((item) => {
        const laneX = (layout.width / LANES) * item.lane + layout.width / LANES / 2
        ctx.fillStyle = item.isCorrect ? '#10b981' : '#ef4444'
        ctx.fillRect(laneX - 54, item.y - 16, 108, 32)
        ctx.fillStyle = '#fff'
        ctx.font = '12px Inter'
        ctx.textAlign = 'center'
        ctx.fillText(item.label.slice(0, 16), laneX, item.y + 4)
      })

      const playerX = (layout.width / LANES) * laneRef.current + layout.width / LANES / 2
      ctx.fillStyle = '#6366f1'
      ctx.fillRect(playerX - 28, layout.height - 46, 56, 32)
    }

    const loop = (time: number) => {
      const delta = time - last
      last = time

      const state = stateRef.current
      const round = subject.rounds[state.roundIndex]

      spawnElapsedRef.current += delta
      roundElapsedRef.current += delta

      if (spawnElapsedRef.current >= SPAWN_MS) {
        spawnElapsedRef.current = 0
        const isCorrect = Math.random() > 0.45
        const list = isCorrect ? round.correctItems : round.wrongItems
        const label = list[Math.floor(Math.random() * list.length)]

        itemsRef.current.push({
          id: itemIdRef.current++,
          lane: Math.floor(Math.random() * LANES),
          y: -20,
          speed: 130 + Math.random() * 90,
          label,
          isCorrect,
        })
      }

      const playerY = layout.height - 46
      itemsRef.current = itemsRef.current
        .map((item) => ({ ...item, y: item.y + item.speed * (delta / 1000) }))
        .filter((item) => {
          const caught = item.lane === laneRef.current && item.y >= playerY - 18 && item.y <= playerY + 26
          if (caught) {
            totalPickedRef.current += 1
            if (item.isCorrect) {
              totalCorrectRef.current += 1
              state.score += 12 + Math.min(state.streak, 5)
              state.streak += 1
            } else {
              state.score = Math.max(0, state.score - 6)
              state.streak = 0
              state.lives -= 1
            }
          }
          return !caught && item.y < layout.height + 40
        })

      let roundProgress = Math.min(100, Math.floor((roundElapsedRef.current / ROUND_MS) * 100))
      if (roundElapsedRef.current >= ROUND_MS) {
        roundElapsedRef.current = 0
        if (state.roundIndex < subject.rounds.length - 1) {
          state.roundIndex += 1
          roundProgress = 0
        } else {
          finishGame(state.roundIndex)
        }
      }

      if (state.lives <= 0) {
        finishGame(state.roundIndex)
      }

      setSnapshot({
        score: state.score,
        lives: state.lives,
        streak: state.streak,
        levelProgress: roundProgress,
        roundIndex: state.roundIndex,
        totalRounds: subject.rounds.length,
        prompt: subject.rounds[state.roundIndex].prompt,
      })

      draw()

      if (runningRef.current) frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [layout.height, layout.width, onFinish, session, subject.rounds])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') laneRef.current = Math.max(0, laneRef.current - 1)
      if (event.key === 'ArrowRight') laneRef.current = Math.min(LANES - 1, laneRef.current + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
        <strong>🎯 {snapshot.prompt}</strong>
        <span>Raunds {snapshot.roundIndex + 1}/{snapshot.totalRounds} · ❤️ {snapshot.lives} · ⭐ {snapshot.score} · 🔥 {snapshot.streak}</span>
      </div>
      <div className="progress-bar" style={{ marginBottom: 12 }}>
        <div className="progress-fill" style={{ width: `${snapshot.levelProgress}%` }} />
      </div>

      <canvas
        ref={canvasRef}
        width={layout.width}
        height={layout.height}
        style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', touchAction: 'none' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        <button className="btn-secondary" onClick={() => { laneRef.current = Math.max(0, laneRef.current - 1) }}>⬅️ Kreisais</button>
        <button className="btn-secondary" onClick={() => { laneRef.current = Math.min(LANES - 1, laneRef.current + 1) }}>Labais ➡️</button>
      </div>

      <button className="btn-primary" style={{ marginTop: 10 }} onClick={resetGame}>🔁 Retry</button>
    </div>
  )
}
