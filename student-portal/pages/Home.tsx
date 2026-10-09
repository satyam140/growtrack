import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Activity as ActivityIcon, AlertTriangle, ArrowRight, Award, BellRing, Briefcase, CalendarCheck, CheckCircle2, ChevronDown, CircleAlert,
  ClipboardList, Code2, FileCheck2, GraduationCap, Mic, PenLine, ShieldAlert, ShieldCheck, Sparkles, TrendingDown, TrendingUp, Zap,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@student/components/ui/card'
import { Badge } from '@student/components/ui/badge'
import { Button } from '@student/components/ui/button'
import { Progress } from '@student/components/ui/misc'
import { ImpactChart, PageHeader, WithData, tooltipStyle } from '@student/components/common'
import {
  activeBacklogs, assignmentCompletion, attendanceBySubject, cgpa, roman, skillsScore, WEIGHTS, type Analysis, type ActionItem, type RiskFlag, type Tone,
} from '@student/lib/scoring'
import { pendingForms } from '@student/lib/insights'
import { cn, fmtDate, levelTone, scoreTone, TONE } from '@student/lib/utils'
import { useStudent } from '@student/hooks/useStudent'
import type { Level, Student } from '@student/types'

/** One display rule for the Success Score everywhere on this page: one decimal place. */
const fmtScore = (n: number) => (Math.round(n * 10) / 10).toFixed(1)
const signed = (n: number, d = 1) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${Math.abs(n).toFixed(d)}`

export default function Home() {
  return <WithData>{({ student, analysis }) => <HomeView s={student} a={analysis} />}</WithData>
}

function HomeView({ s, a }: { s: Student; a: Analysis }) {
  const { base } = useStudent()
  const to = (p: string) => base + p || '/'
  const first = s.name.split(' ')[0]
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

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
  const pf = pendingForms(s)
  const lowSubjects = attendanceBySubject(s).filter((x) => x.percent < 75)
  const pending = s.lms.assignments.pending
  const items: { icon: ReactNode; text: ReactNode; href: string; cta: string; tone: Tone }[] = []
  if (lowSubjects.length) items.push({ icon: <CalendarCheck className="h-4 w-4" />, tone: 'bad', href: to('/attendance'), cta: 'View attendance',
    text: <><b>{lowSubjects.length} {lowSubjects.length === 1 ? 'subject is' : 'subjects are'}</b> below 75% attendance ({lowSubjects.map((x) => x.short).join(', ')})</> })
  if (pending) items.push({ icon: <ClipboardList className="h-4 w-4" />, tone: 'warn', href: to(''), cta: '',
    text: <><b>{pending} assignment{pending > 1 ? 's' : ''}</b> pending on the LMS</> })
  if (pf.count) items.push({ icon: <FileCheck2 className="h-4 w-4" />, tone: 'warn', href: to('/feedback'), cta: 'Complete now',
    text: <><b>{pf.count} feedback form{pf.count > 1 ? 's' : ''}</b> pending</> })
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
    </div>
  )
}

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
  )
}
