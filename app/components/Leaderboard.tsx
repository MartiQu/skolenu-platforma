'use client'

import { useState } from 'react'
import { getLevel, type UserStats } from '../../lib/data'

interface Props {
  myStats: UserStats
}

const FAKE_PLAYERS = [
  { name: 'Mārtiņš K.', xp: 4200, streak: 12 },
  { name: 'Anna B.', xp: 3800, streak: 8 },
  { name: 'Jānis L.', xp: 3100, streak: 15 },
  { name: 'Kristīne P.', xp: 2700, streak: 5 },
  { name: 'Roberts S.', xp: 2200, streak: 3 },
  { name: 'Laura M.', xp: 1900, streak: 7 },
  { name: 'Edgars T.', xp: 1500, streak: 2 },
  { name: 'Zane A.', xp: 1100, streak: 4 },
]

export default function Leaderboard({ myStats }: Props) {
  const allPlayers = [
    ...FAKE_PLAYERS,
    { name: '⭐ Tu', xp: myStats.xp, streak: myStats.streak }
  ].sort((a, b) => b.xp - a.xp)

  const myRank = allPlayers.findIndex(p => p.name === '⭐ Tu') + 1

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🏆 Ranglists</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
        Tavs rangs: #{myRank} no {allPlayers.length} spēlētājiem
      </p>

      {/* Top 3 podium */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24, alignItems: 'flex-end' }}>
        {[allPlayers[1], allPlayers[0], allPlayers[2]].map((player, i) => {
          const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3
          const heights = ['80px', '100px', '60px']
          const medals = ['🥈', '🥇', '🥉']
          const isMe = player?.name === '⭐ Tu'
          return (
            <div key={i} className="card" style={{
              textAlign: 'center',
              padding: '12px 8px',
              height: heights[i],
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderColor: isMe ? '#6366f1' : undefined,
              background: isMe ? 'rgba(99,102,241,0.15)' : undefined
            }}>
              <div style={{ fontSize: i === 1 ? 24 : 18 }}>{medals[i]}</div>
              <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>
                {player?.name}
              </div>
              <div style={{ fontSize: 10, color: '#f59e0b' }}>
                {player?.xp} XP
              </div>
            </div>
          )
        })}
      </div>

      {/* Full list */}
      <div style={{ display: 'grid', gap: 8 }}>
        {allPlayers.map((player, i) => {
          const isMe = player.name === '⭐ Tu'
          const rank = i + 1
          const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`
          return (
            <div key={i} className="card" style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              borderColor: isMe ? '#6366f1' : undefined,
              background: isMe ? 'rgba(99,102,241,0.15)' : undefined
            }}>
              <span style={{ fontSize: rank <= 3 ? 20 : 14, minWidth: 32, textAlign: 'center', fontWeight: 700 }}>
                {rankEmoji}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{player.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Līmenis {getLevel(player.xp)} • 🔥 {player.streak} dienas
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: '#f59e0b' }}>{player.xp}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>XP</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
