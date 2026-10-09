"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
GraduationCap,
BookOpen,
Users,
BriefcaseBusiness,
TrendingUp,
Search,
CheckCircle2,
AlertTriangle,
Target,
Code2,
MessageCircle,
Brain,
Menu,
X,
} from "lucide-react";
import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
} from "recharts";

type Student = {
id: string;
name: string;
department: string;
semester: string;
technical: number;
aptitude: number;
communication: number;
interview: number;
};

const students: Student[] = [
{
id: "STU-1024",
name: "Aarav Sharma",
department: "Computer Science",
semester: "Semester 6",
technical: 88,
aptitude: 82,
communication: 78,
interview: 85,
},
{
id: "STU-1132",
name: "Rohan Verma",
department: "Electronics",
semester: "Semester 5",
technical: 52,
aptitude: 58,
communication: 61,
interview: 48,
},
{
id: "STU-1087",
name: "Priya Patel",
department: "Information Technology",
semester: "Semester 6",
technical: 91,
aptitude: 86,
communication: 88,
interview: 90,
},
{
id: "STU-1169",
name: "Ananya Singh",
department: "Computer Science",
semester: "Semester 4",
technical: 72,
aptitude: 76,
communication: 81,
interview: 69,
},
{
id: "STU-1201",
name: "Kabir Mehta",
department: "Mechanical Engineering",
semester: "Semester 3",
technical: 61,
aptitude: 68,
communication: 55,
interview: 58,
},
{
id: "STU-1244",
name: "Ishita Rao",
department: "Information Technology",
semester: "Semester 5",
technical: 95,
aptitude: 91,
communication: 92,
interview: 94,
},
{
id: "STU-1302",
name: "Neha Gupta",
department: "Electronics",
semester: "Semester 4",
technical: 74,
aptitude: 72,
communication: 79,
interview: 75,
},
{
id: "STU-1320",
name: "Vikram Joshi",
department: "Mechanical Engineering",
semester: "Semester 6",
technical: 83,
aptitude: 80,
communication: 85,
interview: 82,
},
];

const departments = [
"All departments",
"Computer Science",
"Information Technology",
"Electronics",
"Mechanical Engineering",
];

const skillData = [
{ skill: "Technical", score: 77 },
{ skill: "Aptitude", score: 77 },
{ skill: "Communication", score: 77 },
{ skill: "Interview", score: 75 },
];

function getReadiness(student: Student) {
return Math.round(
(student.technical +
student.aptitude +
student.communication +
student.interview) /
4,
);
}

function getStatus(score: number) {
if (score >= 80) return "Placement ready";
if (score >= 65) return "Almost ready";
return "Needs training";
}

function MetricCard({
title,
value,
description,
icon: Icon,
}: {
title: string;
value: string;
description: string;
icon: typeof Users;
}) {
return ( <div className="rounded-xl border border-[#e2e8e2] bg-white p-5"> <div className="flex items-center justify-between gap-3"> <p className="text-sm text-[#718075]">{title}</p> <div className="rounded-lg bg-[#edf5ef] p-2.5 text-[#28684e]"> <Icon size={20} /> </div> </div> <p className="mt-4 text-3xl font-semibold tracking-tight text-[#203d2e]">
{value} </p> <p className="mt-2 text-xs text-[#89938a]">{description}</p> </div>
);
}

function StatusBadge({ score }: { score: number }) {
const status = getStatus(score);

const style =
score >= 80
? "bg-green-50 text-green-700"
: score >= 65
? "bg-amber-50 text-amber-700"
: "bg-red-50 text-red-700";

return (
<span
className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${style}`}
>
{status} </span>
);
}

export default function PlacementReadinessPage() {
const [search, setSearch] = useState("");
const [department, setDepartment] = useState("All departments");
const [readinessFilter, setReadinessFilter] = useState("all");
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const filteredStudents = useMemo(() => {
const query = search.trim().toLowerCase();


return students.filter((student) => {
  const score = getReadiness(student);

  const matchesSearch =
    student.name.toLowerCase().includes(query) ||
    student.id.toLowerCase().includes(query) ||
    student.department.toLowerCase().includes(query);

  const matchesDepartment =
    department === "All departments" ||
    student.department === department;

  const matchesReadiness =
    readinessFilter === "all" ||
    (readinessFilter === "ready" && score >= 80) ||
    (readinessFilter === "almost" && score >= 65 && score < 80) ||
    (readinessFilter === "training" && score < 65);

  return matchesSearch && matchesDepartment && matchesReadiness;
});


}, [search, department, readinessFilter]);

const averageReadiness = Math.round(
students.reduce((sum, student) => sum + getReadiness(student), 0) /
students.length,
);

const readyCount = students.filter(
(student) => getReadiness(student) >= 80,
).length;

const almostReadyCount = students.filter((student) => {
const score = getReadiness(student);
return score >= 65 && score < 80;
}).length;

const trainingCount = students.filter(
(student) => getReadiness(student) < 65,
).length;

const distribution = [
{ level: "Placement ready", count: readyCount },
{ level: "Almost ready", count: almostReadyCount },
{ level: "Needs training", count: trainingCount },
];

return ( <div className="min-h-screen bg-[#f5f7f4] text-[#25352a]"> <div className="flex min-h-screen"> <aside id="workspace-sidebar" aria-label="Workspace navigation" className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col overflow-y-auto bg-[#193f31] text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}> <div className="flex items-center justify-between px-6 py-7"><Link href="/admin/dashboard" className="flex items-center gap-3"> <div className="rounded-xl border border-white/25 p-2"> <GraduationCap size={24} /> </div> <div> <h2 className="text-xl font-semibold">GrowthTrack</h2> <p className="mt-1 text-[9px] font-semibold tracking-[1.5px] text-[#b4c9ba]">
STUDENT SUCCESS PLATFORM </p> </div> </Link>
<button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation" className="rounded p-1 text-white/75 hover:bg-white/10 lg:hidden"><X size={20} /></button></div>


      <nav className="space-y-1 px-4 pt-5">
        <p className="mb-3 px-3 text-xs font-semibold tracking-[2px] text-[#a5bca9]">
          WORKSPACE
        </p>

        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10"
        >
          <BookOpen size={19} />
          Overview
        </Link>

        <Link
          href="/students"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10"
        >
          <Users size={19} />
          Students
        </Link>

        <Link
          href="/academic-performance"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10"
        >
          <BookOpen size={19} />
          Academic performance
        </Link>

        <Link
          href="/placement-readiness"
          aria-current="page"
          className="flex items-center gap-3 rounded-lg bg-[#315d47] px-4 py-3 text-sm font-semibold text-white"
        >
          <BriefcaseBusiness size={19} />
          Placement readiness
        </Link>

        <Link
          href="/interventions"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10"
        >
          <TrendingUp size={19} />
          Interventions
        </Link>

        <div className="my-6 border-t border-white/15" />

        <p className="mb-3 px-3 text-xs font-semibold tracking-[2px] text-[#a5bca9]">
          ADMINISTRATION
        </p>

        <Link
          href="/settings"
          className="block rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10"
        >
          Settings
        </Link>

        <Link
          href="/help"
          className="block rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10"
        >
          Help and documentation
        </Link>
      </nav>

      <div className="mt-auto border-t border-white/15 p-5">
        <p className="text-sm font-medium">Administrator</p>
        <p className="mt-1 text-xs text-[#a5bca9]">
          GrowthTrack workspace
        </p>
      </div>
    </aside>
    {mobileMenuOpen && <button type="button" aria-label="Close navigation backdrop" className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

    <main className="min-w-0 flex-1">
      <header className="flex min-h-[70px] items-center justify-between border-b border-[#e2e8e2] bg-white px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3 text-xs text-[#758176] sm:text-sm">
          <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation" aria-controls="workspace-sidebar" aria-expanded={mobileMenuOpen} className="shrink-0 rounded-md border border-[#e2e8e2] p-2 text-[#47564b] lg:hidden"><Menu size={19} /></button>
          <span className="truncate whitespace-nowrap">
            Workspace <span className="mx-2">/</span>
            <span className="font-semibold text-[#263b2d]">
              Placement readiness
            </span>
          </span>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-[#edf5ef] px-3 py-2 text-xs font-medium text-[#28684e]">
          Demo data
        </span>
      </header>

      <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
        <section className="mb-8">
          <p className="text-xs font-bold tracking-[2px] text-[#367552]">
            CAREER OUTCOMES
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#213c2d]">
            Placement readiness
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a867c]">
            Evaluate student employability skills, track placement
            preparation, and identify areas where targeted training
            could improve outcomes.
          </p>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Average readiness"
            value={`${averageReadiness}%`}
            description="Average of four skill indicators"
            icon={Target}
          />
          <MetricCard
            title="Placement ready"
            value={String(readyCount)}
            description="Readiness score of 80% or above"
            icon={CheckCircle2}
          />
          <MetricCard
            title="Almost ready"
            value={String(almostReadyCount)}
            description="Readiness score from 65% to 79%"
            icon={TrendingUp}
          />
          <MetricCard
            title="Needs training"
            value={String(trainingCount)}
            description="Readiness score below 65%"
            icon={AlertTriangle}
          />
        </section>

        <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-[#e2e8e2] bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-[#2c4031]">
              Skill performance
            </h2>
            <p className="mt-1 text-xs text-[#89938a]">
              Average scores across the sample student group
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                {
                  name: "Technical skills",
                  score: Math.round(
                    students.reduce((sum, s) => sum + s.technical, 0) /
                      students.length,
                  ),
                  icon: Code2,
                },
                {
                  name: "Aptitude",
                  score: Math.round(
                    students.reduce((sum, s) => sum + s.aptitude, 0) /
                      students.length,
                  ),
                  icon: Brain,
                },
                {
                  name: "Communication",
                  score: Math.round(
                    students.reduce(
                      (sum, s) => sum + s.communication,
                      0,
                    ) / students.length,
                  ),
                  icon: MessageCircle,
                },
                {
                  name: "Interview skills",
                  score: Math.round(
                    students.reduce((sum, s) => sum + s.interview, 0) /
                      students.length,
                  ),
                  icon: BriefcaseBusiness,
                },
              ].map((skill) => {
                const Icon = skill.icon;

                return (
                  <div
                    key={skill.name}
                    className="rounded-lg border border-[#edf0eb] bg-[#fafbf9] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Icon size={18} className="text-[#367552]" />
                      <span className="text-lg font-semibold text-[#2c4031]">
                        {skill.score}%
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-[#69766b]">
                      {skill.name}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8eee8]">
                      <div
                        className="h-full rounded-full bg-[#679678]"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-[#89938a]">
              Skill scores are illustrative and should be replaced with
              validated assessment results.
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8e2] bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-[#2c4031]">
              Readiness distribution
            </h2>
            <p className="mt-1 text-xs text-[#89938a]">
              Number of students in each readiness category
            </p>

            <div className="mt-5 h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={distribution}
                  margin={{ top: 10, right: 8, left: -15, bottom: 5 }}
                >
                  <CartesianGrid
                    stroke="#e9eee8"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="level"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#7c897e", fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#7c897e", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8e2",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Students"
                    fill="#679678"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={65}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-[#edf0eb] pt-4 text-center">
              <div>
                <p className="text-xl font-semibold text-[#28684e]">
                  {readyCount}
                </p>
                <p className="mt-1 text-[10px] text-[#89938a]">Ready</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-amber-600">
                  {almostReadyCount}
                </p>
                <p className="mt-1 text-[10px] text-[#89938a]">Almost ready</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-red-600">
                  {trainingCount}
                </p>
                <p className="mt-1 text-[10px] text-[#89938a]">Training</p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ede7] p-5">
            <div>
              <h2 className="font-semibold text-[#2c4031]">
                Student readiness records
              </h2>
              <p className="mt-1 text-xs text-[#89938a]">
                Review individual readiness scores and skill indicators.
              </p>
            </div>
            <span className="rounded-full bg-[#edf5ef] px-3 py-1.5 text-xs font-medium text-[#28684e]">
              {filteredStudents.length} records
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 border-b border-[#e8ede7] bg-[#fafbf9] p-4 md:grid-cols-3">
            <label className="flex h-10 items-center gap-2 rounded-lg border border-[#dfe6de] bg-white px-3">
              <Search size={16} className="text-[#879287]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student or ID"
                aria-label="Search student records"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>

            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              aria-label="Filter by department"
              className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm outline-none"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={readinessFilter}
              onChange={(event) => setReadinessFilter(event.target.value)}
              aria-label="Filter by readiness"
              className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm outline-none"
            >
              <option value="all">All readiness levels</option>
              <option value="ready">Placement ready</option>
              <option value="almost">Almost ready</option>
              <option value="training">Needs training</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#fafbf9] text-[10px] uppercase tracking-wide text-[#849084]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Student</th>
                  <th className="px-4 py-4 font-semibold">Department</th>
                  <th className="px-4 py-4 font-semibold">Technical</th>
                  <th className="px-4 py-4 font-semibold">Aptitude</th>
                  <th className="px-4 py-4 font-semibold">Communication</th>
                  <th className="px-4 py-4 font-semibold">Readiness</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const score = getReadiness(student);

                  return (
                    <tr
                      key={student.id}
                      className="border-t border-[#edf0eb] hover:bg-[#fafcf9]"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-[#2c4031]">
                          {student.name}
                        </p>
                        <p className="mt-1 text-xs text-[#89938a]">
                          {student.id} · {student.semester}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#59675b]">
                        {student.department}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#59675b]">
                        {student.technical}%
                      </td>
                      <td className="px-4 py-4 text-sm text-[#59675b]">
                        {student.aptitude}%
                      </td>
                      <td className="px-4 py-4 text-sm text-[#59675b]">
                        {student.communication}%
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-[#2c4031]">
                          {score}%
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge score={score} />
                      </td>
                    </tr>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-[#89938a]"
                    >
                      No matching student records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#e8ede7] px-5 py-4 text-xs leading-5 text-[#89938a]">
            Demo data only. Readiness categories are illustrative
            thresholds, not verified predictions of employment outcomes.
          </div>
        </section>

        <footer className="mt-7 flex flex-wrap justify-between gap-2 border-t border-[#e2e8e2] pt-5 text-xs text-[#89938a]">
          <span>GrowthTrack · Student Success Platform</span>
          <span>Placement readiness · Demo analytics</span>
        </footer>
      </div>
    </main>
  </div>
</div>


);
}
