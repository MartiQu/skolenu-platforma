import type { Subject, UserStats } from '../data'

export interface UserProfile {
  id: string
  fullName: string
  username: string
  nickname?: string
  className?: string
  school?: string
  studentId?: string
  email?: string
  phone?: string
  guardianContact?: string
  statusBadges: string[]
}

export interface StudentSchoolInfo {
  advisorName: string
  attendancePercent: number
  absences: number
  schoolNotices: NotificationItem[]
  homeworkDeadlines: Array<{ id: string; title: string; dueAt: string; subject: string }>
}

export interface SubjectProgress {
  subject: Subject
  name: string
  icon: string
  color: string
  totalQuestions: number
  correctAnswers: number
  progressPercent: number
  accuracyPercent: number
  lastActivityLabel: string
  currentTopic: string
  difficulty: 'Viegli' | 'Vidēji' | 'Sarežģīti'
}

export interface AchievementBadge {
  id: string
  title: string
  description: string
  icon: string
  earnedAtLabel: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestampLabel: string
  unread?: boolean
  type: 'school' | 'platform' | 'deadline'
}

export interface ScheduleLesson {
  id: string
  subject: string
  teacher: string
  room: string
  startsAt: string
  endsAt: string
  isCurrent?: boolean
  isNext?: boolean
}

export interface MealVoucherAccount {
  balanceCents?: number
  voucherCount?: number
  currency: string
  todayStatus: 'Izmantots' | 'Pieejams' | 'Nav aktivizēts'
  lowBalance: boolean
  weeklyPlan: Array<{ day: string; meal: string; active: boolean }>
}

export interface MealTransaction {
  id: string
  dateLabel: string
  description: string
  amountCents?: number
  voucherDelta?: number
  status: 'Apstiprināts' | 'Gaida' | 'Noraidīts'
}

export interface DashboardSummary {
  profile: UserProfile
  stats: UserStats
  weeklyTrainingMinutes: number
  completedTasks: number
  classRank?: number
  levelProgressPercent: number
  subjects: SubjectProgress[]
  recommendations: SubjectProgress[]
  achievements: AchievementBadge[]
  notifications: NotificationItem[]
  schedule: ScheduleLesson[]
  schoolInfo: StudentSchoolInfo
  mealAccount: MealVoucherAccount
  mealTransactions: MealTransaction[]
  weeklyGoal: {
    completedSessions: number
    targetSessions: number
  }
}
