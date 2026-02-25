'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
  title: string
  subtitle?: string
  active: string
}

const NAV_ITEMS = [
  { key: 'sakums', href: '/', label: 'Sākums', icon: '🏠' },
  { key: 'macibas', href: '/macibas', label: 'Mācības', icon: '📘' },
  { key: 'prieksmeti', href: '/prieksmeti', label: 'Priekšmeti', icon: '🧩' },
  { key: 'grafiks', href: '/grafiks', label: 'Grafiks', icon: '🗓️' },
  { key: 'edinashana', href: '/edinashana', label: 'Ēdināšana', icon: '🍽️' },
  { key: 'sasniegumi', href: '/sasniegumi', label: 'Sasniegumi', icon: '🏅' },
  { key: 'profils', href: '/profils', label: 'Profils', icon: '👤' },
]

export function AppShell({ children, title, subtitle, active }: AppShellProps) {
  return (
    <div className="platform-shell">
      <header className="platform-topbar" role="banner">
        <div>
          <p className="platform-brand">⚔️ Zināšanu Cietoksnis</p>
          <h1>{title}</h1>
          {subtitle && <p className="platform-subtitle">{subtitle}</p>}
        </div>
        <div className="topbar-actions">
          <button className="icon-btn" aria-label="Meklēt">🔎</button>
          <button className="icon-btn" aria-label="Paziņojumi">🔔</button>
          <Link href="/profils" className="avatar-btn" aria-label="Atvērt profilu">👤</Link>
        </div>
      </header>

      <div className="platform-body">
        <nav className="platform-sidebar" aria-label="Galvenā navigācija">
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} href={item.href} className={`nav-link ${item.key === active ? 'active' : ''}`}>
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <main className="platform-main" role="main">{children}</main>
      </div>

      <nav className="platform-bottom-nav" aria-label="Mobilā navigācija">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <Link key={item.key} href={item.href} className={`nav-link ${item.key === active ? 'active' : ''}`}>
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function SectionHeader({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {actionLabel ? <button className="inline-action">{actionLabel}</button> : null}
    </div>
  )
}

export function LoadingScreen() {
  return <div className="loading-screen">Ielādē datus…</div>
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="card empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
