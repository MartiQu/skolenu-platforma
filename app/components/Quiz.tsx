'use client'

import { useState, useEffect } from 'react'
import { QUESTIONS, SUBJECTS, type Subject, type Question } from '../../lib/data'

interface Props {
  subject: Subject
  onAnswer: (correct: boolean, xp: number, subject: Subject) => void
  onBack: () => void
}

export default function Quiz({ subject, onAnswer, onBack }: Props) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)

  useEffect(() => {
    const subjectQs = QUESTIONS.filter(q => q.subject === subject)
    const shuffled = [...subjectQs].sort(() => Math.random() - 0.5).slice(0, 6)
    setQuestions(shuffled)
  }, [subject])

  function handleSelect(index: number) {
    if (answered) return
    setSelected(index)
    setAnswered(true)

    const correct = index === questions[current].correct
    const xp = questions[current].xp
    onAnswer(correct, xp, subject)

    if (correct) {
      setScore(s => s + 1)
      setEarnedXP(e => e + xp)
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  if (questions.length === 0) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Ielādē...</div>
  }

  const subjectInfo = SUBJECTS[subject]

  if (finished) {
    const percent = Math.round(score / questions.length * 100)
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '💪'}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Viktorīna pabeigta!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          {score} no {questions.length} pareizas atbildes
        </p>

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Rezultāts</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: percent >= 80 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#ef4444' }}>
              {percent}%
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Nopelnīts XP</span>
            <span style={{ fontWeight: 700, color: '#6366f1' }}>+{earnedXP} XP</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <button className="btn-primary" onClick={() => {
            setCurrent(0)
            setSelected(null)
            setAnswered(false)
            setScore(0)
            setEarnedXP(0)
            setFinished(false)
            const subjectQs = QUESTIONS.filter(q => q.subject === subject)
            setQuestions([...subjectQs].sort(() => Math.random() - 0.5).slice(0, 6))
          }}>
            🔄 Mēģināt vēlreiz
          </button>
          <button className="btn-secondary" onClick={onBack}>
            ← Uz sākumu
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const difficultyColor = q.difficulty === 'easy' ? '#10b981' : q.difficulty === 'medium' ? '#f59e0b' : '#ef4444'
  const difficultyLabel = q.difficulty === 'easy' ? 'Viegls' : q.difficulty === 'medium' ? 'Vidējs' : 'Grūts'

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', fontSize: 14
        }}>← Atpakaļ</button>
        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          {current + 1} / {questions.length}
        </span>
        <span style={{ fontSize: 13, color: difficultyColor, fontWeight: 600 }}>
          {difficultyLabel} • +{q.xp} XP
        </span>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 24 }}>
        <div className="progress-fill" style={{
          width: `${(current / questions.length) * 100}%`,
          background: subjectInfo.color
        }} />
      </div>

      {/* Subject badge */}
      <div style={{ marginBottom: 16 }}>
        <span className="badge badge-purple">
          {subjectInfo.icon} {subjectInfo.name}
        </span>
      </div>

      {/* Question */}
      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5 }}>{q.question}</p>
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
        {q.options.map((option, i) => {
          let className = 'answer-btn'
          if (answered) {
            if (i === q.correct) className += ' correct'
            else if (i === selected && i !== q.correct) className += ' incorrect'
          }
          return (
            <button
              key={i}
              className={className}
              onClick={() => handleSelect(i)}
              disabled={answered}
            >
              <span style={{ marginRight: 10, opacity: 0.5 }}>
                {['A', 'B', 'C', 'D'][i]}.
              </span>
              {option}
            </button>
          )
        })}
      </div>

      {/* Feedback + Next */}
      {answered && (
        <div>
          <div className="card" style={{
            marginBottom: 16,
            background: selected === q.correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            borderColor: selected === q.correct ? '#10b981' : '#ef4444'
          }}>
            <p style={{ fontWeight: 700, color: selected === q.correct ? '#10b981' : '#ef4444' }}>
              {selected === q.correct ? '✅ Pareizi!' : '❌ Nepareizi!'}
            </p>
            {selected !== q.correct && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Pareizā atbilde: {q.options[q.correct]}
              </p>
            )}
          </div>
          <button className="btn-primary" onClick={handleNext}>
            {current + 1 >= questions.length ? '🏁 Pabeigt' : 'Nākamais →'}
          </button>
        </div>
      )}
    </div>
  )
}
