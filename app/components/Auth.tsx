'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  onSuccess: () => void
}

export default function Auth({ onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleRegister() {
    if (!username || username.length < 3) {
      setError('Lietotājvārdam jābūt vismaz 3 simboli!')
      return
    }
    if (!email || !password) {
      setError('Aizpildi visus laukus!')
      return
    }
    if (password.length < 6) {
      setError('Parolei jābūt vismaz 6 simboli!')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('✅ Reģistrācija veiksmīga! Pierakstīties var uzreiz.')
      setMode('login')
    }
    setLoading(false)
  }

  async function handleLogin() {
    if (!email || !password) {
      setError('Aizpildi visus laukus!')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Nepareizs e-pasts vai parole!')
    } else {
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>⚔️</div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Zināšanu Cietoksnis</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Mācību platforma vidusskolēniem</p>
      </div>

      {/* Mode Toggle */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 4,
        background: 'var(--card)',
        padding: 4,
        borderRadius: 12,
        marginBottom: 24
      }}>
        <button
          onClick={() => { setMode('login'); setError(''); setMessage('') }}
          style={{
            padding: '10px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            background: mode === 'login' ? 'var(--primary)' : 'transparent',
            color: mode === 'login' ? 'white' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          Pierakstīties
        </button>
        <button
          onClick={() => { setMode('register'); setError(''); setMessage('') }}
          style={{
            padding: '10px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            background: mode === 'register' ? 'var(--primary)' : 'transparent',
            color: mode === 'register' ? 'white' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          Reģistrēties
        </button>
      </div>

      {/* Form */}
      <div className="card">
        {message && (
          <div style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid #10b981',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 16,
            color: '#10b981',
            fontSize: 14
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid #ef4444',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 16,
            color: '#ef4444',
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        {mode === 'register' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              Lietotājvārds
            </label>
            <input
              type="text"
              placeholder="piem. Jānis123"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                color: 'var(--text)',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
            E-pasts
          </label>
          <input
            type="email"
            placeholder="epasts@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              color: 'var(--text)',
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
            Parole
          </label>
          <input
            type="password"
            placeholder="Vismaz 6 simboli"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              color: 'var(--text)',
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          className="btn-primary"
          onClick={mode === 'login' ? handleLogin : handleRegister}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '⏳ Lūdzu uzgaidi...' : mode === 'login' ? '🚀 Pierakstīties' : '✨ Reģistrēties'}
        </button>
      </div>
    </div>
  )
}
