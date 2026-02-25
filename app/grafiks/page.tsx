'use client'

import { useState } from 'react'
import Auth from '../components/Auth'
import { AppShell, LoadingScreen, SectionHeader } from '../components/dashboard/AppShell'
import { useStudentDashboard } from '../hooks/useStudentDashboard'

export default function GrafiksPage() {
  const { user, summary, loading } = useStudentDashboard()
  const [mode, setMode] = useState<'today' | 'week'>('today')

  if (loading) return <LoadingScreen />
  if (!user || !summary) return <Auth onSuccess={() => undefined} />

  return (
    <AppShell active="grafiks" title="Grafiks" subtitle="Skati šodienas un nedēļas stundu plānu">
      <SectionHeader title="Stundu saraksts" />
      <div className="cards-grid two-col" style={{ marginBottom: 16 }}>
        <button className={mode === 'today' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('today')}>Šodiena</button>
        <button className={mode === 'week' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('week')}>Nedēļa</button>
      </div>
      <section className="card timeline">
        {summary.schedule.map((lesson) => (
          <article key={lesson.id} className={`timeline-item ${lesson.isCurrent ? 'current' : ''} ${lesson.isNext ? 'next' : ''}`}>
            <p><strong>{lesson.startsAt}–{lesson.endsAt}</strong> • {lesson.subject}</p>
            <p className="muted">{lesson.teacher} • Kabinets {lesson.room}</p>
          </article>
        ))}
      </section>
      {mode === 'week' && <p className="muted">Brīvdienās stundas netiek rādītas.</p>}
    </AppShell>
  )
}
