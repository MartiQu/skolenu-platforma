'use client'

import Auth from '../components/Auth'
import { AppShell, LoadingScreen, SectionHeader } from '../components/dashboard/AppShell'
import { useStudentDashboard } from '../hooks/useStudentDashboard'

export default function ProfilsPage() {
  const { user, summary, loading, signOut } = useStudentDashboard()

  if (loading) return <LoadingScreen />
  if (!user || !summary) return <Auth onSuccess={() => undefined} />

  return (
    <AppShell active="profils" title="Profils" subtitle="Personiskā informācija un iestatījumi">
      <SectionHeader title="Personiskā informācija" />
      <article className="card">
        <h3>{summary.profile.fullName}</h3>
        <p className="muted">{summary.profile.username} • {summary.profile.className}</p>
        <p className="muted">Skola: {summary.profile.school}</p>
        <p className="muted">E-pasts: {summary.profile.email}</p>
        <p className="muted">Tālrunis: {summary.profile.phone}</p>
        <p className="muted">Aizbildņa kontakts: {summary.profile.guardianContact}</p>
      </article>

      <SectionHeader title="Mācību un skolas dati" />
      <section className="cards-grid two-col">
        <article className="card">
          <h3>Statuss</h3>
          <p className="muted">Apmeklējums: {summary.schoolInfo.attendancePercent}%</p>
          <p className="muted">Kavējumi: {summary.schoolInfo.absences}</p>
          <p className="muted">Klases audzinātājs: {summary.schoolInfo.advisorName}</p>
        </article>
        <article className="card">
          <h3>Ēdināšana</h3>
          <p className="muted">Atlikums: €{((summary.mealAccount.balanceCents || 0) / 100).toFixed(2)}</p>
          <p className="muted">Taloni: {summary.mealAccount.voucherCount}</p>
        </article>
      </section>

      <SectionHeader title="Iestatījumi" />
      <article className="card settings-list">
        <label><input type="checkbox" defaultChecked /> Tumšais režīms</label>
        <label><input type="checkbox" defaultChecked /> Paziņojumi par mājasdarbiem</label>
        <label><input type="checkbox" /> Atgādinājumi vecākiem</label>
        <button className="btn-secondary" style={{ marginTop: 16 }}>Rediģēt profilu (drīzumā)</button>
      </article>

      <button className="btn-secondary" onClick={signOut}>Izrakstīties</button>
    </AppShell>
  )
}
