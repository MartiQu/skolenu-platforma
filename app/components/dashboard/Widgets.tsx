'use client'

import Link from 'next/link'
import type { DashboardSummary, MealTransaction, ScheduleLesson, SubjectProgress } from '../../../lib/dashboard/types'

export function StudentHeroCard({ summary }: { summary: DashboardSummary }) {
  return (
    <section className="card hero-card">
      <div>
        <p className="muted">Sveiks, {summary.profile.nickname}!</p>
        <h2>{summary.profile.fullName}</h2>
        <p className="muted">{summary.profile.username} • {summary.profile.className} • {summary.profile.school}</p>
        <p className="muted">Skolēna ID: {summary.profile.studentId}</p>
      </div>
      <div className="hero-progress">
        <p>Līmenis {summary.stats.level}</p>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${summary.levelProgressPercent}%` }} /></div>
        <p className="muted">{summary.stats.xp} XP • 🔥 {summary.stats.streak} dienu sērija</p>
        <div className="badge-row">
          {summary.profile.statusBadges.map((badge) => <span key={badge} className="badge badge-purple">{badge}</span>)}
        </div>
        <div className="hero-actions">
          <Link className="btn-primary" href="/macibas">Turpināt mācīties</Link>
          <Link className="btn-secondary" href="/profils">Atvērt profilu</Link>
        </div>
      </div>
    </section>
  )
}

export function QuickStats({ summary }: { summary: DashboardSummary }) {
  const items = [
    ['Līmenis', String(summary.stats.level)],
    ['XP', String(summary.stats.xp)],
    ['Pareizās atbildes', String(summary.stats.correctAnswers)],
    ['Trenēšanās laiks', `${summary.weeklyTrainingMinutes} min`],
    ['Pabeigtie uzdevumi', String(summary.completedTasks)],
    ['Klases rangs', summary.classRank ? `#${summary.classRank}` : '—'],
  ]

  return (
    <section className="stats-grid" aria-label="Ātrā statistika">
      {items.map(([label, value]) => (
        <article key={label} className="card stat-card">
          <p className="muted">{label}</p>
          <p className="stat-value">{value}</p>
        </article>
      ))}
    </section>
  )
}

export function SubjectCard({ subject }: { subject: SubjectProgress }) {
  return (
    <article className="card subject-card">
      <p>{subject.icon} {subject.name}</p>
      <p className="muted">{subject.currentTopic} • {subject.difficulty}</p>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${subject.progressPercent}%`, background: subject.color }} /></div>
      <p className="muted">Progresss: {subject.progressPercent}% • Precizitāte: {subject.accuracyPercent}%</p>
      <p className="muted">{subject.lastActivityLabel}</p>
      <Link href="/macibas" className="btn-secondary">Turpināt</Link>
    </article>
  )
}

export function SchedulePreview({ lessons }: { lessons: ScheduleLesson[] }) {
  const next = lessons.find((lesson) => lesson.isNext) || lessons[0]
  return (
    <article className="card">
      <h3>Nākamā stunda</h3>
      {next ? (
        <>
          <p>{next.subject} • {next.startsAt}-{next.endsAt}</p>
          <p className="muted">Skolotājs: {next.teacher} • Kabinets {next.room}</p>
        </>
      ) : <p className="muted">Šodien stundu nav.</p>}
    </article>
  )
}

export function MealVoucherCard({ summary }: { summary: DashboardSummary }) {
  const acc = summary.mealAccount
  return (
    <article className="card">
      <h3>Ēdināšanas talonu atlikums</h3>
      <p className="stat-value">€{((acc.balanceCents || 0) / 100).toFixed(2)} • {acc.voucherCount ?? 0} taloni</p>
      <p className="muted">Šodienas statuss: {acc.todayStatus}</p>
      {acc.lowBalance ? <p className="warning-text">⚠️ Zems atlikums. Ieteicams papildināt.</p> : null}
      <Link href="/edinashana" className="btn-secondary">Pārvaldīt talonus</Link>
    </article>
  )
}

export function TransactionList({ items }: { items: MealTransaction[] }) {
  return (
    <div className="transaction-list">
      {items.map((tx) => (
        <div key={tx.id} className="transaction-item">
          <div>
            <p>{tx.description}</p>
            <p className="muted">{tx.dateLabel}</p>
          </div>
          <p>{typeof tx.amountCents === 'number' ? `€${(tx.amountCents / 100).toFixed(2)}` : `${tx.voucherDelta} tal.`}</p>
        </div>
      ))}
    </div>
  )
}
