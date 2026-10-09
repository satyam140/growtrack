"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
CalendarCheck,
Users,
UserCheck,
UserX,
Search,
TrendingUp,
GraduationCap,
BookOpen,
Menu,
X,
} from "lucide-react";
import {
CartesianGrid,
Line,
LineChart,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
} from "recharts";

type AttendanceRecord = {
id: string;
name: string;
department: string;
semester: string;
present: number;
total: number;
};

const records: AttendanceRecord[] = [
{ id: "STU-1024", name: "Aarav Sharma", department: "Computer Science", semester: "Semester 6", present: 68, total: 100 },
{ id: "STU-1132", name: "Rohan Verma", department: "Electronics", semester: "Semester 5", present: 62, total: 100 },
{ id: "STU-1087", name: "Priya Patel", department: "Information Technology", semester: "Semester 6", present: 91, total: 100 },
{ id: "STU-1169", name: "Ananya Singh", department: "Computer Science", semester: "Semester 4", present: 96, total: 100 },
{ id: "STU-1201", name: "Kabir Mehta", department: "Mechanical Engineering", semester: "Semester 3", present: 78, total: 100 },
{ id: "STU-1244", name: "Ishita Rao", department: "Information Technology", semester: "Semester 5", present: 88, total: 100 },
{ id: "STU-1302", name: "Neha Gupta", department: "Electronics", semester: "Semester 4", present: 72, total: 100 },
{ id: "STU-1320", name: "Vikram Joshi", department: "Mechanical Engineering", semester: "Semester 6", present: 84, total: 100 },
];

const weeklyTrend = [
{ day: "Mon", attendance: 86 },
{ day: "Tue", attendance: 89 },
{ day: "Wed", attendance: 83 },
{ day: "Thu", attendance: 92 },
{ day: "Fri", attendance: 88 },
{ day: "Sat", attendance: 85 },
];

const departments = [
"All departments",
"Computer Science",
"Information Technology",
"Electronics",
"Mechanical Engineering",
];

const semesters = [
"All semesters",
"Semester 3",
"Semester 4",
"Semester 5",
"Semester 6",
];

function MetricCard({
title,
value,
subtitle,
icon: Icon,
}: {
title: string;
value: string;
subtitle: string;
icon: typeof Users;
}) {
return ( <div className="rounded-xl border border-[#e2e8e2] bg-white p-5"> <div className="flex items-center justify-between gap-3"> <p className="text-sm text-[#718075]">{title}</p> <div className="rounded-lg bg-[#edf5ef] p-2.5 text-[#28684e]"> <Icon size={20} /> </div> </div> <p className="mt-4 text-3xl font-semibold text-[#203d2e]">{value}</p> <p className="mt-2 text-xs text-[#89938a]">{subtitle}</p> </div>
);
}

function AttendanceBadge({ percentage }: { percentage: number }) {
const status =
percentage < 75
? "Low attendance"
: percentage < 85
? "Needs monitoring"
: "Good attendance";

const color =
percentage < 75
? "bg-red-50 text-red-700"
: percentage < 85
? "bg-amber-50 text-amber-700"
: "bg-green-50 text-green-700";

return (
<span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${color}`}>
{status} </span>
);
}

export default function AttendancePage() {
const [search, setSearch] = useState("");
const [department, setDepartment] = useState("All departments");
const [semester, setSemester] = useState("All semesters");
const [threshold, setThreshold] = useState("all");
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const getPercentage = (record: AttendanceRecord) =>
Math.round((record.present / record.total) * 100);

const filteredRecords = useMemo(() => {
const query = search.trim().toLowerCase();


return records.filter((record) => {
  const percentage = getPercentage(record);

  const matchesSearch =
    record.name.toLowerCase().includes(query) ||
    record.id.toLowerCase().includes(query) ||
    record.department.toLowerCase().includes(query);

  const matchesDepartment =
    department === "All departments" ||
    record.department === department;

  const matchesSemester =
    semester === "All semesters" || record.semester === semester;

  const matchesThreshold =
    threshold === "all" ||
    (threshold === "low" && percentage < 75) ||
    (threshold === "good" && percentage >= 85);

  return (
    matchesSearch &&
    matchesDepartment &&
    matchesSemester &&
    matchesThreshold
  );
});


}, [search, department, semester, threshold]);

const monitoredCount = filteredRecords.length;

const averageAttendance =
  monitoredCount > 0
    ? Math.round(
        filteredRecords.reduce(
          (sum, record) => sum + getPercentage(record),
          0,
        ) / monitoredCount,
      )
    : 0;

const lowAttendance = filteredRecords.filter(
  (record) => getPercentage(record) < 75,
).length;

const goodAttendance = filteredRecords.filter(
  (record) => getPercentage(record) >= 85,
).length;

const departmentStats = departments
  .filter((item) => item !== "All departments")
  .map((name) => {
    const departmentRecords = filteredRecords.filter(
      (record) => record.department === name,
    );

    const average =
      departmentRecords.length > 0
        ? Math.round(
            departmentRecords.reduce(
              (sum, record) => sum + getPercentage(record),
              0,
            ) / departmentRecords.length,
          )
        : 0;

    return { name, average };
  });


return ( <div className="min-h-screen bg-[#f5f7f4] text-[#25352a]"> <div className="flex min-h-screen"> <aside id="workspace-sidebar" aria-label="Workspace navigation" className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col overflow-y-auto bg-[#193f31] text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}> <div className="flex items-center justify-between px-6 py-7"><Link href="/admin/dashboard" className="flex items-center gap-3"> <div className="rounded-xl border border-white/25 p-2"> <GraduationCap size={24} /> </div> <div> <h2 className="text-xl font-semibold">GrowthTrack</h2> <p className="mt-1 text-[9px] font-semibold tracking-[1.5px] text-[#b4c9ba]">
STUDENT SUCCESS PLATFORM </p> </div> </Link>
<button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" className="rounded p-1 text-white/75 hover:bg-white/10 lg:hidden"><X size={20} /></button></div>


      <nav className="space-y-2 px-4 pt-5">
        <p className="mb-3 px-3 text-xs font-semibold tracking-[2px] text-[#a5bca9]">
          WORKSPACE
        </p>
        <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
          <BookOpen size={19} /> Overview
        </Link>
        <Link href="/students" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
          <Users size={19} /> Students
        </Link>
        <Link href="/academic-performance" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
          <BookOpen size={19} /> Academic performance
        </Link>
        <Link href="/attendance" aria-current="page" className="flex items-center gap-3 rounded-lg bg-[#315d47] px-4 py-3 text-sm font-semibold text-white">
          <CalendarCheck size={19} /> Attendance
        </Link>
        <Link href="/placement-readiness" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
          <GraduationCap size={19} /> Placement readiness
        </Link>
        <Link href="/mock-interviews" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
          <BookOpen size={19} /> Mock interviews
        </Link>
        <Link href="/interventions" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
          <TrendingUp size={19} /> Interventions
        </Link>

        <div className="my-6 border-t border-white/15" />
        <p className="mb-3 px-3 text-xs font-semibold tracking-[2px] text-[#a5bca9]">
          ADMINISTRATION
        </p>
        <Link href="/settings" className="block rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
          Settings
        </Link>
        <Link href="/help" className="block rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
          Help and documentation
        </Link>
      </nav>

      <div className="mt-auto border-t border-white/15 p-5">
        <p className="text-sm font-medium">Administrator</p>
        <p className="mt-1 text-xs text-[#a5bca9]">GrowthTrack workspace</p>
      </div>
    </aside>
    {mobileMenuOpen && <button type="button" aria-label="Close navigation backdrop" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

    <main className="min-w-0 flex-1">
      <header className="flex min-h-[70px] items-center justify-between border-b border-[#e2e8e2] bg-white px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3 text-xs text-[#758176] sm:text-sm">
          <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation" aria-controls="workspace-sidebar" aria-expanded={mobileMenuOpen} className="shrink-0 rounded-md border border-[#e2e8e2] p-2 text-[#47564b] lg:hidden"><Menu size={19} /></button>
          <span className="truncate whitespace-nowrap">
            Workspace <span className="mx-2">/</span>
            <span className="font-semibold text-[#263b2d]">Attendance</span>
          </span>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-[#edf5ef] px-3 py-2 text-xs font-medium text-[#28684e]">
          Demo data
        </span>
      </header>

      <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
        <section className="mb-8">
          <p className="text-xs font-bold tracking-[2px] text-[#367552]">
            STUDENT ENGAGEMENT
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#213c2d]">
            Attendance overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a867c]">
            Monitor attendance patterns, identify students with low
            attendance, and compare participation across departments.
          </p>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Average attendance"
            value={`${averageAttendance}%`}
            subtitle="Across sample student records"
            icon={CalendarCheck}
          />
          <MetricCard
            title="Students monitored"
            value={String(monitoredCount)}
            subtitle={
              monitoredCount === records.length
                ? "Sample student records"
                : "Filtered current view"
            }
            icon={Users}
          />
          <MetricCard
            title="Low attendance"
            value={String(lowAttendance)}
            subtitle="Below 75% attendance"
            icon={UserX}
          />
          <MetricCard
            title="Good attendance"
            value={String(goodAttendance)}
            subtitle="At least 85% attendance"
            icon={UserCheck}
          />
        </section>

        <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-[#e2e8e2] bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-[#2c4031]">
              Weekly attendance trend
            </h2>
            <p className="mt-1 text-xs text-[#89938a]">
              Illustrative daily attendance percentages
            </p>

            <div className="mt-6 h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, bottom: 5, left: -15 }}>
                  <CartesianGrid stroke="#e9eee8" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#7c897e", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={{ fill: "#7c897e", fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Attendance"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8e2", fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="attendance" stroke="#367552" strokeWidth={3} dot={{ r: 4, fill: "#367552" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="border-t border-[#edf0eb] pt-3 text-xs text-[#89938a]">
              Sample trend data. Connect actual attendance records for live reporting.
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8e2] bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-[#2c4031]">
              Department comparison
            </h2>
            <p className="mt-1 text-xs text-[#89938a]">
              Average attendance by department
            </p>

            <div className="mt-7 space-y-6">
              {departmentStats.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="text-[#4b5c4e]">{item.name}</span>
                    <span className="font-semibold text-[#2c4031]">{item.average}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#edf1ec]">
                    <div
                      className={`h-full rounded-full ${item.average < 75 ? "bg-amber-500" : "bg-[#679678]"}`}
                      style={{ width: `${item.average}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ede7] p-5">
            <div>
              <h2 className="font-semibold text-[#2c4031]">Student attendance records</h2>
              <p className="mt-1 text-xs text-[#89938a]">Search, filter, and review attendance indicators.</p>
            </div>
            <span className="rounded-full bg-[#edf5ef] px-3 py-1.5 text-xs font-medium text-[#28684e]">
              {filteredRecords.length} records
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 border-b border-[#e8ede7] bg-[#fafbf9] p-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex h-10 items-center gap-2 rounded-lg border border-[#dfe6de] bg-white px-3 xl:col-span-1">
              <Search size={16} className="text-[#879287]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or student ID"
                aria-label="Search attendance records"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>

            <select value={department} onChange={(event) => setDepartment(event.target.value)} aria-label="Filter by department" className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm outline-none">
              {departments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>

            <select value={semester} onChange={(event) => setSemester(event.target.value)} aria-label="Filter by semester" className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm outline-none">
              {semesters.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>

            <select value={threshold} onChange={(event) => setThreshold(event.target.value)} aria-label="Filter by attendance status" className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm outline-none">
              <option value="all">All attendance levels</option>
              <option value="low">Low attendance (&lt;75%)</option>
              <option value="good">Good attendance (85%+)</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#fafbf9] text-[11px] uppercase tracking-wide text-[#849084]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Student</th>
                  <th className="px-4 py-4 font-semibold">Department</th>
                  <th className="px-4 py-4 font-semibold">Semester</th>
                  <th className="px-4 py-4 font-semibold">Present</th>
                  <th className="px-4 py-4 font-semibold">Attendance</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const percentage = getPercentage(record);

                  return (
                    <tr key={record.id} className="border-t border-[#edf0eb] hover:bg-[#fafcf9]">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-[#2c4031]">{record.name}</p>
                        <p className="mt-1 text-xs text-[#89938a]">{record.id}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#59675b]">{record.department}</td>
                      <td className="px-4 py-4 text-sm text-[#59675b]">{record.semester}</td>
                      <td className="px-4 py-4 text-sm text-[#59675b]">{record.present} / {record.total}</td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-semibold ${percentage < 75 ? "text-red-700" : "text-[#2c4031]"}`}>
                          {percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <AttendanceBadge percentage={percentage} />
                      </td>
                    </tr>
                  );
                })}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#89938a]">
                      No matching attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#e8ede7] px-5 py-4 text-xs text-[#89938a]">
            Demo records only. Confirm attendance data and institutional policies before contacting students.
          </div>
        </section>

        <footer className="mt-7 flex flex-wrap justify-between gap-2 border-t border-[#e2e8e2] pt-5 text-xs text-[#89938a]">
          <span>GrowthTrack · Student Success Platform</span>
          <span>Attendance · Demo analytics</span>
        </footer>
      </div>
    </main>
  </div>
</div>


);
}
