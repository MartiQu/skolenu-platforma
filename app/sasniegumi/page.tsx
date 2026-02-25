'use client'

import Auth from '../components/Auth'
import { AppShell, LoadingScreen, SectionHeader } from '../components/dashboard/AppShell'
import { useStudentDashboard } from '../hooks/useStudentDashboard'

export default function SasniegumiPage() {
  const { user, summary, loading } = useStudentDashboard()

  if (loading) return <LoadingScreen />
  if (!user || !summary) return <Auth onSuccess={() => undefined} />

  return (
    <AppShell active="sasniegumi" title="Sasniegumi" subtitle="Tavs progress un motivācija">
      <SectionHeader title="Nozīmītes" />
      <section className="cards-grid">
        {summary.achievements.length === 0 ? <article className="card"><p className="muted">Vēl nav nozīmīšu.</p></article> : summary.achievements.map((badge) => (
          <article className="card" key={badge.id}>
            <p>{badge.icon} {badge.title}</p>
            <p className="muted">{badge.description}</p>
            <p className="muted">{badge.earnedAtLabel}</p>
          </article>
        ))}
      </section>
      <SectionHeader title="Nedēļas mērķis" />
      <article className="card">
        <p>{summary.weeklyGoal.completedSessions}/{summary.weeklyGoal.targetSessions} mācību sesijas</p>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${summary.weeklyGoal.completedSessions / summary.weeklyGoal.targetSessions * 100}%` }} /></div>
      </article>
    </AppShell>
  )
}
