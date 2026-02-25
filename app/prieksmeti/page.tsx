'use client'

import { useMemo, useState } from 'react'
import Auth from '../components/Auth'
import { AppShell, EmptyState, LoadingScreen, SectionHeader } from '../components/dashboard/AppShell'
import { SubjectCard } from '../components/dashboard/Widgets'
import { useStudentDashboard } from '../hooks/useStudentDashboard'

export default function PrieksmetiPage() {
  const { user, summary, loading } = useStudentDashboard()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'az' | 'progress' | 'weakest'>('az')

  const list = useMemo(() => {
    if (!summary) return []
    const filtered = summary.subjects.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    if (sortBy === 'progress') return filtered.sort((a, b) => b.progressPercent - a.progressPercent)
    if (sortBy === 'weakest') return filtered.sort((a, b) => a.accuracyPercent - b.accuracyPercent)
    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [query, sortBy, summary])

  if (loading) return <LoadingScreen />
  if (!user || !summary) return <Auth onSuccess={() => undefined} />

  return (
    <AppShell active="prieksmeti" title="Priekšmeti" subtitle="Meklē, filtrē un fokusējies uz svarīgāko">
      <SectionHeader title="Visi priekšmeti" />
      <section className="card filter-row">
        <input aria-label="Meklēt priekšmetu" placeholder="Meklēt priekšmetu" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select aria-label="Kārtošana" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'az' | 'progress' | 'weakest')}>
          <option value="az">A–Z</option>
          <option value="progress">Pēc progresa</option>
          <option value="weakest">Vājākie vispirms</option>
        </select>
      </section>
      {list.length === 0 ? <EmptyState title="Nav atrastu priekšmetu" description="Pamēģini citu meklēšanas frāzi vai noņem filtru." /> : (
        <section className="cards-grid">
          {list.map((subject) => <SubjectCard key={subject.subject} subject={subject} />)}
        </section>
      )}
    </AppShell>
  )
}
