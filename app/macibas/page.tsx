'use client'

import { useState } from 'react'
import Auth from '../components/Auth'
import Quiz from '../components/Quiz'
import Leaderboard from '../components/Leaderboard'
import { AppShell, LoadingScreen, SectionHeader } from '../components/dashboard/AppShell'
import { SubjectCard } from '../components/dashboard/Widgets'
import { useStudentDashboard } from '../hooks/useStudentDashboard'
import type { Subject } from '../../lib/data'

export default function MacibasPage() {
  const { user, summary, loading, answerQuestion } = useStudentDashboard()
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  if (loading) return <LoadingScreen />
  if (!user || !summary) return <Auth onSuccess={() => undefined} />

  return (
    <AppShell active="macibas" title="Mācības" subtitle="Treniņi, uzdevumi un progress">
      {activeSubject ? (
        <Quiz subject={activeSubject} onAnswer={answerQuestion} onBack={() => setActiveSubject(null)} />
      ) : showLeaderboard ? (
        <Leaderboard myStats={summary.stats} />
      ) : (
        <>
          <SectionHeader title="Trenēšanās priekšmeti" />
          <div className="cards-grid">
            {summary.subjects.map((subject) => (
              <button key={subject.subject} className="button-reset" onClick={() => setActiveSubject(subject.subject)}>
                <SubjectCard subject={subject} />
              </button>
            ))}
          </div>
          <div className="cards-grid two-col">
            <button className="btn-primary" onClick={() => setShowLeaderboard(true)}>Atvērt ranglistu</button>
            <button className="btn-secondary" onClick={() => setShowLeaderboard(false)}>Aizvērt ranglistu</button>
          </div>
        </>
      )}
    </AppShell>
  )
}
