"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpDown,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminPageShell } from "@/components/admin-page-shell";
import { studentProfiles } from "@/lib/students";
import {
  getTpoStudent,
  type TpoStatus,
  type TpoStudent,
} from "@/lib/tpo-readiness";

const statuses: TpoStatus[] = ["Ready", "In Preparation", "Not Ready", "Not Assessed"];
const statusColors: Record<TpoStatus, string> = {
  Ready: "#367552",
  "In Preparation": "#b38a3c",
  "Not Ready": "#a45757",
  "Not Assessed": "#89968d",
};

export function TpoOverview() {
  const records = useRecords();
  const counts = countStatuses(records);
  const support = records.filter((record) => record.status === "Not Ready" || (record.status === "In Preparation" && record.weaknesses.length));
  const gaps = commonGaps(records).slice(0, 5);
  return (
    <TpoShell title="Overview">
      <TpoHeader />
      <Metrics records={records} />
      <div className="grid gap-7 lg:grid-cols-2">
        <Panel title="Readiness snapshot">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={statusEntries(counts)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>{statuses.map((status) => <Cell key={status} fill={statusColors[status]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
          <LinkTo href="/tpo/placement-readiness" label="View all readiness →" />
        </Panel>
        <Panel title="Top students needing support">
          <div className="space-y-2">{support.slice(0, 5).map((record) => <StudentRow key={record.student.id} record={record} />)}{!support.length && <Empty text="No students currently need support." />}</div>
          <LinkTo href="/tpo/students-needing-support" label="View all support needs →" />
        </Panel>
        <Panel title="Most common skill gaps">
          <div className="space-y-3">{gaps.map((gap) => <div key={gap.name} className="flex items-center justify-between text-sm"><span>{gap.name}</span><span className="rounded-full bg-[#fff7e6] px-2 py-1 text-xs font-semibold text-[#9a742e]">{gap.count} students</span></div>)}{!gaps.length && <Empty text="No assessed skill gaps are available." />}</div>
          <LinkTo href="/tpo/strong-weak-areas" label="View strong and weak areas →" />
        </Panel>
      </div>
    </TpoShell>
  );
}

export function TpoReadinessPage() {
  const records = useRecords();
  const router = useRouter();
  const initialParams = typeof window === "undefined" ? null : new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(initialParams?.get("q") ?? "");
  const [department, setDepartment] = useState(initialParams?.get("department") ?? "all");
  const [year, setYear] = useState(initialParams?.get("year") ?? "all");
  const [status, setStatus] = useState<TpoStatus | "all">((initialParams?.get("status") as TpoStatus | "all") ?? "all");
  const [sort, setSort] = useState<"name" | "readiness" | "cgpa">((initialParams?.get("sort") as "name" | "readiness" | "cgpa") ?? "name");
  const [selected, setSelected] = useState<TpoStudent | null>(null);
  const departments = useMemo(() => Array.from(new Set(records.map((record) => record.student.department))), [records]);
  const years = useMemo(() => Array.from(new Set(records.map((record) => record.student.year))), [records]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (department !== "all") next.set("department", department);
    if (year !== "all") next.set("year", year);
    if (status !== "all") next.set("status", status);
    if (sort !== "name") next.set("sort", sort);
    const value = next.toString();
    router.replace(value ? `/tpo/placement-readiness?${value}` : "/tpo/placement-readiness", { scroll: false });
  }, [department, query, router, sort, status, year]);

  const filtered = records.filter((record) => {
    const text = `${record.student.name} ${record.student.id}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (department === "all" || record.student.department === department) && (year === "all" || record.student.year === year) && (status === "all" || record.status === status);
  }).sort((left, right) => {
    if (sort === "name") return left.student.name.localeCompare(right.student.name);
    const leftValue = sort === "readiness" ? left.readiness : left.cgpa;
    const rightValue = sort === "readiness" ? right.readiness : right.cgpa;
    if (leftValue === null) return 1;
    if (rightValue === null) return -1;
    return rightValue - leftValue;
  });

  function reset() {
    setQuery(""); setDepartment("all"); setYear("all"); setStatus("all"); setSort("name");
  }

  return (
    <TpoShell title="Student Placement Readiness">
      <PageHeading title="Student Placement Readiness" description="Review each student's placement readiness and recorded skill indicators." />
      <Panel title="Readiness table">
        <div className="grid gap-3 md:grid-cols-5">
          <label className="relative md:col-span-2"><Search size={16} className="absolute left-3 top-3 text-[#89968d]" /><input aria-label="Search students" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or ID" className="h-10 w-full rounded-lg border border-[#dfe6de] pl-9 pr-3 text-sm outline-none focus:border-[#6da47e]" /></label>
          <select aria-label="Department filter" value={department} onChange={(event) => setDepartment(event.target.value)} className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm"><option value="all">All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="Year filter" value={year} onChange={(event) => setYear(event.target.value)} className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm"><option value="all">All years</option>{years.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="Status filter" value={status} onChange={(event) => setStatus(event.target.value as TpoStatus | "all")} className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm"><option value="all">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => setSort("readiness")} className="inline-flex items-center gap-1 rounded-full border border-[#dfe6de] px-3 py-1.5 text-xs text-[#405345] hover:bg-[#f5faf6]"><ArrowUpDown size={14} /> Sort readiness</button><button type="button" onClick={() => setSort("cgpa")} className="inline-flex items-center gap-1 rounded-full border border-[#dfe6de] px-3 py-1.5 text-xs text-[#405345] hover:bg-[#f5faf6]"><ArrowUpDown size={14} /> Sort CGPA</button><button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-full border border-[#dfe6de] px-3 py-1.5 text-xs text-[#405345] hover:bg-[#f5faf6]">Reset filters</button></div>
        <p className="mt-4 text-sm font-semibold text-[#405345]">{filtered.length} of {records.length} students</p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-[#edf1ed]"><table className="w-full min-w-[1080px] text-left text-sm"><thead className="border-b border-[#edf1ed] bg-[#fbfdfb] text-xs uppercase tracking-[1px] text-[#89968d]"><tr>{["Student Name", "Student ID", "Department", "Academic Year", "CGPA", "Readiness", "Status", "Strong Areas", "Weak Areas", "Action"].map((label) => <th key={label} className="px-3 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-[#edf1ed] text-[#405345]">{filtered.map((record) => <tr key={record.student.id}><td className="px-3 py-3 font-semibold text-[#2c4031]">{record.student.name}</td><td className="px-3 py-3 text-xs">{record.student.id}</td><td className="px-3 py-3">{record.student.department}</td><td className="px-3 py-3">{record.student.year}</td><td className="px-3 py-3">{record.cgpa ?? "—"}</td><td className="px-3 py-3">{record.readiness === null ? "Not Assessed" : `${record.readiness}%`}</td><td className="px-3 py-3"><StatusBadge status={record.status} score={record.readiness} /></td><td className="px-3 py-3">{record.strengths.join(", ") || "—"}</td><td className="px-3 py-3">{record.weaknesses.join(", ") || "—"}</td><td className="px-3 py-3"><button type="button" onClick={() => setSelected(record)} className="whitespace-nowrap font-semibold text-[#367552] hover:underline">View Profile</button></td></tr>)}</tbody></table></div>
        {!filtered.length && <Empty text="No students match the selected filters." />}
      </Panel>
      {selected && <ProfileDrawer record={selected} onClose={() => setSelected(null)} />}
    </TpoShell>
  );
}

export function TpoAreasPage() {
  const records = useRecords();
  const skills = Array.from(new Set(records.flatMap((record) => record.skills.map((skill) => skill.label))));
  const [selected, setSelected] = useState<TpoStudent | null>(null);
  return <TpoShell title="Strong & Weak Areas"><PageHeading title="Strong & Weak Areas" description="Skill-centric placement insights from recorded indicators only." /><div className="grid gap-4 lg:grid-cols-2">{skills.map((skill) => { const strong = records.filter((record) => record.strengths.includes(skill)); const weak = records.filter((record) => record.weaknesses.includes(skill)); const pending = records.filter((record) => record.notAssessed.includes(skill)); return <Panel key={skill} title={skill}><div className="grid grid-cols-3 gap-2 text-center text-xs"><Stat label="Strong" value={strong.length} color="text-[#367552]" /><Stat label="Weak" value={weak.length} color="text-[#a45757]" /><Stat label="Not Assessed" value={pending.length} color="text-[#89968d]" /></div><div className="mt-4 space-y-1">{[...strong, ...weak].slice(0, 5).map((record) => <button key={record.student.id} type="button" onClick={() => setSelected(record)} className="block text-sm text-[#367552] hover:underline">{record.student.name}</button>)}{!strong.length && !weak.length && <Empty text="No assessed students." />}</div></Panel>; })}</div>{selected && <ProfileDrawer record={selected} onClose={() => setSelected(null)} />}</TpoShell>;
}

export function TpoSupportPage() {
  const records = useRecords();
  const [selected, setSelected] = useState<TpoStudent | null>(null);
  const groups = [
    ["Not Ready", records.filter((record) => record.status === "Not Ready")],
    ["In Preparation", records.filter((record) => record.status === "In Preparation" && record.weaknesses.length)],
    ["Assessment Pending", records.filter((record) => record.status === "Not Assessed")],
  ] as const;
  return <TpoShell title="Students Needing Support"><PageHeading title="Students Needing Placement Support" description="Rule-based support priorities from recorded student indicators. No records are modified." /><div className="grid gap-5 lg:grid-cols-3">{groups.map(([title, rows]) => <Panel key={title} title={`${title} (${rows.length})`}><div className="space-y-3">{rows.map((record) => <button key={record.student.id} type="button" onClick={() => setSelected(record)} className="block w-full rounded-lg bg-[#fbfdfb] p-3 text-left hover:bg-[#f5faf6]"><b className="block text-sm text-[#405345]">{record.student.name}</b><span className="mt-1 block text-xs text-[#89968d]">{record.readiness === null ? "Not Assessed" : `${record.readiness}%`} · {record.weaknesses.join(", ") || "Assessment pending"}</span><span className="mt-2 block text-xs text-[#367552]">{record.recommendations.join(" · ")} · rule-based</span></button>)}{!rows.length && <Empty text="No students in this group." />}</div></Panel>)}</div>{selected && <ProfileDrawer record={selected} onClose={() => setSelected(null)} />}</TpoShell>;
}

export function TpoAnalyticsPage() {
  const records = useRecords();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [year, setYear] = useState("all");
  const [status, setStatus] = useState<TpoStatus | "all">("all");
  const [sort, setSort] = useState<"readiness" | "cgpa">("readiness");
  const [selected, setSelected] = useState<TpoStudent | null>(null);
  const departments = Array.from(new Set(records.map((record) => record.student.department)));
  const years = Array.from(new Set(records.map((record) => record.student.year)));
  const filtered = records.filter((record) => {
    const text = `${record.student.name} ${record.student.id}`.toLowerCase();
    return text.includes(query.toLowerCase()) &&
      (department === "all" || record.student.department === department) &&
      (year === "all" || record.student.year === year) &&
      (status === "all" || record.status === status);
  }).sort((left, right) => {
    const a = sort === "readiness" ? left.readiness : left.cgpa;
    const b = sort === "readiness" ? right.readiness : right.cgpa;
    if (a === null) return 1;
    if (b === null) return -1;
    return b - a;
  });
  const counts = countStatuses(filtered);
  const assessed = filtered.filter((record) => record.readiness !== null);
  const averageReadiness = assessed.length ? Math.round(assessed.reduce((sum, record) => sum + (record.readiness ?? 0), 0) / assessed.length) : null;
  const validCgpa = filtered.filter((record) => record.cgpa !== null);
  const averageCgpa = validCgpa.length ? Math.round((validCgpa.reduce((sum, record) => sum + (record.cgpa ?? 0), 0) / validCgpa.length) * 10) / 10 : null;
  const averages = departments.map((item) => {
    const rows = assessed.filter((record) => record.student.department === item);
    return { department: item, average: rows.length ? Math.round(rows.reduce((sum, row) => sum + (row.readiness ?? 0), 0) / rows.length) : 0, assessed: rows.length, ready: rows.filter((row) => row.status === "Ready").length };
  });
  const gaps = commonGaps(filtered);
  const topDepartment = [...averages].sort((a, b) => b.average - a.average)[0];
  const priorityRows = filtered.map((record) => ({ record, priority: trainingPriority(record) }));

  return <TpoShell title="Placement Analytics">
    <PageHeading title="Placement Analysis" description="Analyze student placement readiness, identify skill gaps, evaluate academic performance, and prioritize students for placement preparation." />
    <Panel title="Analysis filters">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="relative md:col-span-2"><Search size={16} className="absolute left-3 top-3 text-[#89968d]" /><input aria-label="Search placement students" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student name or ID" className="h-10 w-full rounded-lg border border-[#dfe6de] pl-9 pr-3 text-sm outline-none focus:border-[#6da47e]" /></label>
        <select value={department} onChange={(event) => setDepartment(event.target.value)} className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm"><option value="all">All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={year} onChange={(event) => setYear(event.target.value)} className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm"><option value="all">All academic years</option>{years.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={status} onChange={(event) => setStatus(event.target.value as TpoStatus | "all")} className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm"><option value="all">All readiness statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
        <button type="button" onClick={() => { setQuery(""); setDepartment("all"); setYear("all"); setStatus("all"); setSort("readiness"); }} className="inline-flex h-10 items-center justify-center rounded-lg border border-[#dfe6de] px-3 text-sm font-semibold text-[#405345] hover:bg-[#f5faf6]">Reset filters</button>
      </div>
    </Panel>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Total students" value={filtered.length} icon={UsersRound} /><Metric label="Placement ready" value={`${counts.Ready} (${filtered.length ? Math.round(counts.Ready / filtered.length * 100) : 0}%)`} icon={CheckCircle2} /><Metric label="In preparation" value={counts["In Preparation"]} icon={BarChart3} /><Metric label="Not ready" value={counts["Not Ready"]} icon={CircleAlert} /><Metric label="Average readiness" value={averageReadiness === null ? "—" : `${averageReadiness}%`} icon={BriefcaseBusiness} /><Metric label="Average CGPA" value={averageCgpa === null ? "—" : averageCgpa} icon={ArrowUpDown} /></section>
    <div className="grid gap-7 lg:grid-cols-2">
      <ChartPanel title="Placement Readiness Distribution"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={statusEntries(counts)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>{statuses.map((item) => <Cell key={item} fill={statusColors[item]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartPanel>
      <ChartPanel title="Department-Wise Placement Readiness"><ResponsiveContainer width="100%" height={260}><BarChart data={averages}><CartesianGrid strokeDasharray="3 3" stroke="#edf1ed" /><XAxis dataKey="department" tick={{ fontSize: 10 }} /><YAxis domain={[0, 100]} /><Tooltip /><Bar dataKey="average" fill="#367552" name="Average readiness" /></BarChart></ResponsiveContainer></ChartPanel>
      <ChartPanel title="Skill Gap Analysis"><ResponsiveContainer width="100%" height={260}><BarChart data={gaps} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#edf1ed" /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="name" type="category" width={125} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="count" fill="#b38a3c" name="Students" /></BarChart></ResponsiveContainer></ChartPanel>
      <ChartPanel title="CGPA vs Placement Readiness"><ResponsiveContainer width="100%" height={260}><ScatterChart><CartesianGrid stroke="#edf1ed" /><XAxis type="number" dataKey="cgpa" name="CGPA" domain={[0, 10]} /><YAxis type="number" dataKey="readiness" name="Readiness %" domain={[0, 100]} /><Tooltip /><Scatter data={assessed.filter((record) => record.cgpa !== null).map((record) => ({ cgpa: record.cgpa, readiness: record.readiness, name: record.student.name }))} fill="#367552" /></ScatterChart></ResponsiveContainer><p className="text-xs text-[#89968d]">Neutral comparison only; CGPA is unavailable in the current student model, so no points are plotted.</p></ChartPanel>
    </div>
    <Panel title="Key Placement Insights"><div className="grid gap-3 text-sm text-[#405345] md:grid-cols-2"><p>Highest average readiness: <b>{topDepartment ? `${topDepartment.department} (${topDepartment.average}%, ${topDepartment.assessed} assessed)` : "No assessed departments"}</b>.</p><p>Most common documented gap: <b>{gaps[0] ? `${gaps[0].name} (${gaps[0].count} students)` : "None"}</b>.</p><p>Incomplete assessments: <b>{counts["Not Assessed"]} students</b>.</p><p>Readiness totals reconcile: <b>{Object.values(counts).reduce((sum, value) => sum + value, 0)} unique students</b>.</p></div></Panel>
    <Panel title="Recommended Training Focus"><div className="space-y-2">{gaps.slice(0, 5).map((gap) => <div key={gap.name} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#fbfdfb] p-3 text-sm"><span><b>{gap.name}</b> · rule-based focus from documented gaps</span><span className="text-xs text-[#89968d]">{gap.count} affected students</span></div>)}{!gaps.length && <Empty text="No documented skill gaps are available." />}</div></Panel>
    <Panel title="Student Placement Analysis"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-[#89968d]">{filtered.length} of {records.length} matching students</p><div className="flex gap-2"><button type="button" onClick={() => setSort("readiness")} className="inline-flex rounded-full border border-[#dfe6de] px-3 py-1.5 text-xs text-[#405345] hover:bg-[#f5faf6]">Sort readiness</button><button type="button" onClick={() => setSort("cgpa")} className="inline-flex rounded-full border border-[#dfe6de] px-3 py-1.5 text-xs text-[#405345] hover:bg-[#f5faf6]">Sort CGPA</button></div></div><div className="overflow-x-auto rounded-lg border border-[#edf1ed]"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="border-b border-[#edf1ed] bg-[#fbfdfb] text-xs uppercase tracking-[1px] text-[#89968d]"><tr>{["Student Name", "Student ID", "Department", "Academic Year", "CGPA", "Readiness Score", "Status", "Strong Areas", "Weak Areas", "Training Priority", "Action"].map((label) => <th key={label} className="px-3 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-[#edf1ed] text-[#405345]">{priorityRows.map(({ record, priority }) => <tr key={record.student.id}><td className="px-3 py-3 font-semibold">{record.student.name}</td><td className="px-3 py-3 text-xs">{record.student.id}</td><td className="px-3 py-3">{record.student.department}</td><td className="px-3 py-3">{record.student.year}</td><td className="px-3 py-3">{record.cgpa ?? "—"}</td><td className="px-3 py-3">{record.readiness === null ? "Not Assessed" : `${record.readiness}%`}</td><td className="px-3 py-3"><StatusBadge status={record.status} score={record.readiness} /></td><td className="px-3 py-3">{record.strengths.join(", ") || "—"}</td><td className="px-3 py-3">{record.weaknesses.join(", ") || "—"}</td><td className="px-3 py-3 text-xs">{priority}</td><td className="px-3 py-3"><button type="button" onClick={() => setSelected(record)} className="whitespace-nowrap font-semibold text-[#367552] hover:underline">View Profile</button></td></tr>)}</tbody></table></div>{!filtered.length && <Empty text="No students match the selected filters." />}</Panel>
    {selected && <ProfileDrawer record={selected} onClose={() => setSelected(null)} />}
  </TpoShell>;
}

function useRecords() { return useMemo(() => studentProfiles.map(getTpoStudent), []); }
function TpoShell({ title, children }: { title: string; children: ReactNode }) { return <AdminPageShell title={title}><div className="mx-auto max-w-[1240px] space-y-7">{children}</div></AdminPageShell>; }
function TpoHeader() { return <PageHeading eyebrow="TRAINING & PLACEMENT" title="TPO Dashboard" description="Evaluate student placement readiness, identify skill gaps, and help students prepare confidently for placement interviews." />; }
function PageHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) { return <header><p className="text-xs font-bold tracking-[2px] text-[#367552]">{eyebrow ?? "TRAINING & PLACEMENT"}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#213c2d]">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#7a867c]">{description}</p><p className="mt-3 text-xs text-[#89968d]">Demo readiness data derived from existing student records. This workspace is read-only.</p></header>; }
function Metrics({ records }: { records: TpoStudent[] }) { const counts = countStatuses(records); const assessed = records.filter((record) => record.readiness !== null); const average = assessed.length ? Math.round(assessed.reduce((sum, record) => sum + (record.readiness ?? 0), 0) / assessed.length) : null; return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Total students" value={records.length} icon={UsersRound} /><Metric label="Placement ready" value={counts.Ready} icon={CheckCircle2} /><Metric label="In preparation" value={counts["In Preparation"]} icon={BarChart3} /><Metric label="Need support" value={counts["Not Ready"]} icon={CircleAlert} /><Metric label="Not assessed" value={counts["Not Assessed"]} icon={AlertCircle} /><Metric label="Average readiness" value={average === null ? "—" : `${average}%`} icon={BriefcaseBusiness} /></section>; }
function Metric({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof UsersRound }) { return <article className="group rounded-lg border border-[#dfe6de] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#b9d9c2] hover:bg-[#fbfefb] hover:shadow-[0_8px_18px_rgba(38,85,57,0.09)]"><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold uppercase tracking-[1px] text-[#7a867c]">{label}</p><Icon size={18} className="text-[#367552] transition-transform duration-200 group-hover:scale-110" /></div><p className="mt-3 text-2xl font-semibold text-[#213c2d]">{value}</p></article>; }
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-lg border border-[#dfe6de] bg-white p-5 shadow-sm transition duration-200 hover:border-[#c2daca] hover:shadow-[0_8px_20px_rgba(38,85,57,0.06)] sm:p-6"><h2 className="text-lg font-semibold text-[#213c2d]">{title}</h2><div className="mt-4">{children}</div></section>; }
function ChartPanel({ title, children }: { title: string; children: ReactNode }) { return <Panel title={title}><div className="h-[260px]">{children}</div></Panel>; }
function StatusBadge({ status, score }: { status: TpoStatus; score: number | null }) { return <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium" style={{ color: statusColors[status], backgroundColor: `${statusColors[status]}18` }}>{status}{score !== null && ` · ${score}%`}</span>; }
function StudentRow({ record }: { record: TpoStudent }) { return <div className="flex items-center justify-between rounded-lg bg-[#fbfdfb] p-3 text-sm"><span className="font-semibold text-[#405345]">{record.student.name}</span><StatusBadge status={record.status} score={record.readiness} /></div>; }
function Stat({ label, value, color }: { label: string; value: number; color: string }) { return <div><p className={`text-xl font-semibold ${color}`}>{value}</p><p className="mt-1 text-[#89968d]">{label}</p></div>; }
function LinkTo({ href, label }: { href: string; label: string }) { return <a href={href} className="group mt-5 inline-flex items-center gap-1 rounded-md px-1 py-1 text-sm font-semibold text-[#367552] transition hover:bg-[#f0f8f2] hover:text-[#28654d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7eae8b]">{label}<ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" /></a>; }
function Empty({ text }: { text: string }) { return <p className="py-6 text-sm text-[#89968d]">{text}</p>; }
function ProfileDrawer({ record, onClose }: { record: TpoStudent; onClose: () => void }) { return <div className="fixed inset-0 z-50 flex justify-end bg-black/30" role="dialog" aria-modal="true" aria-label={`${record.student.name} placement profile`}><div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold tracking-[1.5px] text-[#367552]">READ-ONLY PROFILE</p><h2 className="mt-2 text-2xl font-semibold text-[#213c2d]">{record.student.name}</h2><p className="text-sm text-[#89968d]">{record.student.id} · {record.student.department}</p></div><button type="button" onClick={onClose} aria-label="Close profile"><X size={20} /></button></div><div className="mt-6 space-y-5"><Panel title="Placement readiness"><StatusBadge status={record.status} score={record.readiness} /><p className="mt-3 text-sm text-[#89968d]">Last assessment: {record.lastAssessmentDate ?? "Not available"}</p></Panel><Panel title="Skill indicators"><div className="space-y-2">{record.skills.map((skill) => <div key={skill.label} className="flex justify-between text-sm"><span>{skill.label}</span><span>{skill.score === null ? "Not Assessed" : `${skill.score}%`}</span></div>)}</div></Panel><Panel title="Strong and weak areas"><p className="text-sm"><b>Strong:</b> {record.strengths.join(", ") || "—"}</p><p className="mt-2 text-sm"><b>Weak:</b> {record.weaknesses.join(", ") || "—"}</p><p className="mt-2 text-sm"><b>Not Assessed:</b> {record.notAssessed.join(", ") || "—"}</p></Panel><Panel title="Recommended training"><ul className="list-disc space-y-2 pl-5 text-sm">{record.recommendations.map((item) => <li key={item}>{item} <span className="text-xs text-[#89968d]">(rule-based)</span></li>)}</ul></Panel></div></div></div>; }
function countStatuses(records: TpoStudent[]) { return records.reduce<Record<TpoStatus, number>>((counts, record) => { counts[record.status] += 1; return counts; }, { Ready: 0, "In Preparation": 0, "Not Ready": 0, "Not Assessed": 0 }); }
function statusEntries(counts: Record<TpoStatus, number>) { return statuses.map((name) => ({ name, value: counts[name] })); }
function commonGaps(records: TpoStudent[]) { return Array.from(new Map(records.flatMap((record) => record.weaknesses).map((gap) => [gap, records.filter((record) => record.weaknesses.includes(gap)).length]))).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count); }
function trainingPriority(record: TpoStudent) {
  if (record.status === "Not Assessed") return "Assessment Pending";
  if (record.status === "Not Ready" || record.weaknesses.length >= 2) return "High";
  if (record.weaknesses.length) return "Medium";
  return "Low";
}
