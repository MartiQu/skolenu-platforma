'use client'

import Link from 'next/link'
import { useMemo, useState, type KeyboardEvent } from 'react'
import { supabase } from '../../lib/supabase'

interface Props {
  onSuccess: () => void
}

type AuthMode = 'login' | 'register'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Auth({ onSuccess }: Props) {
  const currentYear = new Date().getFullYear()
  const [mode, setMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [touched, setTouched] = useState({ username: false, email: false, password: false })

  const emailError = touched.email && !email
    ? 'Lūdzu ievadi e-pastu.'
    : touched.email && !EMAIL_PATTERN.test(email)
      ? 'Ievadi korektu e-pasta adresi.'
      : ''

  const usernameError = mode === 'register' && touched.username && username.length < 3
    ? 'Lietotājvārdam jābūt vismaz 3 simboliem.'
    : ''

  const passwordError = touched.password && password.length < 6
    ? 'Parolei jābūt vismaz 6 simboliem.'
    : ''

  const canSubmit = useMemo(() => {
    if (loading) return false
    if (!email || !password) return false
    if (!EMAIL_PATTERN.test(email)) return false
    if (password.length < 6) return false
    if (mode === 'register' && username.length < 3) return false
    return true
  }, [email, loading, mode, password, username])

  function resetFeedback(nextMode: AuthMode) {
    setMode(nextMode)
    setError('')
    setMessage('')
    setTouched({ username: false, email: false, password: false })
  }

  async function handleRegister() {
    setTouched({ username: true, email: true, password: true })

    if (!username || username.length < 3) {
      setError('Lietotājvārdam jābūt vismaz 3 simboli!')
      return
    }
    if (!email || !password) {
      setError('Aizpildi visus laukus!')
      return
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError('Ievadi korektu e-pasta adresi!')
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
      setMode('login')
      setError('')
      setTouched({ username: false, email: false, password: false })
      setPassword('')
      setMessage('✅ Reģistrācija veiksmīga! Tagad vari pieslēgties.')
    }
    setLoading(false)
  }

  async function handleLogin() {
    setTouched({ username: true, email: true, password: true })

    if (!email || !password) {
      setError('Aizpildi visus laukus!')
      return
    }

    if (!EMAIL_PATTERN.test(email)) {
      setError('Ievadi korektu e-pasta adresi!')
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

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, nextMode: AuthMode) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      resetFeedback(nextMode)
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-bg-glow" aria-hidden="true" />
      <section className="auth-layout" aria-label="Autentifikācija">
        <aside className="auth-hero">
          <Link
            href="/"
            className="auth-brand-link"
            aria-label="Doties uz sākumlapu"
          >
            <span className="auth-brand-title">DVĢ Intranets</span>
            <span className="auth-brand-subtitle">DVĢ Hub</span>
          </Link>
          <span className="auth-kicker">Dobeles Valsts ģimnāzija</span>
          <h1>DVĢ Intranets — viss svarīgais vienuviet</h1>
          <p>
            Piekļūsti skolas aktualitātēm, mācību materiāliem, dokumentiem un
            iekšējai informācijai droši un ērti.
          </p>

          <div className="auth-badges" aria-hidden="true">
            <span className="badge badge-purple">📣 Aktualitātes un paziņojumi</span>
            <span className="badge badge-gold">📚 Mācību materiāli</span>
            <span className="badge badge-green">📁 Dokumenti un resursi</span>
            <span className="badge badge-cyan">🔒 Droša piekļuve</span>
          </div>

          <ul className="auth-benefits" aria-label="Platformas ieguvumi">
            <li><strong>Ātra piekļuve:</strong> svarīgākais vienuviet.</li>
            <li><strong>Drošība:</strong> dati tiek glabāti un apstrādāti atbildīgi.</li>
            <li><strong>Pārskatāmība:</strong> ērta pieeja informācijai skolēniem un darbiniekiem.</li>
            <li><strong>Saziņa:</strong> vienkārša piekļuve iekšējai komunikācijai.</li>
          </ul>
        </aside>

        <div className="auth-card card">
          <div className="auth-card-header">
            <h2>{mode === 'login' ? 'Sveicināts atpakaļ!' : 'Izveido kontu'}</h2>
            <p>{mode === 'login' ? 'Pieslēdzies, lai turpinātu darbu DVĢ Intranetā.' : 'Reģistrējies, lai piekļūtu DVĢ Intraneta videi.'}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Autentifikācijas režīms">
            <button
              role="tab"
              aria-selected={mode === 'login'}
              aria-controls="auth-form-panel"
              id="auth-tab-login"
              tabIndex={mode === 'login' ? 0 : -1}
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => resetFeedback('login')}
              onKeyDown={(event) => onTabKeyDown(event, 'login')}
              type="button"
            >
              Pieslēgties
            </button>
            <button
              role="tab"
              aria-selected={mode === 'register'}
              aria-controls="auth-form-panel"
              id="auth-tab-register"
              tabIndex={mode === 'register' ? 0 : -1}
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => resetFeedback('register')}
              onKeyDown={(event) => onTabKeyDown(event, 'register')}
              type="button"
            >
              Reģistrēties
            </button>
          </div>

          <form
            id="auth-form-panel"
            role="tabpanel"
            aria-labelledby={mode === 'login' ? 'auth-tab-login' : 'auth-tab-register'}
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault()
              if (mode === 'login') {
                handleLogin()
                return
              }
              handleRegister()
            }}
            noValidate
          >
            {message && (
              <p className="auth-alert auth-alert-success" role="status" aria-live="polite">{message}</p>
            )}

            {error && (
              <p className="auth-alert auth-alert-error" role="alert" aria-live="assertive">{error}</p>
            )}

            {mode === 'register' && (
              <div className="auth-field-wrap">
                <label htmlFor="username">Lietotājvārds</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Piemēram, Jana11"
                  value={username}
                  aria-invalid={Boolean(usernameError)}
                  aria-describedby={usernameError ? 'username-error' : undefined}
                  onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                  onChange={(event) => setUsername(event.target.value)}
                  className={usernameError ? 'has-error' : ''}
                />
                {usernameError && <span id="username-error" className="field-error">{usernameError}</span>}
              </div>
            )}

            <div className="auth-field-wrap">
              <label htmlFor="email">E-pasts</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="epasts@piemers.lv"
                value={email}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'email-error' : undefined}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                onChange={(event) => setEmail(event.target.value)}
                className={emailError ? 'has-error' : ''}
              />
              {emailError && <span id="email-error" className="field-error">{emailError}</span>}
            </div>

            <div className="auth-field-wrap">
              <label htmlFor="password">Parole</label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="Ievadi paroli"
                  value={password}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={mode === 'register' ? 'password-hint password-error' : passwordError ? 'password-error' : undefined}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  onChange={(event) => setPassword(event.target.value)}
                  className={passwordError ? 'has-error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Paslēpt paroli' : 'Parādīt paroli'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Paslēpt' : 'Rādīt'}
                </button>
              </div>
              {mode === 'register' && (
                <span id="password-hint" className="field-hint">Vismaz 6 simboli, vēlams ar ciparu drošībai.</span>
              )}
              {passwordError && <span id="password-error" className="field-error">{passwordError}</span>}
            </div>

            {mode === 'login' && (
              <div className="auth-secondary-row">
                {/* TODO: pieslēgt, kad būs gatavs paroles atjaunošanas ceļš */}
                <button type="button" className="link-button" disabled aria-disabled="true" title="Drīzumā pieejams">
                  Aizmirsi paroli? (drīzumā pieejams)
                </button>
              </div>
            )}

            <button
              className="btn-primary auth-submit"
              type="submit"
              disabled={!canSubmit}
              aria-busy={loading}
            >
              {loading ? 'Lūdzu, uzgaidi…' : mode === 'login' ? 'Turpināt' : 'Izveidot kontu'}
            </button>

            <p className="auth-footnote">Tavi dati un aktivitāšu informācija tiek glabāti droši.</p>
          </form>
        </div>
      </section>
      <footer className="auth-footer" role="contentinfo">
        <p>© {currentYear} Dobeles Valsts ģimnāzija. Visas tiesības aizsargātas.</p>
        <p className="auth-footer-meta">DVĢ Intranets v1.0</p>
      </footer>
    </main>
  )
}
