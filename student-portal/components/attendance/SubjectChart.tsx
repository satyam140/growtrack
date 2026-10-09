import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@student/components/ui/card'
import { REQUIRED_PCT, type SubjectStat } from '@student/lib/attendance'
import { tooltipStyle } from '@student/components/common'
import { actionLine, statusStyle } from './shared'

interface Row { code: string; name: string; short: string; You: number; Class: number | null; attended: number; total: number; action: string; hex: string }

export function SubjectChart({ stats, classAvg, onPick }: { stats: SubjectStat[]; classAvg: Record<string, number>; onPick: (code: string) => void }) {
  const data: Row[] = stats.filter((s) => s.percent !== null).map((s) => ({
    code: s.code, name: s.name, short: s.short, You: s.percent!, Class: classAvg[s.code] !== undefined ? Math.round(classAvg[s.code] * 10) / 10 : null,
    attended: s.attended, total: s.total, action: actionLine(s), hex: statusStyle(s.status).hex,
  }))
  const legend = [
    { label: 'Your attendance', swatch: <span className="h-3 w-3 rounded-[3px] bg-brand-600" /> },
    { label: 'Class average', swatch: <span className="h-3 w-3 rounded-[3px]" style={{ background: 'var(--chart-cohort)' }} /> },
    { label: 'Minimum required', swatch: <span className="h-0 w-4 border-t-2 border-dashed" style={{ borderColor: 'var(--danger)' }} /> },
  ]
  return (
    <Card className="h-full transition duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader><CardTitle>Subject-wise attendance</CardTitle><CardDescription>Bar colour shows status (green good, amber at risk, red critical). Click a bar for details.</CardDescription></CardHeader>
      <CardContent>
        <ul className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px]" aria-label="Legend">{legend.map((l) => <li key={l.label} className="flex items-center gap-2">{l.swatch}{l.label}</li>)}</ul>
        <div className="h-80" role="img" aria-label={`Bar chart of attendance by subject. ${data.map((d) => `${d.short} ${d.You} percent`).join(', ')}. Minimum required ${REQUIRED_PCT} percent.`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 12, top: 24, bottom: 22 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="short" label={{ value: 'Subject', position: 'insideBottom', offset: -12, fontSize: 12 }} />
              <YAxis domain={[0, 100]} label={{ value: 'Attendance %', angle: -90, position: 'insideLeft', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgb(var(--muted))' }} contentStyle={tooltipStyle} content={({ active, payload }) => {
                const r = active && (payload?.[0]?.payload as Row | undefined)
                if (!r) return null
                return (
                  <div style={tooltipStyle} className="p-3 text-xs shadow-lg">
                    <div className="mb-1 text-sm font-semibold">{r.name}</div>
                    <div>Your attendance: <b>{r.You}%</b> ({r.attended}/{r.total})</div>
                    <div>Class average: <b>{r.Class === null ? 'No data' : `${r.Class}%`}</b></div>
                    <div className="mt-1 text-muted-foreground">{r.action}</div>
                  </div>
                )
              }} />
              <ReferenceLine y={REQUIRED_PCT} stroke="var(--danger)" strokeDasharray="6 4" strokeWidth={1.5} label={{ value: `${REQUIRED_PCT}% minimum required`, position: 'insideTopRight', fill: 'var(--danger)', fontSize: 12, fontWeight: 600 }} />
              <Bar dataKey="You" radius={[4, 4, 0, 0]} cursor="pointer" onClick={(entry) => {
                const row = entry.payload as Row | undefined
                if (row) onPick(row.code)
              }}>
                {data.map((d) => <Cell key={d.code} fill={d.hex} />)}
              </Bar>
              <Bar dataKey="Class" fill="var(--chart-cohort)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
