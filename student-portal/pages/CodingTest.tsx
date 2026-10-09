import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java'
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python'
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c'
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Coffee, Cpu, Database, FileCode2, Lightbulb, Flag, Info, Loader2, Play, RotateCcw, Terminal, XCircle, MinusCircle } from 'lucide-react'
import { Button } from '@student/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@student/components/ui/card'
import { Badge } from '@student/components/ui/badge'
import { BottomSheet, Modal, Progress, useToast } from '@student/components/ui/misc'
import { ChartCard, InsightsCard, PageHeader, TopbarTimer, WithData, tooltipStyle } from '@student/components/common'
import { CODING_QUESTIONS, LANGUAGE_META, SQL_TABLE_ROWS, type CodingQuestion, type Difficulty } from '@student/data/codingQuestions'
import { bestByLanguage, CODING_LANGUAGES, codingLevel, MIN_QUESTIONS_FOR_SKILL } from '@student/lib/coding'
import { gradeSql, runQuery, type QueryResult } from '@student/services/sql'
import { saveCodingAttempt } from '@student/services/api'
import { SKILL_RESOURCES } from '@student/data/questions'
import { useStudent } from '@student/hooks/useStudent'
import { TODAY } from '@student/data/students'
import { cn, fmtDate, scoreTone, TONE } from '@student/lib/utils'
import type { CodingAttempt, CodingLanguage } from '@student/types'

SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('c', c)
SyntaxHighlighter.registerLanguage('sql', sql)

const LANG_ICON = { Java: Coffee, Python: FileCode2, C: Cpu, SQL: Database } as const
const TIME_LIMIT = 600
type Filter = 'All' | Difficulty
const FILTERS: Filter[] = ['All', 'Easy', 'Medium', 'Hard']
const LINE_COLORS: Record<CodingLanguage, string> = { Java: 'var(--brand-700)', Python: 'var(--accent)', C: 'var(--chart-4)', SQL: 'var(--brand-400)' }

interface RQ extends CodingQuestion { shuffled?: string[] }
interface Review { q: RQ; answer: string | null; correct: boolean; skipped: boolean; note?: string }
interface Summary { language: CodingLanguage; difficulty: Filter; score: number; correct: number; wrong: number; skipped: number; secs: number; topics: Record<string, { correct: number; total: number }>; reviews: Review[] }

const shuffle = <T,>(xs: T[]) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function CodingTest() {
  const [run, setRun] = useState<{ language: CodingLanguage; difficulty: Filter; id: number } | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  return (
    <WithData>
      {({ student: s, base }) => (
        <>
          <PageHeader title="Coding Test" description="Timed tests in Java, Python, C and SQL — concept MCQs, output prediction and SQL query writing."
            actions={<Link to={`${base}/skills`}><Button variant="outline"><ArrowLeft className="h-4 w-4" />Back to Skills</Button></Link>} />
          {run ? <Runner key={run.id} language={run.language} difficulty={run.difficulty} onDone={(r) => { setSummary(r); setRun(null) }} onExit={() => setRun(null)} />
            : summary ? <ResultView r={summary} onBack={() => setSummary(null)} onRetake={() => { setRun({ language: summary.language, difficulty: summary.difficulty, id: Date.now() }); setSummary(null) }} />
            : <Select attempts={s.skills.codingAttempts} onStart={(language, difficulty) => setRun({ language, difficulty, id: Date.now() })} />}
        </>
      )}
    </WithData>
  )
}

/* ------------------------------ selection screen ----------------------------- */
function Select({ attempts, onStart }: { attempts: CodingAttempt[]; onStart: (l: CodingLanguage, d: Filter) => void }) {
  const [filter, setFilter] = useState<Filter>('All')
  const best = bestByLanguage(attempts, true)
  const count = (l: CodingLanguage) => CODING_QUESTIONS.filter((q) => q.language === l && (filter === 'All' || q.difficulty === filter)).length
  const sorted = [...attempts].sort((a, b) => a.date.localeCompare(b.date))
  const perLang: Record<string, number> = {}
  const chart = sorted.map((a) => { perLang[a.language] = (perLang[a.language] ?? 0) + 1; return { a, n: perLang[a.language] } })
  const maxN = Math.max(0, ...Object.values(perLang))
  const data = Array.from({ length: maxN }, (_, i) => ({ attempt: `#${i + 1}`, ...Object.fromEntries(CODING_LANGUAGES.map((l) => [l, chart.find((c) => c.a.language === l && c.n === i + 1)?.a.score ?? null])) }))
  const last = sorted[sorted.length - 1]

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">Difficulty:</span>
        <div role="tablist" className="inline-flex gap-1 rounded-xl bg-muted p-1">
          {FILTERS.map((f) => <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={cn('rounded-lg px-3.5 py-1.5 text-sm font-medium transition', filter === f ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground')}>{f}</button>)}
        </div>
        <span className="text-xs text-muted-foreground">Only tests with {MIN_QUESTIONS_FOR_SKILL}+ questions count toward your Skills score.</span>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CODING_LANGUAGES.map((l) => {
          const m = LANGUAGE_META[l]; const n = count(l); const b = best[l]
          return (
            <Card key={l} className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border p-5"><div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-100">{(() => { const I = LANG_ICON[l]; return <I className="h-6 w-6" /> })()}</div><div><div className="text-lg font-semibold">{m.label}</div><div className="text-xs text-muted-foreground">{m.blurb}</div></div></div>
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="grid grid-cols-3 gap-2 text-center text-sm"><div><div className="text-lg font-bold">{n}</div><div className="text-xs text-muted-foreground">questions</div></div><div><div className="flex items-center justify-center gap-1 text-lg font-bold"><Clock className="h-4 w-4" />10</div><div className="text-xs text-muted-foreground">minutes</div></div><div><div className={cn('text-lg font-bold', b !== undefined && TONE[scoreTone(b)].text)}>{b !== undefined ? `${b}%` : '—'}</div><div className="text-xs text-muted-foreground">best score</div></div></div>
                <Button className="mt-4" disabled={n === 0} onClick={() => onStart(l, filter)}><Play className="h-4 w-4" />Start test</Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {data.length > 0 ? (
        <ChartCard title="Score history by language" description="Your score on every attempt" height={260} className="mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 0, right: 16, top: 10, bottom: 18 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" label={{ value: 'Attempt number', position: 'insideBottom', offset: -12, fontSize: 11 }} />
              <YAxis domain={[0, 100]} label={{ value: 'Score %', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${Number(v ?? 0)}%`} /><Legend verticalAlign="top" height={28} />
              {CODING_LANGUAGES.map((l) => <Line key={l} dataKey={l} stroke={LINE_COLORS[l]} strokeWidth={3} dot={{ r: 4 }} connectNulls />)}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : <div className="mb-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No coding attempts yet — pick a language above to take your first test.</div>}

      {sorted.length > 0 && (
        <Card className="mb-6"><CardHeader><CardTitle>Attempt history</CardTitle></CardHeader><CardContent className="overflow-x-auto">
          <table className="data-table w-full min-w-[520px] text-sm"><thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="py-2">Date</th><th>Language</th><th>Difficulty</th><th>Correct</th><th>Time</th><th className="text-right">Score</th></tr></thead>
            <tbody>{[...sorted].reverse().map((a) => (<tr key={a.id} className="border-b border-border last:border-0"><td className="py-2.5">{fmtDate(a.date)}</td><td>{a.language}</td><td>{a.difficulty}</td><td>{a.correct}/{a.questionCount}</td><td>{fmt(a.timeTakenSec)}</td><td className={cn('text-right font-semibold', TONE[scoreTone(a.score)].text)}>{a.score}%</td></tr>))}</tbody></table>
        </CardContent></Card>
      )}
      <InsightsCard items={last ? [
        { text: <>Your latest test was <b>{last.language}</b>: <b>{last.score}%</b> ({codingLevel(last.score)}).</>, tone: scoreTone(last.score) },
        ...CODING_LANGUAGES.filter((l) => best[l] === undefined).map((l) => ({ text: <>You haven't tried <b>{l}</b> yet — each language you add widens your Technical Skills profile.</> })),
      ] : [{ text: 'Your best score in each language updates the Technical Skills radar, your Success Score and Placement readiness.' }]} />
    </>
  )
}

/* -------------------------------- code block -------------------------------- */
function Code({ code, language }: { code: string; language: CodingLanguage }) {
  return (
    <SyntaxHighlighter language={LANGUAGE_META[language].prism} style={atomOneDark} customStyle={{ margin: 0, borderRadius: 12, padding: '14px 16px', fontSize: 13.5, lineHeight: 1.6 }} showLineNumbers={code.includes('\n')} wrapLongLines>
      {code}
    </SyntaxHighlighter>
  )
}

/* ------------------------------------ test ----------------------------------- */
function Runner({ language, difficulty, onDone, onExit }: { language: CodingLanguage; difficulty: Filter; onDone: (s: Summary) => void; onExit: () => void }) {
  const { studentId } = useStudent()
  const toast = useToast()
  const qs = useMemo<RQ[]>(() => shuffle(CODING_QUESTIONS.filter((q) => q.language === language && (difficulty === 'All' || q.difficulty === difficulty))).map((q) => ({ ...q, shuffled: q.options ? shuffle(q.options) : undefined })), [language, difficulty])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(() => qs.map(() => null))
  const [marked, setMarked] = useState(() => qs.map(() => false))
  const [visited, setVisited] = useState(() => qs.map((_, i) => i === 0))
  const [left, setLeft] = useState(TIME_LIMIT)
  const [confirm, setConfirm] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [exit, setExit] = useState(false)
  const [grading, setGrading] = useState(false)
  const [out, setOut] = useState<{ res?: QueryResult; err?: string; running?: boolean }>({})
  const start = useRef(Date.now()); const done = useRef(false)

  const submit = useCallback(async () => {
    if (done.current) return
    done.current = true; setGrading(true); setConfirm(false)
    const reviews: Review[] = await Promise.all(qs.map(async (q, i) => {
      const a = answers[i]
      if (a === null || !a.trim()) return { q, answer: null, correct: false, skipped: true }
      if (q.type === 'sql_query') { const g = await gradeSql(a, q.expectedQuery!); return { q, answer: a, correct: g.correct, skipped: false, note: g.message } }
      return { q, answer: a, correct: a === q.answer, skipped: false }
    }))
    const correct = reviews.filter((r) => r.correct).length, skipped = reviews.filter((r) => r.skipped).length
    const topics: Summary['topics'] = {}
    reviews.forEach((r) => { const t = (topics[r.q.topic] ??= { correct: 0, total: 0 }); t.total++; if (r.correct) t.correct++ })
    const secs = Math.min(TIME_LIMIT, Math.round((Date.now() - start.current) / 1000))
    const score = Math.round((correct / qs.length) * 100)
    await saveCodingAttempt(studentId, { language, date: TODAY, difficulty, score, questionCount: qs.length, correct, wrong: qs.length - correct - skipped, skipped, timeTakenSec: secs, topicScores: topics })
    toast.success(`${language} test saved — ${score}%`)
    onDone({ language, difficulty, score, correct, wrong: qs.length - correct - skipped, skipped, secs, topics, reviews })
  }, [answers, qs, language, difficulty, studentId, toast, onDone])

  useEffect(() => { const t = setInterval(() => setLeft(Math.max(0, TIME_LIMIT - Math.round((Date.now() - start.current) / 1000))), 500); return () => clearInterval(t) }, [])
  useEffect(() => { if (left === 0) submit() }, [left, submit])

  const go = (i: number) => { setIdx(i); setOut({}); setVisited((v) => v.map((x, k) => (k === i ? true : x))) }
  const q = qs[idx]
  const set = (v: string | null) => setAnswers((a) => a.map((x, k) => (k === idx ? v : x)))
  const answered = answers.filter((a) => a !== null && a.trim()).length
  const runIt = async () => {
    setOut({ running: true })
    try { setOut({ res: await runQuery(answers[idx] ?? '') }) } catch (e) { setOut({ err: (e as Error).message }) }
  }

  if (grading) return <div className="grid place-items-center py-24 text-muted-foreground"><Loader2 className="mb-3 h-8 w-8 animate-spin" />Grading your answers…</div>
  const palette = (
      <Card className="h-fit shadow-none lg:shadow-soft">
        <CardHeader><CardTitle>Question palette</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">{qs.map((_, i) => {
            const has = answers[i] !== null && answers[i]!.trim()
            const st = marked[i] ? 'bg-brand-500 text-white' : has ? 'bg-green-500 text-white' : visited[i] ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' : 'bg-muted text-muted-foreground'
            return <button key={i} onClick={() => go(i)} aria-label={`Question ${i + 1}`} className={cn('aspect-square rounded-lg text-xs font-semibold', st, i === idx && 'ring-2 ring-primary ring-offset-2 ring-offset-card')}>{i + 1}</button>
          })}</div>
          <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">{[['bg-green-500', 'Answered'], ['bg-red-200', 'Not answered'], ['bg-brand-500', 'Marked for review'], ['bg-muted', 'Not visited']].map(([c, l]) => <div key={l} className="flex items-center gap-2"><span className={cn('h-3 w-3 rounded', c)} />{l}</div>)}</div>
          <div className="mt-4 text-sm"><b>{answered}</b> of {qs.length} answered</div>
          <Button className="mt-3 w-full" onClick={() => setConfirm(true)}>Submit test</Button>
          <Button className="mt-2 w-full" variant="ghost" onClick={() => setExit(true)}>Exit without saving</Button>
        </CardContent>
      </Card>
  )
  return (
    <div className="grid gap-4 pb-16 lg:pb-0 lg:grid-cols-[1fr_290px]">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div><CardTitle className="flex items-center gap-2">{(() => { const I = LANG_ICON[language]; return <I className="h-5 w-5 text-brand-600" /> })()}{language} test</CardTitle>
            <CardDescription>Question {idx + 1} of {qs.length} · <Badge tone="primary">{q.topic}</Badge> <Badge tone={q.difficulty === 'Easy' ? 'good' : q.difficulty === 'Medium' ? 'warn' : 'bad'}>{q.difficulty}</Badge> <Badge>{q.type === 'mcq' ? 'Concept' : q.type === 'output' ? 'Output prediction' : 'Write SQL'}</Badge></CardDescription></div>
          <TopbarTimer left={left} />
        </CardHeader>
        <CardContent>
          <Progress value={(answered / qs.length) * 100} tone="primary" className="mb-4" />
          <p className="mb-3 text-base font-medium">{q.question}</p>
          {q.code && <div className="mb-4"><Code code={q.code} language={language} /></div>}

          {q.type === 'sql_query' ? (
            <>
              <div className="mb-3 overflow-x-auto rounded-xl border border-border text-xs"><div className="bg-muted/60 px-3 py-1.5 font-mono font-semibold">students(id INT, name TEXT, dept TEXT, cgpa REAL)</div>
                <table className="w-full"><tbody>{SQL_TABLE_ROWS.map((r, i) => <tr key={i} className="border-t border-border">{r.map((c, j) => <td key={j} className="px-3 py-1 font-mono">{c === null ? <i className="text-muted-foreground">NULL</i> : String(c)}</td>)}</tr>)}</tbody></table></div>
              <textarea value={answers[idx] ?? ''} onChange={(e) => set(e.target.value)} spellCheck={false} rows={5} aria-label="SQL editor" placeholder="SELECT ... FROM students ..."
                className="w-full rounded-xl border border-border bg-brand-950 p-3 font-mono text-sm leading-6 text-slate-100 outline-none focus:ring-2 focus:ring-primary/50" />
              <div className="mt-2 flex items-center gap-2"><Button variant="outline" size="sm" onClick={runIt} disabled={out.running}>{out.running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Terminal className="h-4 w-4" />}Run query</Button><span className="text-xs text-muted-foreground">Runs on the sample table in your browser. It is graded when you submit.</span></div>
              {out.err && <p role="alert" className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-500/10">{out.err}</p>}
              {out.res && <div className="mt-2 overflow-x-auto rounded-xl border border-border text-xs"><table className="w-full"><thead className="bg-muted/60"><tr>{out.res.columns.map((c) => <th key={c} className="px-3 py-1.5 text-left font-mono">{c}</th>)}</tr></thead><tbody>{out.res.rows.map((r, i) => <tr key={i} className="border-t border-border">{r.map((c, j) => <td key={j} className="px-3 py-1 font-mono">{c === null ? <i className="text-muted-foreground">NULL</i> : String(c)}</td>)}</tr>)}</tbody></table>{out.res.rows.length === 0 && <p className="p-3 text-muted-foreground">0 rows returned.</p>}</div>}
            </>
          ) : (
            <div className="space-y-2" role="radiogroup" aria-label="Options">
              {q.shuffled!.map((o, i) => (
                <button key={o} role="radio" aria-checked={answers[idx] === o} onClick={() => set(o)} className={cn('flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition', answers[idx] === o ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted')}>
                  <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-semibold', answers[idx] === o ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>{String.fromCharCode(65 + i)}</span><span className="font-mono text-[13px]">{o}</span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2"><Button variant="outline" disabled={idx === 0} onClick={() => go(idx - 1)}><ArrowLeft className="h-4 w-4" />Previous</Button><Button variant="outline" disabled={idx === qs.length - 1} onClick={() => go(idx + 1)}>Next<ArrowRight className="h-4 w-4" /></Button></div>
            <div className="flex gap-2"><Button variant={marked[idx] ? 'soft' : 'ghost'} onClick={() => setMarked((m) => m.map((x, k) => (k === idx ? !x : x)))}><Flag className="h-4 w-4" />{marked[idx] ? 'Marked' : 'Mark for review'}</Button><Button variant="ghost" onClick={() => set(null)}>Clear</Button></div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden lg:block">{palette}</div>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 lg:hidden">
        <span className="text-sm"><b>{answered}</b> answered</span>
        <Button variant="outline" size="sm" onClick={() => setSheet(true)}>Questions</Button>
        <Button size="sm" onClick={() => setConfirm(true)}>Submit</Button>
      </div>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Question palette">{palette}</BottomSheet>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Submit test?"><p className="text-sm text-muted-foreground">You answered <b>{answered}</b> of {qs.length}{marked.some(Boolean) && <>, with <b>{marked.filter(Boolean).length}</b> marked for review</>}. Answers can't be changed after submitting.</p><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirm(false)}>Keep working</Button><Button onClick={submit}>Yes, submit</Button></div></Modal>
      <Modal open={exit} onClose={() => setExit(false)} title="Exit the test?"><p className="text-sm text-muted-foreground">Your answers will be discarded and no attempt will be saved.</p><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setExit(false)}>Continue test</Button><Button variant="danger" onClick={onExit}>Exit</Button></div></Modal>
    </div>
  )
}

/* ---------------------------------- results ---------------------------------- */
function ResultView({ r, onBack, onRetake }: { r: Summary; onBack: () => void; onRetake: () => void }) {
  const tone = scoreTone(r.score)
  const level = codingLevel(r.score)
  const topics = Object.entries(r.topics).map(([t, v]) => ({ t, ...v, pct: Math.round((v.correct / v.total) * 100) })).sort((a, b) => a.pct - b.pct)
  const weak = topics.filter((t) => t.pct < 60)
  const counts = r.reviews.length >= MIN_QUESTIONS_FOR_SKILL
  const resources = SKILL_RESOURCES[r.language]?.[level === 'Advanced' ? 'advanced' : level === 'Intermediate' ? 'intermediate' : 'beginner'] ?? []
  return (
    <>
      <div className="mb-4 flex gap-2"><Button variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4" />Back to tests</Button><Button onClick={onRetake}><RotateCcw className="h-4 w-4" />Retake</Button></div>
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="p-5 md:col-span-1"><div className="text-xs text-muted-foreground">{r.language} · {r.difficulty}</div><div className={cn('text-5xl font-bold', TONE[tone].text)}>{r.score}%</div><Badge tone={tone} className="mt-2">{level}</Badge></Card>
        <Card className="p-5"><div className="flex items-center gap-2 text-sm text-green-600"><CheckCircle2 className="h-4 w-4" />Correct</div><div className="mt-1 text-3xl font-bold">{r.correct}</div></Card>
        <Card className="p-5"><div className="flex items-center gap-2 text-sm text-red-600"><XCircle className="h-4 w-4" />Wrong</div><div className="mt-1 text-3xl font-bold">{r.wrong}</div><div className="text-xs text-muted-foreground">+ {r.skipped} skipped</div></Card>
        <Card className="p-5"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" />Time taken</div><div className="mt-1 text-3xl font-bold">{fmt(r.secs)}</div><div className="text-xs text-muted-foreground">of 10:00</div></Card>
      </div>
      <p className={cn('mb-4 flex items-start gap-2 text-xs', counts ? 'text-muted-foreground' : 'text-amber-600')}><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />{counts ? 'This attempt is saved. Your best score in this language updates your Technical Skills, Success Score and Placement readiness.' : `Saved, but with fewer than ${MIN_QUESTIONS_FOR_SKILL} questions it does not change your Skills score. Take the "All" test to update it.`}</p>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Topic-wise breakdown</CardTitle></CardHeader><CardContent className="space-y-3">{topics.map((t) => (
          <div key={t.t}><div className="mb-1 flex justify-between text-sm"><span>{t.t}</span><span className="font-semibold">{t.correct}/{t.total} · {t.pct}%</span></div><Progress value={t.pct} tone={scoreTone(t.pct)} /></div>))}</CardContent></Card>
        <Card><CardHeader><CardTitle>Practice more</CardTitle><CardDescription>{weak.length ? 'Topics below 60%' : 'No weak topics in this test'}</CardDescription></CardHeader><CardContent className="space-y-2 text-sm">
          {weak.map((t) => <div key={t.t} className="flex gap-2 rounded-xl bg-muted/60 p-3"><span className="font-semibold">{t.t}</span><span className="text-muted-foreground">— {t.pct}%. Revisit the explanations below and write 5 small {r.language} programs/queries on this topic.</span></div>)}
          {resources.length > 0 && <div className="pt-1"><div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Suggested resources ({level})</div><ul className="list-disc space-y-1 pl-5">{resources.map((x) => <li key={x}>{x}</li>)}</ul></div>}
        </CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle>Question review</CardTitle></CardHeader><CardContent className="space-y-3">
        {r.reviews.map(({ q, answer, correct, skipped, note }, i) => (
          <div key={q.id} className={cn('rounded-xl border p-4 text-sm', correct ? `${TONE.good.border} ${TONE.good.bg}` : skipped ? 'border-border bg-muted/40' : `${TONE.bad.border} ${TONE.bad.bg}`)}>
            <div className="flex items-start gap-2">{correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" /> : skipped ? <MinusCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}<div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">Q{i + 1} · {q.topic} · {q.difficulty}</div><b>{q.question}</b></div></div>
            {q.code && <div className="mt-2"><Code code={q.code} language={r.language} /></div>}
            <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
              <div><div className="mb-1 text-muted-foreground">Your answer</div>{q.type === 'sql_query' ? <pre className="overflow-x-auto rounded-lg bg-brand-950 p-2 font-mono text-slate-100">{answer ?? 'Skipped'}</pre> : <b className="font-mono">{answer ?? 'Skipped'}</b>}</div>
              <div><div className="mb-1 text-muted-foreground">Correct answer</div>{q.type === 'sql_query' ? <pre className="overflow-x-auto rounded-lg bg-brand-950 p-2 font-mono text-slate-100">{q.expectedQuery}</pre> : <b className="font-mono">{q.answer}</b>}</div>
            </div>
            {note && <p className="mt-2 text-xs"><b>Result check:</b> {note}</p>}
            <p className="mt-2 text-xs text-muted-foreground"><Lightbulb className="mr-1 inline h-3.5 w-3.5" />{q.explanation}</p>
          </div>
        ))}
      </CardContent></Card>
    </>
  )
}
