import type { User } from '@supabase/supabase-js'
import { BADGES, QUESTIONS, SUBJECTS, XP_PER_LEVEL, type Subject, type UserStats } from '../data'
import type { AchievementBadge, DashboardSummary, MealTransaction, NotificationItem, ScheduleLesson, SubjectProgress, UserProfile } from './types'

const TOPIC_MAP: Record<Subject, string> = {
  english: 'Laiki un lasītprasme',
  latvian: 'Teksta analīze',
  math: 'Algebra un funkcijas',
  social: 'Pilsoniskā līdzdalība',
}

function subjectProgressFromStats(stats: UserStats): SubjectProgress[] {
  return (Object.entries(SUBJECTS) as [Subject, typeof SUBJECTS[Subject]][]).map(([subject, meta]) => {
    const totalQuestions = QUESTIONS.filter((q) => q.subject === subject).length
    const correctAnswers = stats.subjectProgress[subject] ?? 0
    const progressPercent = Math.min(Math.round((correctAnswers / Math.max(totalQuestions, 1)) * 100), 100)
    const totalAttempts = Math.max(stats.totalAnswers / 4, 1)
    const accuracyPercent = Math.min(100, Math.round((correctAnswers / totalAttempts) * 100))

    return {
      subject,
      name: meta.name,
      icon: meta.icon,
      color: meta.color,
      totalQuestions,
      correctAnswers,
      progressPercent,
      accuracyPercent,
      lastActivityLabel: correctAnswers > 0 ? 'Pēdējoreiz: vakar' : 'Vēl nav aktivitātes',
      currentTopic: TOPIC_MAP[subject],
      difficulty: progressPercent > 70 ? 'Sarežģīti' : progressPercent > 35 ? 'Vidēji' : 'Viegli',
    }
  })
}

function profileFromUser(user: User): UserProfile {
  const username = String(user.user_metadata?.username || user.email?.split('@')[0] || 'skolens')
  const fullName = String(user.user_metadata?.full_name || username)
  return {
    id: user.id,
    fullName,
    username: `@${username}`,
    nickname: String(user.user_metadata?.nickname || username),
    className: String(user.user_metadata?.class_name || '11.B'), // TODO: backend field from school SIS
    school: String(user.user_metadata?.school || 'Rīgas Valsts ģimnāzija'), // TODO: fetch from profile_school table
    studentId: `${user.id.slice(0, 4)}•••${user.id.slice(-2)}`,
    email: user.email,
    phone: String(user.user_metadata?.phone || '+371 2X XXX XXX'),
    guardianContact: 'Vecāks: +371 2X XXX XXX', // TODO: connect guardian relationships
    statusBadges: ['Aktīvs', 'Top 10 klasē', 'Regulārs mācību režīms'],
  }
}

export function buildDashboardSummary(user: User, stats: UserStats): DashboardSummary {
  const subjects = subjectProgressFromStats(stats)
  const notices: NotificationItem[] = [
    { id: 'n1', title: 'Skolas paziņojums', message: 'Rīt sporta stundā nepieciešams sporta tērps.', timestampLabel: 'pirms 20 min', unread: true, type: 'school' },
    { id: 'n2', title: 'Platformas jaunums', message: 'Pievienoti jauni matemātikas uzdevumi.', timestampLabel: 'pirms 2 h', type: 'platform' },
    { id: 'n3', title: 'Termiņš', message: 'Latviešu valodas eseja līdz piektdienai 18:00.', timestampLabel: 'vakar', unread: true, type: 'deadline' },
  ]

  const schedule: ScheduleLesson[] = [
    { id: 'l1', subject: 'Matemātika', teacher: 'A. Ozoliņa', room: '213', startsAt: '08:30', endsAt: '09:10', isCurrent: true },
    { id: 'l2', subject: 'Angļu valoda', teacher: 'J. Kalniņš', room: '305', startsAt: '09:20', endsAt: '10:00', isNext: true },
    { id: 'l3', subject: 'Vēsture', teacher: 'L. Bērziņš', room: '112', startsAt: '10:20', endsAt: '11:00' },
  ]

  const mealTransactions: MealTransaction[] = [
    { id: 'm1', dateLabel: 'Šodien 12:11', description: 'Pusdienu komplekts', amountCents: -280, status: 'Apstiprināts' },
    { id: 'm2', dateLabel: 'Vakar 08:03', description: 'Talonu papildinājums', amountCents: 1000, voucherDelta: 5, status: 'Apstiprināts' },
    { id: 'm3', dateLabel: '01.03. 12:16', description: 'Pusdienu komplekts', voucherDelta: -1, status: 'Apstiprināts' },
  ]

  const achievements: AchievementBadge[] = BADGES
    .filter((b) => stats.badgesEarned.includes(b.id))
    .slice(0, 4)
    .map((badge) => ({
      id: badge.id,
      title: badge.name,
      description: badge.description,
      icon: badge.icon,
      earnedAtLabel: 'Nesen iegūta',
    }))

  const levelProgressPercent = Math.round(((stats.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100)

  return {
    profile: profileFromUser(user),
    stats,
    weeklyTrainingMinutes: 95,
    completedTasks: 18,
    classRank: 7,
    levelProgressPercent,
    subjects,
    recommendations: [...subjects].sort((a, b) => a.progressPercent - b.progressPercent).slice(0, 3),
    achievements,
    notifications: notices,
    schedule,
    schoolInfo: {
      advisorName: 'Ilze Siliņa',
      attendancePercent: 96,
      absences: 2,
      schoolNotices: notices.filter((n) => n.type === 'school').slice(0, 2),
      homeworkDeadlines: [
        { id: 'h1', title: 'Eseja par Raini', dueAt: 'Piektdien 18:00', subject: 'Latviešu valoda' },
        { id: 'h2', title: 'Algebras darba lapa', dueAt: 'Rīt 20:00', subject: 'Matemātika' },
      ],
    },
    mealAccount: {
      balanceCents: 420,
      voucherCount: 2,
      currency: 'EUR',
      todayStatus: 'Pieejams',
      lowBalance: true,
      weeklyPlan: [
        { day: 'Pr', meal: 'Zupa + pamatēdiens', active: true },
        { day: 'Ot', meal: 'Veģetārais komplekts', active: true },
        { day: 'Tr', meal: 'Pasta + salāti', active: false },
        { day: 'Ce', meal: 'Vistas wok', active: true },
        { day: 'Pk', meal: 'Plovs + kefīrs', active: true },
      ],
    },
    mealTransactions,
    weeklyGoal: {
      completedSessions: 3,
      targetSessions: 5,
    },
  }
}
