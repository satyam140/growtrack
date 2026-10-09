import { useState } from 'react'
import { CheckCircle2, Clock, EyeOff, ShieldCheck, Star } from 'lucide-react'
import { Button } from '@student/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@student/components/ui/card'
import { Badge } from '@student/components/ui/badge'
import { Label, Progress, Select, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, useToast } from '@student/components/ui/misc'
import { InsightsCard, PageHeader, WithData } from '@student/components/common'
import { subjectsOfSemester, subjectByCode } from '@student/data/catalog'
import { submitSurvey, submitTeacherFeedback } from '@student/services/api'
import { useStudent } from '@student/hooks/useStudent'
import { pendingForms } from '@student/lib/insights'
import { avg, facultyAvgRating } from '@student/lib/scoring'
import { TODAY } from '@student/data/students'
import { cn, fmtDate, scoreTone } from '@student/lib/utils'
import type { Student } from '@student/types'

const SURVEY = [
  ['teaching', 'Quality of teaching in my courses'],
  ['curriculum', 'Relevance of the curriculum to industry'],
  ['labs', 'Laboratory facilities and equipment'],
  ['library', 'Library resources and access'],
  ['infra', 'Classrooms, Wi-Fi and campus infrastructure'],
  ['placement', 'Placement support and training'],
  ['mentoring', 'Mentoring and academic guidance'],
  ['admin', 'Administrative support and responsiveness'],
  ['overall', 'Overall satisfaction with the college'],
] as const

function Rating({ value, onChange, label, readOnly }: { value: number; onChange?: (n: number) => void; label: string; readOnly?: boolean }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={readOnly} role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => onChange?.(n)}
          className={cn('rounded p-0.5 transition', !readOnly && 'hover:scale-110')}>
          <Star className={cn('h-6 w-6', n <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40')} />
        </button>
      ))}
    </div>
  )
}

export default function Feedback() {
  return (
    <WithData>
      {({ student: s }) => {
        const pf = pendingForms(s)
        const rem = facultyAvgRating(s)
        return (
          <>
            <PageHeader title="Feedback" description="Tell the college how it's doing, rate your teachers anonymously, and read what faculty say about you." />
            <div className="mb-6 flex flex-wrap gap-3">
              <Badge tone={s.feedback.survey ? 'good' : 'warn'} className="px-3 py-1">{s.feedback.survey ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}Survey: {s.feedback.survey ? 'Submitted' : 'Pending'}</Badge>
              <Badge tone={pf.teacherPending.length ? 'warn' : 'good'} className="px-3 py-1">Teacher forms: {subjectsOfSemester(s.semester).length - pf.teacherPending.length}/{subjectsOfSemester(s.semester).length} done</Badge>
              <Badge tone={scoreTone((rem / 5) * 100)} className="px-3 py-1">Faculty rating of you: {rem.toFixed(1)}/5</Badge>
            </div>
            <Tabs defaultValue="survey">
              <TabsList>
                <TabsTrigger value="survey">Satisfaction Survey</TabsTrigger>
                <TabsTrigger value="teachers">Faculty Feedback</TabsTrigger>
                <TabsTrigger value="remarks">Faculty Remarks About Me</TabsTrigger>
              </TabsList>
              <TabsContent value="survey"><Survey s={s} /></TabsContent>
              <TabsContent value="teachers"><TeacherForm s={s} /></TabsContent>
              <TabsContent value="remarks"><Remarks s={s} /></TabsContent>
            </Tabs>
            <InsightsCard items={[
              ...(pf.survey ? [{ text: <>Your satisfaction survey is still <b>pending</b> — your honest ratings help improve labs, teaching and placement support.</>, tone: 'warn' as const }] : []),
              ...(pf.teacherPending.length ? [{ text: <>Rate your teachers for: <b>{pf.teacherPending.map((x) => x.short).join(', ')}</b>. It is completely anonymous.</>, tone: 'warn' as const }] : []),
              { text: rem >= 4 ? <>Faculty rate your participation, discipline and attitude <b>{rem.toFixed(1)}/5</b> — excellent. This feeds 5% of your Success Score.</> : <>Faculty rate you <b>{rem.toFixed(1)}/5</b> on average. Speaking up in class and being punctual are the fastest ways to raise it (5% of your Success Score).</>, tone: rem >= 4 ? 'good' : 'warn' },
            ]} />
          </>
        )
      }}
    </WithData>
  )
}

function Survey({ s }: { s: Student }) {
  const { studentId } = useStudent()
  const toast = useToast()
  const done = s.feedback.survey
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (SURVEY.some(([k]) => !ratings[k])) return setErr('Please rate every question (1–5 stars). Comments are optional.')
    setErr(''); setBusy(true)
    await submitSurvey(studentId, { date: TODAY, ratings, comments })
    setBusy(false); toast.success('Thank you! Survey submitted.')
  }
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div><CardTitle>Student satisfaction survey</CardTitle><CardDescription>{done ? `Submitted on ${fmtDate(done.date)}` : '1 = very dissatisfied, 5 = very satisfied'}</CardDescription></div>
        <Badge tone={done ? 'good' : 'warn'}>{done ? 'Submitted' : 'Pending'}</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        {SURVEY.map(([k, label], i) => (
          <div key={k} className="border-b border-border pb-4 last:border-0">
            <div className="mb-2 text-sm font-medium">{i + 1}. {label}</div>
            <Rating value={done ? done.ratings[k] : ratings[k] ?? 0} onChange={(n) => setRatings((r) => ({ ...r, [k]: n }))} label={label} readOnly={!!done} />
            {done ? (done.comments[k] && <p className="mt-2 text-sm text-muted-foreground">“{done.comments[k]}”</p>) : (
              <Textarea className="mt-2 min-h-[44px]" placeholder="Optional comment" value={comments[k] ?? ''} onChange={(e) => setComments((c) => ({ ...c, [k]: e.target.value }))} aria-label={`Comment for ${label}`} />
            )}
          </div>
        ))}
        {!done && (<>
          {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
          <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{Object.keys(ratings).length}/{SURVEY.length} rated</span><Button onClick={submit} disabled={busy}>{busy ? 'Submitting…' : 'Submit survey'}</Button></div>
        </>)}
      </CardContent>
    </Card>
  )
}

function TeacherForm({ s }: { s: Student }) {
  const { studentId } = useStudent()
  const toast = useToast()
  const subs = subjectsOfSemester(s.semester)
  const latest = (code: string) => [...s.feedback.teacherFeedback].reverse().find((f) => f.code === code)
  const [code, setCode] = useState(subs.find((x) => !latest(x.code))?.code ?? subs[0].code)
  const [r, setR] = useState({ clarity: 0, punctuality: 0, doubtSolving: 0, engagement: 0 })
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const sub = subjectByCode(code)
  const prev = latest(code)

  const submit = async () => {
    if (Object.values(r).some((v) => !v)) return setErr('Please give all four ratings.')
    setErr(''); setBusy(true)
    await submitTeacherFeedback(studentId, { code, date: TODAY, ...r, comment: comment.trim() })
    setBusy(false); setR({ clarity: 0, punctuality: 0, doubtSolving: 0, engagement: 0 }); setComment('')
    toast.success(`Anonymous feedback for ${sub.teacher} submitted`)
  }
  const dims = [['clarity', 'Clarity of explanation'], ['punctuality', 'Punctuality'], ['doubtSolving', 'Doubt solving'], ['engagement', 'Class engagement']] as const
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Rate a teacher</CardTitle>
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-800 dark:bg-green-500/10 dark:text-green-300"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><span><b>Your identity is not shared.</b> Teachers only see combined, anonymous results.</span></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="sub">Subject / teacher</Label>
            <Select id="sub" value={code} onChange={(e) => setCode(e.target.value)}>{subs.map((x) => <option key={x.code} value={x.code}>{x.name} — {x.teacher}{latest(x.code) ? ' ✓' : ''}</option>)}</Select></div>
          {prev && <p className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">You already rated this teacher on {fmtDate(prev.date)}. Submitting again will replace your earlier anonymous rating.</p>}
          {dims.map(([k, label]) => (<div key={k} className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-medium">{label}</span><Rating value={r[k]} onChange={(n) => setR((p) => ({ ...p, [k]: n }))} label={label} /></div>))}
          <div><Label htmlFor="cm">Comment (optional)</Label><Textarea id="cm" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What went well? What could improve?" /></div>
          {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
          <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-xs text-muted-foreground"><EyeOff className="h-3.5 w-3.5" />Submitted anonymously</span><Button onClick={submit} disabled={busy}>{busy ? 'Submitting…' : 'Submit feedback'}</Button></div>
        </CardContent>
      </Card>
      <Card className="h-fit">
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {subs.map((x) => (
            <button key={x.code} onClick={() => setCode(x.code)} className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left text-sm hover:bg-muted">
              <span><div className="font-medium">{x.short}</div><div className="text-xs text-muted-foreground">{x.teacher}</div></span>
              {latest(x.code) ? <Badge tone="good">Submitted</Badge> : <Badge tone="warn">Pending</Badge>}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function Remarks({ s }: { s: Student }) {
  const overall = facultyAvgRating(s)
  return (
    <div>
      <Card className="mb-4"><CardContent className="flex flex-wrap items-center gap-6 pt-5">
        <div><div className="text-xs text-muted-foreground">Average faculty rating</div><div className="text-3xl font-bold">{overall.toFixed(1)}<span className="text-base text-muted-foreground">/5</span></div></div>
        {(['participation', 'discipline', 'attitude'] as const).map((k) => (
          <div key={k} className="min-w-[120px] flex-1"><div className="mb-1 flex justify-between text-xs capitalize text-muted-foreground"><span>{k}</span><b className="text-foreground">{avg(s.feedback.remarks.map((r) => r[k])).toFixed(1)}</b></div><Progress value={(avg(s.feedback.remarks.map((r) => r[k])) / 5) * 100} tone={scoreTone((avg(s.feedback.remarks.map((r) => r[k])) / 5) * 100)} /></div>
        ))}
      </CardContent></Card>
      <p className="mb-3 text-xs text-muted-foreground">Read-only. These ratings feed 5% of your Success Score.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {s.feedback.remarks.map((r) => (
          <Card key={r.code}>
            <CardHeader><CardTitle>{subjectByCode(r.code).name}</CardTitle><CardDescription>{r.teacher} · {fmtDate(r.date)}</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(['participation', 'discipline', 'attitude'] as const).map((k) => (<div key={k} className="flex items-center justify-between text-sm"><span className="capitalize">{k}</span><Rating value={r[k]} label={k} readOnly /></div>))}
              </div>
              <p className="mt-3 rounded-xl bg-muted/60 p-3 text-sm italic">“{r.comment}”</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
