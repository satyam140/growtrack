<<<<<<< HEAD
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, BookOpen, Compass, Gauge, ListChecks, Sparkles, Target, Zap } from 'lucide-react'
import { WithData } from '@student/components/common'
import {
  activeBacklogs, assignmentCompletion, attendanceBySubject, cgpa, COMPONENT_LABELS, roman, skillsScore, type Analysis,
} from '@student/lib/scoring'
import { subjectsOfSemester } from '@student/data/catalog'
import { useLocalFeedback } from '@student/hooks/useLocalFeedback'
import { usePageTitle } from '@student/hooks/usePageTitle'
import { countPendingFacultyEvaluations } from '@student/services/localFeedback'
import { facultyAvgRating } from '@student/lib/scoring'
import { cn } from '@student/lib/utils'
import { useStudent } from '@student/hooks/useStudent'
import type { Student } from '@student/types'

/**
 * Home: one calm page. Every number appears once, related things are grouped in one card, and colour is used softly
 * (tinted backgrounds; coral only for numbers that are genuinely at risk).
 */

const C = {
  navy: '#1E3A5F', indigo: '#4F46E5', muted: '#374151',
  good: { fg: '#0B6F66', bg: '#E6FAF7', solid: '#14B8A6' },
  warn: { fg: '#8A5A0B', bg: '#FEF5E7', solid: '#F59E0B' },
  risk: { fg: '#B42323', bg: '#FDECEC', solid: '#F06A6A' },
} as const
type Soft = keyof Pick<typeof C, 'good' | 'warn' | 'risk'>

const fmt1 = (n: number) => (Math.round(n * 10) / 10).toFixed(1)
const signed = (n: number, d = 1) => `${n > 0 ? '↑' : n < 0 ? '↓' : '→'} ${Math.abs(n).toFixed(d)}`
const scoreSoft = (n: number): Soft => (n >= 70 ? 'good' : n >= 50 ? 'warn' : 'risk')
const bandSoft = (n: number): Soft => (n >= 75 ? 'good' : n >= 50 ? 'warn' : 'risk')
const bandLabel = (n: number) => (n >= 75 ? 'On track' : n >= 50 ? 'Needs attention' : 'At risk')

const card = 'flex flex-col overflow-hidden rounded-2xl border border-[#CBD5E1] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.10)] [.dark_&]:border-border [.dark_&]:bg-card'
const body = 'flex flex-1 flex-col p-5'
const tile = 'rounded-xl border border-[#E2E8F0] bg-[#F5F8FC] p-4 [.dark_&]:border-border [.dark_&]:bg-muted/40'
const label = 'text-[13px] font-bold uppercase tracking-[0.08em] text-[#475569] [.dark_&]:text-muted-foreground'
const link = 'inline-flex items-center gap-1 text-[16px] font-semibold text-[#4F46E5] hover:underline [.dark_&]:text-indigo-300'
=======
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Activity as ActivityIcon, AlertTriangle, ArrowRight, Award, BellRing, Briefcase, CalendarCheck, CheckCircle2, ChevronDown, CircleAlert,
  ClipboardList, Code2, GraduationCap, Mic, PenLine, ShieldAlert, ShieldCheck, Sparkles, TrendingDown, TrendingUp, Zap,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@student/components/ui/card'
import { Badge } from '@student/components/ui/badge'
import { Button } from '@student/components/ui/button'
import { Progress } from '@student/components/ui/misc'
import { ImpactChart, PageHeader, WithData, tooltipStyle } from '@student/components/common'
import {
  activeBacklogs, assignmentCompletion, attendanceBySubject, cgpa, roman, skillsScore, WEIGHTS, type Analysis, type ActionItem, type RiskFlag, type Tone,
} from '@student/lib/scoring'
import { subjectsOfSemester } from '@student/data/catalog'
import { useLocalFeedback } from '@student/hooks/useLocalFeedback'
import { countPendingFacultyEvaluations } from '@student/services/localFeedback'
import { cn, fmtDate, levelTone, scoreTone, TONE } from '@student/lib/utils'
import { useStudent } from '@student/hooks/useStudent'
import type { Level, Student } from '@student/types'

/** One display rule for the Success Score everywhere on this page: one decimal place. */
const fmtScore = (n: number) => (Math.round(n * 10) / 10).toFixed(1)
const signed = (n: number, d = 1) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${Math.abs(n).toFixed(d)}`
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd

export default function Home() {
  return <WithData>{({ student, analysis }) => <HomeView s={student} a={analysis} />}</WithData>
}

function HomeView({ s, a }: { s: Student; a: Analysis }) {
  const { base } = useStudent()
  const to = (p: string) => base + p || '/'
  const first = s.name.split(' ')[0]
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
<<<<<<< HEAD
  usePageTitle(`${greet}, ${first}`)

  return (
    <div className="rounded-2xl bg-[#EAF0F7] p-4 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[16px] text-[#111827] sm:p-6 [.dark_&]:bg-transparent [.dark_&]:text-foreground">
      <header className="mb-6">
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#1E3A5F] [.dark_&]:text-foreground">{greet}, {first}</h1>
        <p className="mt-1 text-[16px] text-[#374151]">Semester {roman(s.semester)} · {s.branch}</p>
        <ActionStrip s={s} to={to} />
      </header>

      <PlanCard a={a} to={to} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_3fr]">
        <ScoreCard a={a} />
        <BreakdownCard a={a} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AcademicsCard s={s} a={a} to={to} />
        <CareerCard a={a} to={to} s={s} />
        <EngagementCard s={s} a={a} to={to} />
      </div>

      <SkillTests s={s} to={to} />
    </div>
  )
}


/* ------------------------------ Row 0: action strip ------------------------------ */

function ActionStrip({ s, to }: { s: Student; to: (p: string) => string }) {
  const feedback = useLocalFeedback(s.id)
  const evals = countPendingFacultyEvaluations(feedback.items, subjectsOfSemester(s.semester, s.branchCode).map((x) => x.code))
  const low = attendanceBySubject(s).filter((x) => x.percent < 75).length
  const pending = s.lms.assignments.pending
  const chips: { text: string; href?: string }[] = []
  if (low) chips.push({ text: `${low} ${low === 1 ? 'subject' : 'subjects'} below 75% attendance`, href: to('/attendance') })
  if (pending) chips.push({ text: `${pending} ${pending === 1 ? 'assignment' : 'assignments'} pending` })
  if (!feedback.loading && !feedback.error && evals) chips.push({ text: `${evals} faculty ${evals === 1 ? 'evaluation' : 'evaluations'}`, href: to('/feedback') })
  if (!chips.length) return null
  return (
    <div role="region" aria-label="Action required" className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-[#FEF5E7] px-4 py-2.5 [.dark_&]:bg-amber-500/10">
      <span className="mr-1 text-[15px] font-semibold uppercase tracking-wide text-[#B7791F]">Action required</span>
      {chips.map((c) => {
        const cls = 'rounded-full bg-white/80 px-3 py-1 text-[15px] font-medium text-[#6B4A0A] [.dark_&]:bg-card [.dark_&]:text-amber-300'
        return c.href ? <Link key={c.text} to={c.href} className={cn(cls, 'hover:bg-white')}>{c.text}</Link> : <span key={c.text} className={cls}>{c.text}</span>
      })}
=======

  return (
    <>
      <PageHeader title={`${greet}, ${first}`} description={`Semester ${roman(s.semester)} · ${s.branch} · Here is how you are doing and what to do next.`} />
      <AlertStrip s={s} to={to} />

      {/* 1. Overview: score + risks */}
      <section aria-label="Student success overview" className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-[1.15fr_1fr_1fr]">
        <ScoreCard a={a} />
        <RiskSummary title="Academic Risk" flag={a.academicRisk} icon={<GraduationCap className="h-5 w-5" />}
          link={{ label: 'View academic details', href: to('/results') }} />
        <RiskSummary title="Placement Risk" flag={a.placementRisk} icon={<Briefcase className="h-5 w-5" />}
          headline={{ value: fmtScore(a.readiness.score), suffix: '/100', label: 'Placement readiness' }}
          hide="Placement readiness"
          notes={{ Eligibility: a.eligibility.items.filter((i) => !i.ok).map((i) => `Needs ${i.label.toLowerCase()} (you have ${i.actual})`) }}
          link={{ label: 'View placement roadmap', href: to('/placement') }} />
      </section>

      {/* 2. Key metrics */}
      <KeyMetrics s={s} a={a} to={to} />

      {/* 3. AI Success Plan */}
      <SuccessPlan a={a} to={to} />

      {/* 4. Academic progress */}
      <div className="mb-6 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
        <AssignmentsCard s={s} />
        <RecentActivity s={s} to={to} />
      </div>

      {/* 5. Why this score */}
      <ScoreExplanation a={a} />

      {/* 6. History */}
      <ScoreHistory a={a} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Alerts: compact, actionable, only shown when something needs doing   */
/* ------------------------------------------------------------------ */
function AlertStrip({ s, to }: { s: Student; to: (p: string) => string }) {
  const feedback = useLocalFeedback(s.id)
  const pendingFacultyEvaluations = countPendingFacultyEvaluations(
    feedback.items,
    subjectsOfSemester(s.semester).map((subject) => subject.code),
  )
  const lowSubjects = attendanceBySubject(s).filter((x) => x.percent < 75)
  const pending = s.lms.assignments.pending
  const items: { icon: ReactNode; text: ReactNode; href: string; cta: string; tone: Tone }[] = []
  if (lowSubjects.length) items.push({ icon: <CalendarCheck className="h-4 w-4" />, tone: 'bad', href: to('/attendance'), cta: 'View attendance',
    text: <><b>{lowSubjects.length} {lowSubjects.length === 1 ? 'subject is' : 'subjects are'}</b> below 75% attendance ({lowSubjects.map((x) => x.short).join(', ')})</> })
  if (pending) items.push({ icon: <ClipboardList className="h-4 w-4" />, tone: 'warn', href: to(''), cta: '',
    text: <><b>{pending} assignment{pending > 1 ? 's' : ''}</b> pending on the LMS</> })
  if (!feedback.loading && !feedback.error && pendingFacultyEvaluations) items.push({ icon: <ClipboardList className="h-4 w-4" />, tone: 'warn', href: to('/feedback'), cta: 'Evaluate now',
    text: <><b>{pendingFacultyEvaluations} faculty evaluation{pendingFacultyEvaluations > 1 ? 's' : ''}</b> pending</> })
  if (!items.length) return null
  return (
    <div role="region" aria-label="Action required" className="mb-6 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-500/30 dark:bg-amber-500/10 md:flex-row md:items-center">
      <div className="flex shrink-0 items-center gap-2 px-1 text-sm font-semibold text-amber-800 dark:text-amber-300"><BellRing className="h-4 w-4" />Action required</div>
      <div className="flex flex-1 flex-wrap gap-2">
        {items.map((it, i) => {
          const body = (
            <>
              <span className={TONE[it.tone].text}>{it.icon}</span>
              <span>{it.text}</span>
              {it.cta && <span className="ml-1 inline-flex items-center gap-0.5 font-semibold text-primary">{it.cta}<ArrowRight className="h-3.5 w-3.5" /></span>}
            </>
          )
          const cls = 'inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm'
          return it.cta ? <Link key={i} to={it.href} className={cn(cls, 'transition hover:border-brand-400')}>{body}</Link> : <span key={i} className={cls}>{body}</span>
        })}
      </div>
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
    </div>
  )
}

<<<<<<< HEAD
/* ------------------------------ shared pieces ------------------------------ */

function CardHead({ icon, title, tint = 'indigo', right }: { icon: ReactNode; title: string; tint?: 'indigo' | 'teal' | 'amber' | 'violet'; right?: ReactNode }) {
  const chip = { indigo: 'bg-[#E0E7FF] text-[#3730A3]', teal: 'bg-[#CCFBF1] text-[#0F766E]', amber: 'bg-[#FEF3C7] text-[#92400E]', violet: 'bg-[#EDE9FE] text-[#5B21B6]' }[tint]
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5 [.dark_&]:border-border [.dark_&]:bg-muted/30">
      <h2 className="flex items-center gap-3 text-[18px] font-bold text-[#0F172A] [.dark_&]:text-foreground">
        <span className={cn('grid h-9 w-9 place-items-center rounded-lg [&_svg]:h-[19px] [&_svg]:w-[19px]', chip)}>{icon}</span>{title}
      </h2>
      {right}
    </div>
  )
}
const Bar = ({ value, tone, h = 'h-2.5' }: { value: number; tone: Soft; h?: string }) => (
  <div className={cn('rounded-full bg-[#DDE5EF] [.dark_&]:bg-muted', h)}><div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(3, value))}%`, background: C[tone].solid }} /></div>
)
const Footer = ({ to, children }: { to: string; children: ReactNode }) => (
  <div className="mt-auto flex justify-end border-t border-[#E2E8F0] pt-3.5 [.dark_&]:border-border"><Link to={to} className={link}>{children}<ArrowRight className="h-4 w-4" /></Link></div>
)
const Value = ({ children, unit }: { children: ReactNode; unit?: string }) => (
  <p className="mt-1 text-[36px] font-bold leading-none tabular-nums text-[#0F172A] [.dark_&]:text-foreground">{children}{unit && <span className="ml-1 text-[16px] font-semibold text-[#475569]">{unit}</span>}</p>
)

/* ------------------------------ plan (top) ------------------------------ */

const CTA: Record<string, string> = { '/results': 'View results', '/attendance': 'View attendance', '/placement': 'Start preparation', '/placement/aptitude': 'Start aptitude test',
  '/placement/interview': 'Start mock interview', '/skills': 'Take skill assessment', '/engagement': 'Add activity', '/feedback': 'Open feedback', '/': 'See assignments' }

function PlanCard({ a, to }: { a: Analysis; to: (p: string) => string }) {
  const focus = COMPONENT_LABELS[a.explain.topPulling.key as keyof typeof COMPONENT_LABELS] ?? a.explain.topPulling.label
  return (
    <section className={card} aria-label="Success plan">
      <CardHead icon={<Target />} title="Your success plan" tint="indigo" right={<p className="text-[15px] text-[#334155]">Focus area: <b className="font-bold text-[#0F172A] [.dark_&]:text-foreground">{focus}</b></p>} />
      <ol className="grid gap-4 p-5 md:grid-cols-3">
        {a.actions.map((x, i) => (
          <li key={x.key} className="flex flex-col rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#4F46E5] bg-white p-4 [.dark_&]:border-border [.dark_&]:border-l-[#818CF8] [.dark_&]:bg-transparent">
            <div className="flex items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#4F46E5] text-[14px] font-bold text-white">{i + 1}</span>
              <span className="rounded-full px-3 py-1 text-[14px] font-bold" style={{ background: C.good.bg, color: C.good.fg }}>+{x.potential} pts</span>
            </div>
            <h3 className="mt-3 text-[17px] font-bold leading-snug text-[#0F172A] [.dark_&]:text-foreground">{x.title}</h3>
            <p className="mt-1.5 flex-1 text-[15px] leading-6 text-[#334155] [.dark_&]:text-muted-foreground">{x.detail}</p>
            <div className="mt-4 flex justify-end"><Link to={to(x.href)} className={link}>{CTA[x.href] ?? 'Open'}<ArrowRight className="h-4 w-4" /></Link></div>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ------------------------------ score ------------------------------ */

function ScoreCard({ a }: { a: Analysis }) {
  const size = 188, stroke = 16, r = (size - stroke) / 2, circ = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, a.score))
  const tone = bandSoft(a.score)
  const prev = a.trend.length > 1 ? a.trend[a.trend.length - 2] : null
  const delta = prev ? Math.round((a.score - prev.score) * 10) / 10 : null
  return (
    <section className={card} aria-label="Success score">
      <CardHead icon={<Gauge />} title="Success score" tint="teal" />
      <div className={cn(body, 'items-center justify-center gap-4 text-center')}>
        <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Success score ${fmt1(a.score)} out of 100, ${bandLabel(a.score)}`}>
          <svg width={size} height={size} className="-rotate-90">
            <defs><linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={C[tone].solid} /><stop offset="100%" stopColor={C[tone].fg} /></linearGradient></defs>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.navy} strokeOpacity={0.1} strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ring)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div><div className="text-[46px] font-bold leading-none tabular-nums text-[#0F172A] [.dark_&]:text-foreground">{fmt1(a.score)}</div><div className="mt-1 text-[14px] text-[#475569]">out of 100</div></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full px-4 py-1.5 text-[15px] font-bold" style={{ background: C[tone].bg, color: C[tone].fg }}>{bandLabel(a.score)}</span>
          {delta !== null && prev && <span className="text-[15px] font-medium text-[#334155] [.dark_&]:text-muted-foreground">{signed(delta)} vs {prev.semester}</span>}
        </div>
        {a.trend.length > 1 && (
          <div className="h-[80px] w-full" role="img" aria-label={`Score history: ${a.trend.map((t) => `${t.semester} ${fmt1(t.score)}`).join(', ')}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={a.trend} margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
                <XAxis dataKey="semester" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} interval={0} tickFormatter={(v: string) => v.replace('Sem ', '')} />
                <YAxis hide domain={['dataMin - 3', 'dataMax + 3']} />
                <Tooltip formatter={(v) => [fmt1(Number(v ?? 0)), 'Score']} contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Line type="monotone" isAnimationActive={false} dataKey="score" stroke={C.navy} strokeWidth={2.5} dot={{ r: 3, fill: C.navy }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="text-[14px] text-[#475569]">On track 75+ · Needs attention 50–74 · At risk &lt;50</p>
      </div>
    </section>
  )
}

/* ------------------------------ breakdown ------------------------------ */

function BreakdownCard({ a }: { a: Analysis }) {
  const rows = [...a.explain.contributions].sort((x, y) => y.weight - x.weight)
  const { topHelping, topPulling } = a.explain
  const name = (key: string) => COMPONENT_LABELS[key as keyof typeof COMPONENT_LABELS] ?? key
  return (
    <section className={card} aria-label="Score breakdown">
      <CardHead icon={<ListChecks />} title="Score breakdown" tint="violet" />
      <div className={body}>
        <ul className="flex-1 space-y-4">
          {rows.map((c) => {
            const t = scoreSoft(c.score)
            return (
              <li key={c.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[16px] font-semibold text-[#0F172A] [.dark_&]:text-foreground">{name(c.key)} <span className="text-[14px] font-medium text-[#475569]">· {Math.round(c.weight * 100)}% weight</span></span>
                  <span className="text-[15px] font-bold tabular-nums" style={{ color: C[t].fg }}>+{(c.weight * c.score).toFixed(1)} pts</span>
                </div>
                <div className="mt-1.5" role="img" aria-label={`${name(c.key)} ${Math.round(c.score)} out of 100`}><Bar value={c.score} tone={t} h="h-3" /></div>
              </li>
            )
          })}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3 border-t border-[#E2E8F0] pt-4 text-[14px] font-semibold [.dark_&]:border-border">
          <span className="rounded-full px-3.5 py-1.5" style={{ background: C.good.bg, color: C.good.fg }}>Strongest: {name(topHelping.key)}</span>
          <span className="rounded-full px-3.5 py-1.5" style={{ background: C.risk.bg, color: C.risk.fg }}>Focus area: {name(topPulling.key)}</span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ grouped cards ------------------------------ */

function AcademicsCard({ s, a, to }: { s: Student; a: Analysis; to: (p: string) => string }) {
  const prev = s.semester > 1 ? cgpa(s, s.semester - 1) : null
  const d = prev !== null ? Math.round((a.cgpa - prev) * 100) / 100 : null
  const backlogs = activeBacklogs(s).length
  const low = attendanceBySubject(s).filter((x) => x.percent < 75)
  const pct = Math.round(assignmentCompletion(s))
  const { submitted, late, pending } = s.lms.assignments
  return (
    <section className={card} aria-label="Academics">
      <CardHead icon={<BookOpen />} title="Academics" tint="indigo" />
      <div className={cn(body, 'gap-3')}>
        <div className={tile}>
          <p className={label}>CGPA</p>
          <Value unit="/10">{a.cgpa.toFixed(2)}</Value>
          <p className="mt-1.5 text-[15px] text-[#334155] [.dark_&]:text-muted-foreground">{d !== null && <>{signed(d, 2)} vs Sem {roman(s.semester - 1)} · </>}{backlogs ? <b style={{ color: C.risk.fg }}>{backlogs} active {backlogs === 1 ? 'backlog' : 'backlogs'}</b> : 'No active backlogs'}</p>
        </div>
        <div className={tile}>
          <p className={label}>Attendance</p>
          <Value>{fmt1(a.attendance.percent)}%</Value>
          <p className="mt-1.5 text-[15px] text-[#334155] [.dark_&]:text-muted-foreground">{a.attendance.attended} of {a.attendance.total} lectures</p>
          {low.length > 0 && <p className="mt-1 text-[14px] font-semibold" style={{ color: C.risk.fg }}>Below 75%: {low.map((x) => `${x.short} ${Math.round(x.percent)}%`).join(', ')}</p>}
        </div>
        <div className={tile}>
          <div className="flex items-baseline justify-between"><p className={label}>Assignments</p><span className="text-[18px] font-bold tabular-nums text-[#0F172A] [.dark_&]:text-foreground">{pct}%</span></div>
          <div className="mt-2"><Bar value={pct} tone={scoreSoft(pct)} /></div>
          <p className="mt-2 text-[15px] text-[#334155] [.dark_&]:text-muted-foreground">{submitted - late} on time · {late} late · {pending} pending</p>
        </div>
        <Footer to={to('/results')}>View results</Footer>
      </div>
    </section>
  )
}

function CareerCard({ s, a, to }: { s: Student; a: Analysis; to: (p: string) => string }) {
  const failing = a.eligibility.items.filter((i) => !i.ok)
  const skills = Math.round(skillsScore(s))
  return (
    <section className={card} aria-label="Career readiness">
      <CardHead icon={<Compass />} title="Career readiness" tint="teal" />
      <div className={cn(body, 'gap-3')}>
        <div className={tile}>
          <p className={label}>Placement readiness</p>
          <Value unit="/100">{fmt1(a.readiness.score)}</Value>
          <p className="mt-1.5 text-[15px] text-[#334155] [.dark_&]:text-muted-foreground">
            {a.eligibility.eligible ? 'Eligible for placements' : <><b style={{ color: C.risk.fg }}>Not yet eligible</b>{failing.length > 0 && <> · Needs {failing.map((i) => i.label.toLowerCase()).join(' and ')}</>}</>}
          </p>
        </div>
        <div className={tile}>
          <p className={label}>Skills average</p>
          <Value unit="/100">{skills}</Value>
          <div className="mt-2"><Bar value={skills} tone={scoreSoft(skills)} /></div>
        </div>
        <Footer to={to('/placement')}>View roadmap</Footer>
      </div>
    </section>
  )
}

function EngagementCard({ s, a, to }: { s: Student; a: Analysis; to: (p: string) => string }) {
  const points = Math.min(100, a.points)
  const rating = facultyAvgRating(s)
  return (
    <section className={card} aria-label="Engagement">
      <CardHead icon={<Sparkles />} title="Engagement" tint="amber" />
      <div className={cn(body, 'gap-3')}>
        <div className={tile}>
          <p className={label}>Approved activity points</p>
          <Value unit="/100">{points}</Value>
          <div className="mt-2"><Bar value={points} tone={scoreSoft(points)} /></div>
        </div>
        <div className={tile}>
          <p className={label}>Faculty feedback</p>
          <Value unit="/5">{Number.isFinite(rating) ? rating.toFixed(1) : '–'}</Value>
        </div>
        <Footer to={to('/engagement')}>Add activity</Footer>
      </div>
    </section>
  )
}

/* ------------------------------ recent skill tests ------------------------------ */

function SkillTests({ s, to }: { s: Student; to: (p: string) => string }) {
  const latest = new Map<string, { skill: string; score: number; date: string }>()
  for (const t of s.skills.technicalTests) {
    const cur = latest.get(t.skill)
    if (!cur || t.date > cur.date) latest.set(t.skill, t)
  }
  const tests = [...latest.values()].sort((x, y) => y.date.localeCompare(x.date)).slice(0, 5)
  if (!tests.length) return null
  return (
    <section className={cn(card, 'mt-6')} aria-label="Recent skill tests">
      <CardHead icon={<Zap />} title="Recent skill tests" tint="violet" right={<Link to={to('/skills')} className={link}>All skills<ArrowRight className="h-4 w-4" /></Link>} />
      <ul className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-5">
        {tests.map((t) => (
          <li key={t.skill} className={tile}>
            <div className="flex items-baseline justify-between"><span className="text-[16px] font-bold text-[#0F172A] [.dark_&]:text-foreground">{t.skill}</span><span className="text-[16px] font-bold tabular-nums" style={{ color: C[scoreSoft(t.score)].fg }}>{Math.round(t.score)}%</span></div>
            <div className="mt-2.5"><Bar value={t.score} tone={scoreSoft(t.score)} /></div>
          </li>
        ))}
      </ul>
    </section>
=======
/* ------------------------------------------------------------------ */
/* Success Score                                                        */
/* ------------------------------------------------------------------ */
function ScoreCard({ a }: { a: Analysis }) {
  const reduce = useReducedMotion()
  const size = 176, stroke = 16, r = (size - stroke) / 2, c = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, a.score))
  const prev = a.trend.length > 1 ? a.trend[a.trend.length - 2] : null
  const delta = prev ? Math.round((a.score - prev.score) * 10) / 10 : null
  const color = TONE[a.band.tone].hex
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-6 text-white md:col-span-2 xl:col-span-1">
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-500/20 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">Student Success Score</p>
          <p className="mt-1 text-sm text-white/70">Weighted from 7 components</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: color }}>
          {a.band.tone === 'good' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}{a.band.label}
        </span>
      </div>
      <div className="relative mt-4 flex flex-col items-center gap-5 sm:flex-row">
        <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Success Score ${fmtScore(a.score)} out of 100, ${a.band.label}`}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
            {[50, 75].map((t) => {
              const ang = (t / 100) * 2 * Math.PI
              const x1 = size / 2 + (r - stroke / 2 - 2) * Math.cos(ang), y1 = size / 2 + (r - stroke / 2 - 2) * Math.sin(ang)
              const x2 = size / 2 + (r + stroke / 2 + 2) * Math.cos(ang), y2 = size / 2 + (r + stroke / 2 + 2) * Math.sin(ang)
              return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
            })}
            <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#scoreGrad)" strokeWidth={stroke} strokeLinecap="round"
              strokeDasharray={c} initial={{ strokeDashoffset: reduce ? c * (1 - pct / 100) : c }} animate={{ strokeDashoffset: c * (1 - pct / 100) }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
            <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--brand-400)" /><stop offset="100%" stopColor="var(--accent)" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div><div className="text-[44px] font-extrabold leading-none tabular-nums">{fmtScore(a.score)}</div><div className="mt-1 text-xs text-white/60">out of 100</div></div>
          </div>
        </div>
        <div className="w-full space-y-3 text-sm">
          {delta !== null && prev && (
            <div className="rounded-lg bg-white/10 px-3 py-2">
              <div className="flex items-center gap-1.5 font-semibold">
                {delta >= 0 ? <TrendingUp className="h-4 w-4 text-green-300" /> : <TrendingDown className="h-4 w-4 text-red-300" />}
                {signed(delta)} vs {prev.semester}
              </div>
              <div className="text-xs text-white/60">{prev.semester} estimate: {fmtScore(prev.score)}</div>
            </div>
          )}
          <div className="space-y-1 text-xs text-white/70">
            <div className="flex justify-between"><span>On Track</span><span className="tabular-nums">75 and above</span></div>
            <div className="flex justify-between"><span>Needs Attention</span><span className="tabular-nums">50 – 74.9</span></div>
            <div className="flex justify-between"><span>At Risk</span><span className="tabular-nums">below 50</span></div>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Risk summary: severity first, top triggers, one action               */
/* ------------------------------------------------------------------ */
function RiskSummary({ title, flag, icon, headline, hide, notes = {}, link }: {
  title: string; flag: RiskFlag; icon: ReactNode; headline?: { value: string; suffix: string; label: string }
  hide?: string; notes?: Record<string, string[]>; link: { label: string; href: string }
}) {
  const tone = levelTone(flag.level)
  const ordered = flag.indicators.filter((i) => i.label !== hide).sort((x, y) => rank(x.status) - rank(y.status))
  return (
    <Card className={cn('flex flex-col border-t-4 p-6', tone === 'good' ? 'border-t-success' : tone === 'warn' ? 'border-t-warning' : 'border-t-danger')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-100">{icon}</span>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <SeverityPill level={flag.level} />
      </div>

      {headline && (
        <div className="mt-4">
          <div className="text-xs text-muted-foreground">{headline.label}</div>
          <div className="text-[32px] font-bold leading-tight tabular-nums">{headline.value}<span className="text-base font-medium text-muted-foreground">{headline.suffix}</span></div>
        </div>
      )}

      <ul className="mt-4 flex-1 space-y-2.5">
        {ordered.map((i) => {
          const t: Tone = i.status === 'ok' ? 'good' : i.status
          return (
            <li key={i.label} className="text-sm">
              <div className="flex items-center gap-2.5">
                {i.status === 'ok' ? <CheckCircle2 className={cn('h-4 w-4 shrink-0', TONE.good.text)} /> : <AlertTriangle className={cn('h-4 w-4 shrink-0', TONE[t].text)} />}
                <span className="flex-1 text-muted-foreground">{i.label}</span>
                <span className={cn('font-semibold tabular-nums', i.status !== 'ok' && TONE[t].text)}>{i.value}</span>
              </div>
              {(notes[i.label] ?? []).map((n) => <p key={n} className="ml-[26px] mt-0.5 text-xs text-muted-foreground">{n}</p>)}
            </li>
          )
        })}
      </ul>
      <Link to={link.href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">{link.label}<ArrowRight className="h-4 w-4" /></Link>
    </Card>
  )
}
const rank = (st: string) => (st === 'bad' ? 0 : st === 'warn' ? 1 : 2)

function SeverityPill({ level }: { level: Level }) {
  const tone = levelTone(level)
  const Icon = level === 'Low' ? ShieldCheck : ShieldAlert
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', TONE[tone].bg, TONE[tone].text, TONE[tone].border)}>
      <Icon className="h-3.5 w-3.5" />{level} risk
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Key metrics (5)                                                      */
/* ------------------------------------------------------------------ */
function KeyMetrics({ s, a, to }: { s: Student; a: Analysis; to: (p: string) => string }) {
  const reduce = useReducedMotion()
  const prevAtt = s.semesterAttendance[s.semester - 1]
  const prevCgpa = s.semester > 1 ? cgpa(s, s.semester - 1) : null
  const skills = Math.round(skillsScore(s))
  const pts = Math.min(100, a.points)
  const metrics = [
    { label: 'CGPA', icon: <GraduationCap />, value: a.cgpa.toFixed(2), unit: '/10', tone: (a.cgpa >= 7.5 ? 'good' : a.cgpa >= 6.5 ? 'warn' : 'bad') as Tone,
      sub: activeBacklogs(s).length ? `${activeBacklogs(s).length} active backlog` : 'No active backlogs',
      delta: prevCgpa !== null ? { v: Math.round((a.cgpa - prevCgpa) * 100) / 100, d: 2, label: `vs end of Sem ${roman(s.semester - 1)}` } : null, href: '/results', cta: 'View results' },
    { label: 'Attendance', icon: <CalendarCheck />, value: `${a.attendance.percent}`, unit: '%', tone: (a.attendance.percent >= 80 ? 'good' : a.attendance.percent >= 75 ? 'warn' : 'bad') as Tone,
      sub: `${a.attendance.attended}/${a.attendance.total} lectures`,
      delta: prevAtt !== undefined ? { v: Math.round((a.attendance.percent - prevAtt) * 10) / 10, d: 1, label: `pts vs Sem ${roman(s.semester - 1)}` } : null, href: '/attendance', cta: 'View attendance' },
    { label: 'Engagement', icon: <Award />, value: `${pts}`, unit: '/100', tone: scoreTone(pts * 1.2), sub: 'approved activity points', delta: null, href: '/engagement', cta: 'View engagement' },
    { label: 'Skills average', icon: <Zap />, value: `${skills}`, unit: '/100', tone: scoreTone(skills), sub: 'technical + soft skills', delta: null, href: '/skills', cta: 'View skills' },
    { label: 'Placement readiness', icon: <Briefcase />, value: fmtScore(a.readiness.score), unit: '/100', tone: scoreTone(a.readiness.score),
      sub: a.eligibility.eligible ? 'Eligible for placements' : 'Not yet eligible', delta: null, href: '/placement', cta: 'View placement' },
  ]
  return (
    <section aria-labelledby="km" className="mb-6">
      <h2 id="km" className="mb-3 text-lg font-semibold">Key metrics</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
            <Link to={to(m.href)} className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{m.label}</span>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-100 [&_svg]:h-4 [&_svg]:w-4">{m.icon}</span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={cn('text-[30px] font-bold leading-none tabular-nums', TONE[m.tone].text)}>{m.value}</span>
                <span className="text-sm text-muted-foreground">{m.unit}</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{m.sub}</div>
              {m.delta && (
                <div className={cn('mt-1 inline-flex items-center gap-1 text-xs font-medium', m.delta.v >= 0 ? TONE.good.text : TONE.bad.text)}>
                  {m.delta.v >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}{signed(m.delta.v, m.delta.d)} {m.delta.label}
                </div>
              )}
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary">{m.cta}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* AI Success Plan (merges segment + top actions + insights)            */
/* ------------------------------------------------------------------ */
function priorityOf(x: ActionItem, a: Analysis): Level {
  if (x.key === 'academic' || x.key === 'attendance') return a.academicRisk.level === 'Low' ? (x.potential >= 1.5 ? 'Medium' : 'Low') : a.academicRisk.level
  if (x.key === 'placement' || x.key === 'skills') return a.placementRisk.level === 'Low' ? (x.potential >= 1.5 ? 'Medium' : 'Low') : a.placementRisk.level
  return x.potential >= 2 ? 'High' : x.potential >= 1 ? 'Medium' : 'Low'
}
const CTA: Record<string, string> = { '/results': 'View results', '/attendance': 'View attendance', '/placement': 'Start preparation', '/placement/aptitude': 'Start aptitude test',
  '/placement/interview': 'Start mock interview', '/skills': 'Take skill assessment', '/engagement': 'Add activity', '/feedback': 'Open feedback', '/': 'See assignments' }

function SuccessPlan({ a, to }: { a: Analysis; to: (p: string) => string }) {
  const reduce = useReducedMotion()
  const { topHelping, topPulling } = a.explain
  const plan = a.actions.map((x) => ({ ...x, priority: priorityOf(x, a) }))
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="border-b border-border bg-gradient-to-r from-brand-50 to-transparent p-6 dark:from-brand-800/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><Sparkles className="h-5 w-5 text-primary" />Your AI Success Plan</h2>
          <span className="inline-flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Your profile</span>
            <Badge tone={a.segment.tone} className="px-3 py-1 text-sm">{a.segment.name}</Badge>
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed">
          {a.segment.description} Your strongest area is <b className={TONE.good.text}>{topHelping.label}</b>, and the biggest opportunity is <b className={TONE.bad.text}>{topPulling.label}</b>.
          {' '}The three steps below are ranked by how much they can raise your score.
        </p>
      </div>
      <CardContent className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
        {plan.map((x, i) => {
          const t = levelTone(x.priority)
          return (
            <motion.div key={x.key} initial={reduce ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }}
              className={cn('flex flex-col rounded-xl border border-border p-5', i === 0 && 'border-primary/40 bg-primary/[0.03]')}>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold tabular-nums text-primary/80">{String(i + 1).padStart(2, '0')}</span>
                <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-semibold', TONE[t].bg, TONE[t].text, TONE[t].border)}>{x.priority} priority</span>
              </div>
              <h3 className="mt-3 font-semibold leading-snug">{x.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{x.detail}</p>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Could add up to <b className="text-foreground">+{x.potential}</b> pts</span>
                <Link to={to(x.href)} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">{CTA[x.href] ?? 'Open'}<ArrowRight className="h-4 w-4" /></Link>
              </div>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Academic progress                                                    */
/* ------------------------------------------------------------------ */
function AssignmentsCard({ s }: { s: Student }) {
  const pct = Math.round(assignmentCompletion(s))
  const { assigned, submitted, late, pending } = s.lms.assignments
  const rows = [
    { label: 'Submitted on time', v: submitted - late, tone: 'good' as Tone },
    { label: 'Submitted late', v: late, tone: 'warn' as Tone },
    { label: 'Pending', v: pending, tone: 'bad' as Tone },
  ]
  return (
    <Card>
      <CardHeader><CardTitle>Assignments overview</CardTitle><CardDescription>{assigned} assignments this semester · from the college LMS</CardDescription></CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2"><span className={cn('text-[32px] font-bold tabular-nums', TONE[scoreTone(pct)].text)}>{pct}%</span><span className="text-sm text-muted-foreground">completion</span></div>
        <Progress value={pct} tone={scoreTone(pct)} className="mt-2 h-2.5" />
        <ul className="mt-5 divide-y divide-border">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between py-2.5 text-sm">
              <span className="flex items-center gap-2"><span className={cn('h-2.5 w-2.5 rounded-full', TONE[r.tone].solid)} />{r.label}</span>
              <span className="font-semibold tabular-nums">{r.v}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function RecentActivity({ s, to }: { s: Student; to: (p: string) => string }) {
  const items = [
    ...s.placement.aptitude.map((x) => ({ date: x.date, icon: <PenLine />, text: `Aptitude test · ${x.pattern}`, value: `${Math.round(x.totalPercent)}%`, href: '/placement/aptitude' })),
    ...s.placement.interviews.map((x) => ({ date: x.date, icon: <Mic />, text: `Mock interview · ${x.type}`, value: `${x.score}/100`, href: '/placement/interview' })),
    ...s.skills.codingAttempts.map((x) => ({ date: x.date, icon: <Code2 />, text: `Coding test · ${x.language}`, value: `${Math.round(x.score)}%`, href: '/skills/coding' })),
    ...s.skills.technicalTests.map((x) => ({ date: x.date, icon: <Zap />, text: `Skill test · ${x.skill}`, value: `${x.score}%`, href: '/skills' })),
    ...s.activities.map((x) => ({ date: x.date, icon: <Award />, text: x.title, value: x.status, href: '/engagement' })),
  ].sort((x, y) => y.date.localeCompare(x.date)).slice(0, 5)
  return (
    <Card>
      <CardHeader><CardTitle>Recent academic activity</CardTitle><CardDescription>Your latest tests, interviews and activities</CardDescription></CardHeader>
      <CardContent>
        {items.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No recent activity yet.</p> : (
          <ul className="space-y-1">
            {items.map((x, i) => (
              <li key={i}>
                <Link to={to(x.href)} className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-muted">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-100 [&_svg]:h-4 [&_svg]:w-4">{x.icon}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{x.text}</span><span className="text-xs text-muted-foreground">{fmtDate(x.date)}</span></span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">{x.value}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Score explanation                                                    */
/* ------------------------------------------------------------------ */
function ScoreExplanation({ a }: { a: Analysis }) {
  const [all, setAll] = useState(false)
  const { contributions, topHelping, topPulling } = a.explain
  const rows = [...contributions].sort((x, y) => y.weight - x.weight)
  const shown = all ? rows : rows.slice(0, 5)
  const sum = Math.round(contributions.reduce((t, c) => t + c.weight * c.score, 0) * 10) / 10
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Why is my score {fmtScore(a.score)}?</CardTitle>
        <CardDescription>Each bar shows how many points a component adds (green) or removes (red) compared with the average student in your cohort.</CardDescription>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 dark:border-green-500/30 dark:bg-green-500/10">
            <TrendingUp className={cn('h-4 w-4', TONE.good.text)} />Biggest strength: <b>{topHelping.label}</b><span className="tabular-nums text-muted-foreground">({signed(topHelping.impact, 2)})</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 dark:border-red-500/30 dark:bg-red-500/10">
            <TrendingDown className={cn('h-4 w-4', TONE.bad.text)} />Biggest improvement area: <b>{topPulling.label}</b><span className="tabular-nums text-muted-foreground">({signed(topPulling.impact, 2)})</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[340px]"><ImpactChart data={contributions} /></div>

        <div className="mt-6">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><ActivityIcon className="h-4 w-4 text-primary" />How your score is calculated</h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="data-table w-full min-w-[460px] text-sm">
              <thead className="text-xs text-muted-foreground"><tr>
                <th className="px-4 py-2.5 text-left font-medium">Component</th><th className="px-4 py-2.5 text-right font-medium">Weight</th>
                <th className="px-4 py-2.5 text-right font-medium">Your score</th><th className="px-4 py-2.5 text-right font-medium">Points added</th>
              </tr></thead>
              <tbody>
                {shown.map((c) => (
                  <tr key={c.key} className="border-t border-border">
                    <td className="px-4 py-2">{c.label}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{Math.round(c.weight * 100)}%</td>
                    <td className="px-4 py-2 text-right tabular-nums">{c.score.toFixed(1)}</td>
                    <td className="px-4 py-2 text-right font-semibold tabular-nums">{(c.weight * c.score).toFixed(2)}</td>
                  </tr>
                ))}
                {all && (
                  <tr className="border-t-2 border-border font-semibold">
                    <td className="px-4 py-2.5" colSpan={3}>Success Score (sum, rounded to 1 decimal)</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{fmtScore(sum)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setAll((v) => !v)} aria-expanded={all}>
            {all ? 'Show fewer components' : `View all ${rows.length} components and total`}<ChevronDown className={cn('h-4 w-4 transition-transform', all && 'rotate-180')} />
          </Button>
          <p className="mt-1 text-xs text-muted-foreground">Weights: {rows.map((c) => `${c.label} ${Math.round(WEIGHTS[c.key] * 100)}%`).join(' · ')}.</p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Score history (estimated for earlier semesters, labelled as such)    */
/* ------------------------------------------------------------------ */
function ScoreHistory({ a }: { a: Analysis }) {
  if (a.trend.length < 2) return null
  const prev = a.trend[a.trend.length - 2]
  const change = Math.round((a.score - prev.score) * 10) / 10
  return (
    <Card>
      <CardHeader>
        <CardTitle>Success Score history</CardTitle>
        <CardDescription>
          Earlier semesters are <b>estimates</b>: they use that semester's CGPA, backlogs, attendance and approved activities. LMS, placement, skills and faculty feedback have no stored history, so current values are used.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-3">
          {[
            { l: 'Current score', v: fmtScore(a.score) },
            { l: `${prev.semester} (estimated)`, v: fmtScore(prev.score) },
            { l: 'Change', v: `${signed(change)} pts`, tone: change >= 0 ? TONE.good.text : TONE.bad.text },
          ].map((x) => (
            <div key={x.l} className="rounded-xl bg-muted/60 p-3"><div className="text-xs text-muted-foreground">{x.l}</div><div className={cn('mt-0.5 text-xl font-bold tabular-nums', x.tone)}>{x.v}</div></div>
          ))}
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={a.trend} margin={{ left: 0, right: 24, top: 10, bottom: 4 }}>
              <defs><linearGradient id="hist" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-primary)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--chart-primary)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="semester" tick={{ fontSize: 13 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} width={36} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmtScore(Number(v ?? 0)), 'Success Score']} />
              <ReferenceLine y={75} stroke="var(--success)" strokeDasharray="4 4" label={{ value: 'On Track 75', fontSize: 11, fill: 'var(--success)', position: 'insideTopRight' }} />
              <ReferenceLine y={50} stroke="var(--warning)" strokeDasharray="4 4" label={{ value: 'At Risk < 50', fontSize: 11, fill: 'var(--warning)', position: 'insideBottomRight' }} />
              <Area type="monotone" dataKey="score" stroke="var(--chart-primary)" strokeWidth={3} fill="url(#hist)" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
  )
}
