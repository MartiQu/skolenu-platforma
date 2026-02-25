'use client'

import Auth from '../components/Auth'
import { AppShell, LoadingScreen, SectionHeader } from '../components/dashboard/AppShell'
import { TransactionList } from '../components/dashboard/Widgets'
import { useStudentDashboard } from '../hooks/useStudentDashboard'

export default function EdinashanaPage() {
  const { user, summary, loading } = useStudentDashboard()

  if (loading) return <LoadingScreen />
  if (!user || !summary) return <Auth onSuccess={() => undefined} />

  return (
    <AppShell active="edinashana" title="Ēdināšana" subtitle="Taloni, atlikums un darījumu vēsture">
      <SectionHeader title="Konta kopsavilkums" />
      <section className="cards-grid two-col">
        <article className="card">
          <h3>Pašreizējais atlikums</h3>
          <p className="stat-value">€{((summary.mealAccount.balanceCents || 0) / 100).toFixed(2)}</p>
          <p className="muted">Taloni: {summary.mealAccount.voucherCount}</p>
        </article>
        <article className="card">
          <h3>Šodienas statuss</h3>
          <p>{summary.mealAccount.todayStatus}</p>
          <button className="btn-secondary" style={{ marginTop: 12 }}>Papildināt (drīzumā)</button>
        </article>
      </section>

      <SectionHeader title="Nedēļas plāns" />
      <article className="card">
        {summary.mealAccount.weeklyPlan.map((day) => <p key={day.day} className="muted">{day.day}: {day.meal} {day.active ? '• aktīvs' : '• nav aktivizēts'}</p>)}
      </article>

      <SectionHeader title="Pēdējie darījumi" />
      <article className="card">
        <TransactionList items={summary.mealTransactions} />
      </article>
    </AppShell>
  )
}
