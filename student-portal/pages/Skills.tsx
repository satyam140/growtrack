import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BookOpen, Brain, Camera, Clock, Code2, Loader2, Mic, Play, Square, Users, Video } from 'lucide-react'
import { Button } from '@student/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@student/components/ui/card'
import { Badge } from '@student/components/ui/badge'
import { Modal, Progress, useToast } from '@student/components/ui/misc'
import { ChartCard, InsightsCard, PageHeader, StatCard, StatGrid, WithData, tooltipStyle } from '@student/components/common'
import { skillLevel, softAvg, techAvg } from '@student/lib/scoring'
import { SJT, SKILL_RESOURCES, TECH_TESTS, type CoreTech } from '@student/data/questions'
import { saveIntro, saveSkillTest, saveSoftSkills } from '@student/services/api'
import { scoreIntroduction } from '@student/services/ai'
import { useStudent } from '@student/hooks/useStudent'
import { useSpeech } from '@student/hooks/useSpeech'
import { useCamera } from '@student/hooks/useCamera'
import { TODAY } from '@student/data/students'
import { cn, scoreTone, TONE } from '@student/lib/utils'
import type { SoftSkill, TechSkill } from '@student/types'
import { Link } from 'react-router-dom'
import { bestByLanguage } from '@student/lib/coding'

const TECH: CoreTech[] = ['DSA', 'Web Dev', 'DBMS', 'Python']
const CODING = ['Java', 'Python', 'C', 'SQL'] as const
const SOFT: SoftSkill[] = ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management']
const levelTone = (l: string) => (l === 'Advanced' ? 'good' : l === 'Intermediate' ? 'warn' : 'bad')

export default function Skills() {
  const [tech, setTech] = useState<CoreTech | null>(null)
  const [sjt, setSjt] = useState(false)
  const [resFor, setResFor] = useState<string | null>(null)
  return (
    <WithData>
      {({ student: s, cohort, base }) => {
        const techKeys = (Object.keys(s.skills.technical) as TechSkill[]).filter((k) => s.skills.technical[k] !== undefined)
        const all = [...techKeys.map((k) => ({ k: k as string, v: s.skills.technical[k]!, avg: cohort.avgTech[k] ?? s.skills.technical[k]!, kind: 'Technical' })), ...SOFT.map((k) => ({ k: k as string, v: s.skills.soft[k], avg: cohort.avgSoft[k], kind: 'Soft' }))]
        const sorted = [...all].sort((a, b) => b.v - a.v)
        const radar = all.map((x) => ({ skill: x.k, You: x.v, Cohort: x.avg }))
        return (
          <>
            <PageHeader title="Skills" description="Technical and soft-skill scores, how you compare with your cohort, and ways to improve." />
            <StatGrid>
              <StatCard label="Technical average" value={Math.round(techAvg(s))} tone={scoreTone(techAvg(s))} sub={skillLevel(techAvg(s))} icon={<Code2 className="h-4 w-4" />} />
              <StatCard label="Soft-skill average" value={Math.round(softAvg(s))} tone={scoreTone(softAvg(s))} sub={skillLevel(softAvg(s))} icon={<Users className="h-4 w-4" />} />
              <StatCard label="Strongest skill" value={sorted[0].k} sub={`${sorted[0].v}%`} tone="good" icon={<Brain className="h-4 w-4" />} />
              <StatCard label="Weakest skill" value={sorted[sorted.length - 1].k} sub={`${sorted[sorted.length - 1].v}%`} tone={scoreTone(sorted[sorted.length - 1].v)} icon={<Brain className="h-4 w-4" />} />
            </StatGrid>

            <div className="mb-6 grid gap-4 lg:grid-cols-2">
              <ChartCard title="Skill radar" description="Every skill — you vs cohort average" height={320}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radar} outerRadius="68%">
                    <PolarGrid /><PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} /><PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="You" dataKey="You" stroke="var(--chart-primary)" fill="var(--chart-primary)" fillOpacity={0.35} />
                    <Radar name="Cohort average" dataKey="Cohort" stroke="var(--chart-cohort)" fill="var(--chart-cohort)" fillOpacity={0.15} />
                    <Legend /><Tooltip contentStyle={tooltipStyle} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="You vs cohort" description="Score per skill compared with the class average" height={320}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={all.map((x) => ({ name: x.k, You: x.v, 'Cohort average': x.avg }))} margin={{ left: 0, right: 12, top: 12, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={60} tick={{ fontSize: 11 }} label={{ value: 'Skill', position: 'insideBottom', offset: -34, fontSize: 11 }} />
                    <YAxis domain={[0, 100]} label={{ value: 'Score %', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} /><Legend verticalAlign="top" height={28} />
                    <Bar dataKey="You" fill="var(--chart-primary)" radius={[5, 5, 0, 0]} /><Bar dataKey="Cohort average" fill="var(--chart-cohort)" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <Card className="mb-6">
              <CardHeader><CardTitle>Technical skills</CardTitle><CardDescription>Take a short timed MCQ test (6 questions, 3 minutes). Your new score is averaged with your previous one.</CardDescription></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {TECH.map((k) => {
                  const v = s.skills.technical[k] ?? 0; const lv = skillLevel(v)
                  return (
                    <div key={k} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between"><b>{k}</b><Badge tone={levelTone(lv)}>{lv}</Badge></div>
                      <div className={cn('mt-2 text-3xl font-bold', TONE[scoreTone(v)].text)}>{v}%</div>
                      <Progress value={v} tone={scoreTone(v)} className="mt-2" />
                      <div className="mt-3 flex gap-2"><Button size="sm" onClick={() => setTech(k)}><Play className="h-3.5 w-3.5" />Take test</Button><Button size="sm" variant="outline" onClick={() => setResFor(k)}><BookOpen className="h-3.5 w-3.5" />Resources</Button></div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                <div><CardTitle>Coding languages</CardTitle><CardDescription>Java, Python, C and SQL tests. Your best score per language feeds the radar and your Success Score.</CardDescription></div>
                <Link to={`${base}/skills/coding`}><Button><Code2 className="h-4 w-4" />Take coding test</Button></Link>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {CODING.map((l) => {
                  const b = bestByLanguage(s.skills.codingAttempts)[l]
                  return (
                    <div key={l} className="rounded-xl border border-border p-4"><div className="flex items-center justify-between"><b>{l}</b>{b !== undefined && <Badge tone={levelTone(skillLevel(b))}>{skillLevel(b)}</Badge>}</div>
                      <div className={cn('mt-2 text-2xl font-bold', b !== undefined && TONE[scoreTone(b)].text)}>{b !== undefined ? `${b}%` : 'Not attempted'}</div>
                      {b !== undefined && <Progress value={b} tone={scoreTone(b)} className="mt-2" />}</div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                <div><CardTitle>Soft skills</CardTitle><CardDescription>Situational judgment test: 10 workplace scenarios mapped to five skills.</CardDescription></div>
                <Button onClick={() => setSjt(true)}><Play className="h-4 w-4" />Take situational test</Button>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {SOFT.map((k) => {
                  const v = s.skills.soft[k]; const lv = skillLevel(v)
                  return (
                    <div key={k} className="rounded-xl border border-border p-4">
                      <div className="text-sm font-semibold">{k}</div>
                      <div className={cn('mt-1 text-2xl font-bold', TONE[scoreTone(v)].text)}>{v}%</div>
                      <Progress value={v} tone={scoreTone(v)} className="mt-2" />
                      <div className="mt-2 flex items-center justify-between"><Badge tone={levelTone(lv)}>{lv}</Badge><button className="text-xs text-primary hover:underline" onClick={() => setResFor(k)}>Resources</button></div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <IntroCard />

            <InsightsCard items={[
              { text: <>Your strongest skill is <b>{sorted[0].k}</b> ({sorted[0].v}%). Your weakest is <b>{sorted[sorted.length - 1].k}</b> ({sorted[sorted.length - 1].v}%) — {sorted[sorted.length - 1].v < sorted[sorted.length - 1].avg ? `${sorted[sorted.length - 1].avg - sorted[sorted.length - 1].v} points below the cohort average` : 'still above the cohort average'}.</>, tone: scoreTone(sorted[sorted.length - 1].v) },
              ...all.filter((x) => x.v < x.avg - 5).slice(0, 3).map((x) => ({ text: <><b>{x.k}</b> is {x.avg - x.v} points below the cohort average. {SKILL_RESOURCES[x.k][skillLevel(x.v).toLowerCase() as 'beginner'][0]} is a good place to start.</>, tone: 'warn' as const })),
            ]} />

            {tech && <TechTestModal skill={tech} current={s.skills.technical[tech] ?? 0} onClose={() => setTech(null)} />}
            {sjt && <SJTModal current={s.skills.soft} onClose={() => setSjt(false)} />}
            <Modal open={!!resFor} onClose={() => setResFor(null)} title={`Suggested resources · ${resFor}`}>
              {resFor && (() => {
                const cur = resFor in s.skills.soft ? s.skills.soft[resFor as SoftSkill] : s.skills.technical[resFor as TechSkill] ?? 0
                const lv = skillLevel(cur); const r = SKILL_RESOURCES[resFor]
                const list = r[lv.toLowerCase() as 'beginner']
                return <><p className="mb-3 text-sm text-muted-foreground">You are at <b>{lv}</b> level ({cur}%). Suggested next steps:</p><ul className="list-disc space-y-1.5 pl-5 text-sm">{list.map((x) => <li key={x}>{x}</li>)}</ul></>
              })()}
            </Modal>
          </>
        )
      }}
    </WithData>
  )
}

/* ---------------------------- technical MCQ test --------------------------- */
function TechTestModal({ skill, current, onClose }: { skill: CoreTech; current: number; onClose: () => void }) {
  const { studentId } = useStudent()
  const toast = useToast()
  const qs = TECH_TESTS[skill]
  const [i, setI] = useState(0)
  const [ans, setAns] = useState<(number | null)[]>(qs.map(() => null))
  const [left, setLeft] = useState(180)
  const [res, setRes] = useState<{ raw: number; blended: number } | null>(null)
  const start = useRef(Date.now())

  const finish = async () => {
    if (res) return
    const correct = qs.filter((q, k) => ans[k] === q.answer).length
    const raw = Math.round((correct / qs.length) * 100)
    const blended = Math.round((current + raw) / 2)
    await saveSkillTest(studentId, skill, blended, TODAY)
    toast.success(`${skill} test saved — ${correct}/${qs.length} correct`)
    setRes({ raw, blended })
  }
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, 180 - Math.round((Date.now() - start.current) / 1000))), 500)
    return () => clearInterval(t)
  })
  useEffect(() => { if (left === 0 && !res) finish() }) // eslint-disable-line

  return (
    <Modal open onClose={onClose} title={`${skill} test`} wide>
      {res ? (
        <div>
          <div className="text-center"><div className={cn('text-5xl font-bold', TONE[scoreTone(res.raw)].text)}>{res.raw}%</div><p className="mt-1 text-sm text-muted-foreground">Test score. Your {skill} skill is now <b>{res.blended}%</b> (average of previous {current}% and this test).</p></div>
          <div className="mt-4 space-y-2">{qs.map((q, k) => (
            <div key={k} className={cn('rounded-xl border p-3 text-sm', ans[k] === q.answer ? `${TONE.good.border} ${TONE.good.bg}` : `${TONE.bad.border} ${TONE.bad.bg}`)}>
              <b>{q.q}</b><div className="mt-1 text-xs">Correct: <b>{q.options[q.answer]}</b>{ans[k] !== q.answer && <> · You: {ans[k] === null ? 'skipped' : q.options[ans[k]!]}</>}</div><div className="text-xs text-muted-foreground">{q.explanation}</div>
            </div>))}</div>
          <div className="mt-4 flex justify-end"><Button onClick={onClose}>Done</Button></div>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between text-sm"><span>Question {i + 1} / {qs.length}</span><span className={cn('flex items-center gap-1 font-mono font-bold', left < 30 && TONE.bad.text)}><Clock className="h-4 w-4" />{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span></div>
          <Progress value={((i + 1) / qs.length) * 100} tone="primary" />
          <p className="mt-4 font-medium">{qs[i].q}</p>
          <div className="mt-3 space-y-2">{qs[i].options.map((o, k) => (
            <button key={k} onClick={() => setAns((a) => a.map((x, j) => (j === i ? k : x)))} className={cn('w-full rounded-xl border p-3 text-left text-sm transition', ans[i] === k ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted')}>{o}</button>))}</div>
          <div className="mt-5 flex justify-between">
            <Button variant="outline" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</Button>
            {i < qs.length - 1 ? <Button onClick={() => setI(i + 1)}>Next</Button> : <Button onClick={finish}>Submit</Button>}
          </div>
        </div>
      )}
    </Modal>
  )
}

/* ---------------------- situational judgment test (soft) ------------------- */
function SJTModal({ current, onClose }: { current: Record<SoftSkill, number>; onClose: () => void }) {
  const { studentId } = useStudent()
  const toast = useToast()
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<(number | null)[]>(SJT.map(() => null))
  const [res, setRes] = useState<Partial<Record<SoftSkill, number>> | null>(null)

  const finish = async () => {
    const sums: Record<string, number[]> = {}
    SJT.forEach((sc, k) => { (sums[sc.skill] ??= []).push(sc.options[picked[k]!].score) })
    const scores: Partial<Record<SoftSkill, number>> = {}
    SOFT.forEach((k) => { const arr = sums[k]; if (arr) scores[k] = Math.round((current[k] + arr.reduce((a, b) => a + b, 0) / arr.length) / 2) })
    await saveSoftSkills(studentId, scores)
    toast.success('Soft-skill scores updated')
    setRes(scores)
  }
  const sc = SJT[i]
  return (
    <Modal open onClose={onClose} title="Situational judgment test" wide>
      {res ? (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">Your soft-skill scores (averaged with your previous scores):</p>
          <div className="space-y-3">{SOFT.map((k) => <div key={k}><div className="mb-1 flex justify-between text-sm"><span>{k}</span><b>{current[k]}% → {res[k]}%</b></div><Progress value={res[k] ?? 0} tone={scoreTone(res[k] ?? 0)} /></div>)}</div>
          <div className="mt-4 flex justify-end"><Button onClick={onClose}>Done</Button></div>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-between text-sm"><Badge tone="primary">{sc.skill}</Badge><span>Scenario {i + 1} / {SJT.length}</span></div>
          <Progress value={((i + 1) / SJT.length) * 100} tone="primary" />
          <p className="mt-4 font-medium">{sc.scenario}</p>
          <p className="mt-1 text-xs text-muted-foreground">Choose the response that is closest to what you would really do.</p>
          <div className="mt-3 space-y-2">{sc.options.map((o, k) => (
            <button key={k} onClick={() => setPicked((a) => a.map((x, j) => (j === i ? k : x)))} className={cn('w-full rounded-xl border p-3 text-left text-sm transition', picked[i] === k ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted')}>{o.text}</button>))}</div>
          <div className="mt-5 flex justify-between">
            <Button variant="outline" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</Button>
            {i < SJT.length - 1 ? <Button disabled={picked[i] === null} onClick={() => setI(i + 1)}>Next</Button> : <Button disabled={picked.some((p) => p === null)} onClick={finish}>Submit</Button>}
          </div>
        </div>
      )}
    </Modal>
  )
}

/* --------------------------- video introduction (beta) --------------------- */
function IntroCard() {
  const { student, studentId } = useStudent()
  const toast = useToast()
  const speech = useSpeech()
  const cam = useCamera()
  const [recording, setRecording] = useState(false)
  const [secs, setSecs] = useState(0)
  const [busy, setBusy] = useState(false)
  const startedAt = useRef(0)
  const prev = student?.skills.introScore

  useEffect(() => {
    if (!recording) return
    const t = setInterval(() => { const e = Math.round((Date.now() - startedAt.current) / 1000); setSecs(e); if (e >= 60) stop() }, 500)
    return () => clearInterval(t)
  }) // eslint-disable-line

  const begin = async () => {
    if (!cam.on) await cam.start()
    speech.reset(); speech.start(); startedAt.current = Date.now(); setSecs(0); setRecording(true)
  }
  const stop = async () => {
    if (!recording) return
    setRecording(false); speech.stop(); cam.stop(); setBusy(true)
    const text = speech.final.trim()
    const elapsed = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000))
    if (text.split(/\s+/).length < 8) { setBusy(false); toast.error('Not enough speech was captured. Try again in a quiet place and speak clearly.'); return }
    const r = await scoreIntroduction(text, elapsed)
    await saveIntro(studentId, { date: TODAY, score: r.score, feedback: r.feedback })
    setBusy(false); toast.success(`Communication score: ${r.score}/100`)
  }

  return (
    <Card className="mb-6">
      <CardHeader><CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" />Video Introduction <Badge tone="primary">Beta</Badge></CardTitle><CardDescription>Record a 1-minute self-introduction. Video is only previewed; the speech transcript is sent to the AI service for a communication score.</CardDescription></CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="aspect-video overflow-hidden rounded-xl bg-muted">
              {cam.on ? <video ref={cam.videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" /> : <div className="grid h-full place-items-center text-muted-foreground"><Camera className="h-8 w-8" /></div>}
            </div>
            <div className="mt-3 flex items-center gap-3">
              {!recording ? <Button onClick={begin} disabled={!speech.supported || busy}><Mic className="h-4 w-4" />Start recording</Button> : <Button variant="danger" onClick={stop}><Square className="h-4 w-4" />Stop &amp; score</Button>}
              {recording && <span className="font-mono text-sm">{String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')} / 01:00</span>}
              {busy && <span className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Scoring…</span>}
            </div>
            {!speech.supported && <p className="mt-2 text-xs text-amber-600">Speech recognition isn't supported in this browser — try Chrome or Edge.</p>}
            {cam.error && <p className="mt-2 text-xs text-red-600">{cam.error}</p>}
          </div>
          <div className="space-y-3">
            <div className="min-h-[96px] rounded-xl bg-muted/60 p-3 text-sm"><div className="mb-1 text-xs font-medium text-muted-foreground">Live transcript</div>{speech.final || speech.interim ? <>{speech.final}<span className="italic text-muted-foreground">{speech.interim}</span></> : <span className="text-muted-foreground">Your words will appear here. Cover: who you are, what you study, a project or skill, and your goal.</span>}</div>
            {prev && <div className={cn('rounded-xl border p-3 text-sm', TONE[scoreTone(prev.score)].border, TONE[scoreTone(prev.score)].bg)}><b>Last score: {prev.score}/100</b><p className="mt-1 text-muted-foreground">{prev.feedback}</p></div>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
