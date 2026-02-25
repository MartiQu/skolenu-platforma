'use client'

import Auth from './components/Auth'
import { AppShell, LoadingScreen, SectionHeader } from './components/dashboard/AppShell'
import { MealVoucherCard, QuickStats, SchedulePreview, StudentHeroCard, SubjectCard } from './components/dashboard/Widgets'
import { useStudentDashboard } from './hooks/useStudentDashboard'

export default function Home() {
  const { user, summary, loading } = useStudentDashboard()

  if (loading) return <LoadingScreen />
  if (!user || !summary) return <Auth onSuccess={() => undefined} />

  return (
    <AppShell active="sakums" title="Sākums" subtitle="Tavs mācību centrs vienuviet">
      <StudentHeroCard summary={summary} />
      <QuickStats summary={summary} />

      <SectionHeader title="Turpināt no pēdējās vietas" actionLabel="Skatīt visu" />
      <section className="cards-grid">
        {summary.recommendations.map((subject) => <SubjectCard key={subject.subject} subject={subject} />)}
      </section>

      <SectionHeader title="Skolas informācija" />
      <section className="cards-grid two-col">
        <SchedulePreview lessons={summary.schedule} />
        <article className="card">
          <h3>Skolas paziņojumi</h3>
          {summary.schoolInfo.schoolNotices.map((notice) => (
            <p key={notice.id} className="muted">• {notice.message}</p>
          ))}
          <p className="muted">Apmeklējums: {summary.schoolInfo.attendancePercent}% • Kavējumi: {summary.schoolInfo.absences}</p>
          <p className="muted">Audzinātājs: {summary.schoolInfo.advisorName}</p>
        </article>
      </section>

      <SectionHeader title="Ēdināšana" actionLabel="Skatīt ēdināšanas vēsturi" />
      <MealVoucherCard summary={summary} />

      <SectionHeader title="Priekšmeti" actionLabel="Atvērt priekšmetu lapu" />
      <section className="cards-grid">
        {summary.subjects.map((subject) => <SubjectCard key={subject.subject} subject={subject} />)}
      </section>

      <SectionHeader title="Sasniegumi un mērķi" />
      <section className="cards-grid two-col">
        <article className="card">
          <h3>Nedēļas mērķis</h3>
          <p className="muted">{summary.weeklyGoal.completedSessions}/{summary.weeklyGoal.targetSessions} mācību sesijas</p>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${summary.weeklyGoal.completedSessions / summary.weeklyGoal.targetSessions * 100}%` }} /></div>
        </article>
        <article className="card">
          <h3>Jaunākās nozīmītes</h3>
          {summary.achievements.length === 0 ? <p className="muted">Turpini trenēties, lai iegūtu pirmo nozīmīti.</p> : summary.achievements.map((badge) => <p key={badge.id}>{badge.icon} {badge.title}</p>)}
        </article>
      </section>

      <SectionHeader title="Paziņojumi" />
      <article className="card">
        {summary.notifications.map((notice) => (
          <div key={notice.id} className="notice-row">
            <p>{notice.title}: {notice.message}</p>
            <span className="muted">{notice.timestampLabel}</span>
          </div>
        ))}
      </article>
    </AppShell>
  )
}
