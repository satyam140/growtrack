import { motion, useReducedMotion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Info, LineChart as LineIcon } from 'lucide-react'
import { Button } from '@student/components/ui/button'
import { Progress, Sheet } from '@student/components/ui/misc'
import { Badge } from '@student/components/ui/badge'
import { EmptyState, tooltipStyle } from '@student/components/common'
import { REQUIRED_PCT, cumulativeTrend, hasTrend, mustAttend, type SubjectStat } from '@student/lib/attendance'
import { cn, fmtDate } from '@student/lib/utils'
import { actionLine, plural, statusStyle } from './shared'

export function SubjectCard({ s, onOpen }: { s: SubjectStat; onOpen: () => void }) {
  const reduce = useReducedMotion()
  const st = statusStyle(s.status)
  const critical = s.status.label === 'Critical'
  const Icon = st.Icon
  return (
    <article id={`subject-${s.code}`} aria-label={`${s.name}: ${s.percent ?? 'no'} percent, ${s.status.label}`}
      className={cn('flex scroll-mt-24 flex-col rounded-xl border border-l-4 border-border bg-card p-5 shadow-soft transition duration-150 hover:-translate-y-0.5 hover:shadow-md', st.borderL, critical && 'bg-red-50 dark:bg-red-500/10')}>
      <div className="flex items-start gap-3">
        <motion.span className={cn('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg', st.bg, st.text)} initial={false}
          animate={critical && !reduce ? { scale: [1, 1.25, 1] } : undefined} transition={{ duration: 0.8, delay: 0.5, times: [0, 0.5, 1] }}>
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </motion.span>
        <div className="min-w-0"><div className="text-base font-semibold">{s.short} <span className="font-normal text-muted-foreground">· {s.name}</span></div></div>
      </div>
      {s.total === 0 ? <div className="mt-4 flex-1 text-sm text-muted-foreground">No lectures recorded yet</div> : (
        <>
          <div className="mt-4 flex items-baseline gap-2"><span className={cn('text-[28px] font-bold leading-none tabular-nums', st.text)}>{s.percent}%</span><span className={cn('text-sm font-semibold', st.text)}>{s.status.label}</span></div>
          <Progress value={s.percent ?? 0} tone={s.status.tone === 'none' ? 'primary' : s.status.tone} marker={REQUIRED_PCT} className="mt-3" />
          <div className="mt-1.5 flex justify-between text-xs text-muted-foreground"><span>{s.attended} of {s.total} lectures attended</span><span>{REQUIRED_PCT}% marker</span></div>
          <p className={cn('mt-3 flex-1 text-sm font-medium', critical && st.text)}>{actionLine(s)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Assumes every future lecture counts equally.</p>
        </>
      )}
      <Button variant="outline" size="sm" className="mt-4 self-start" onClick={onOpen}>View details</Button>
    </article>
  )
}

export function SubjectDrawer({ s, onClose }: { s: SubjectStat | null; onClose: () => void }) {
  if (!s) return null
  const st = statusStyle(s.status)
  const trend = cumulativeTrend(s.lectures)
  const rows = [...s.lectures].sort((a, b) => b.date.localeCompare(a.date))
  const showReason = s.lectures.some((l) => l.reason)
  return (
    <Sheet open onClose={onClose} title={`${s.short} · ${s.name}`} description={`Faculty: ${s.teacher}`}>
      <div className="mb-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-muted/60 p-3"><div className={cn('text-2xl font-bold tabular-nums', st.text)}>{s.percent === null ? '—' : `${s.percent}%`}</div><div className="text-xs text-muted-foreground">{s.status.label}</div></div>
        <div className="rounded-lg bg-muted/60 p-3"><div className="text-2xl font-bold tabular-nums">{s.attended}/{s.total}</div><div className="text-xs text-muted-foreground">attended</div></div>
        <div className="rounded-lg bg-muted/60 p-3"><div className="text-2xl font-bold tabular-nums">{s.missed}</div><div className="text-xs text-muted-foreground">missed</div></div>
      </div>
      {s.total > 0 && (
        <div className={cn('mb-5 rounded-lg border p-4 text-sm', st.border, st.bg)}>
          <div className="font-semibold">{s.status.label === 'Critical' ? 'Recovery plan' : 'Where you stand'}</div>
          <p className="mt-1">{actionLine(s)}.</p>
          {s.status.label === 'Critical' && <p className="mt-1 text-muted-foreground">If you miss the next lecture, you would need {plural(mustAttend(s.attended, s.total + 1), 'lecture')} in a row instead.</p>}
        </div>
      )}
      <h3 className="mb-2 font-semibold">Running attendance</h3>
      {hasTrend(trend) ? (
        <div className="mb-5 h-44" role="img" aria-label={`Running attendance for ${s.name} by week`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ left: 0, right: 12, top: 8, bottom: 16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" interval="preserveStartEnd" label={{ value: 'Week starting', position: 'insideBottom', offset: -10, fontSize: 12 }} />
              <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${Number(v ?? 0)}%`, 'Running attendance']} />
              <ReferenceLine y={REQUIRED_PCT} stroke="var(--danger)" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="percent" stroke="var(--brand-500)" fill="var(--brand-500)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : <div className="mb-5"><EmptyState icon={<LineIcon className="h-7 w-7" />} title="Not enough weeks yet" text="A trend needs lectures in at least two different weeks." /></div>}
      <h3 className="mb-2 font-semibold">Lecture history</h3>
      {rows.length === 0 ? <EmptyState icon={<Info className="h-7 w-7" />} title="No lectures recorded yet" /> : (
        <div className="max-h-[420px] overflow-auto rounded-lg border border-border">
          <table className="data-table w-full text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="px-3 py-2">Date</th><th className="px-2">Time</th><th className="px-2">Topic</th><th className="px-2">Status</th>{showReason && <th className="px-2">Reason</th>}</tr></thead>
            <tbody>{rows.map((l) => (
              <tr key={l.date + l.slot} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap px-3">{fmtDate(l.date, { day: 'numeric', month: 'short' })}</td><td className="px-2">{l.slot}</td><td className="px-2">{l.topic}</td>
                <td className="px-2"><Badge tone={l.present ? 'good' : 'bad'}>{l.present ? 'Present' : 'Absent'}</Badge></td>{showReason && <td className="px-2">{l.reason ?? '—'}</td>}
              </tr>))}</tbody>
          </table>
        </div>
      )}
    </Sheet>
  )
}
