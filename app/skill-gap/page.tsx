
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Download,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Skill = {
  name: string;
  current: number;
  required: number;
};

type Student = {
  id: number;
  name: string;
  department: string;
  year: string;
  targetRole: string;
  skills: Skill[];
};

const initialStudents: Student[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    department: "Computer Engineering",
    year: "Final Year",
    targetRole: "Software Developer",
    skills: [
      { name: "Programming", current: 75, required: 90 },
      { name: "Data Structures", current: 60, required: 85 },
      { name: "SQL", current: 70, required: 80 },
      { name: "Communication", current: 65, required: 80 },
      { name: "Problem Solving", current: 70, required: 90 },
    ],
  },
  {
    id: 2,
    name: "Priya Patel",
    department: "Information Technology",
    year: "Final Year",
    targetRole: "Data Analyst",
    skills: [
      { name: "Python", current: 80, required: 85 },
      { name: "SQL", current: 55, required: 90 },
      { name: "Statistics", current: 65, required: 85 },
      { name: "Data Visualization", current: 60, required: 85 },
      { name: "Communication", current: 75, required: 80 },
    ],
  },
  {
    id: 3,
    name: "Rohan Deshmukh",
    department: "Electronics",
    year: "Final Year",
    targetRole: "Embedded Engineer",
    skills: [
      { name: "C/C++", current: 70, required: 90 },
      { name: "Microcontrollers", current: 60, required: 85 },
      { name: "Digital Electronics", current: 80, required: 85 },
      { name: "Debugging", current: 55, required: 80 },
      { name: "Communication", current: 65, required: 75 },
    ],
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    department: "Computer Engineering",
    year: "Third Year",
    targetRole: "Web Developer",
    skills: [
      { name: "HTML/CSS", current: 85, required: 85 },
      { name: "JavaScript", current: 65, required: 90 },
      { name: "React", current: 55, required: 85 },
      { name: "Git", current: 60, required: 80 },
      { name: "Communication", current: 75, required: 80 },
    ],
  },
  {
    id: 5,
    name: "Aditya Singh",
    department: "Information Technology",
    year: "Final Year",
    targetRole: "Software Developer",
    skills: [
      { name: "Programming", current: 85, required: 90 },
      { name: "Data Structures", current: 78, required: 85 },
      { name: "SQL", current: 75, required: 80 },
      { name: "Communication", current: 60, required: 80 },
      { name: "Problem Solving", current: 82, required: 90 },
    ],
  },
  {
    id: 6,
    name: "Isha Mehta",
    department: "Electronics",
    year: "Third Year",
    targetRole: "Data Analyst",
    skills: [
      { name: "Python", current: 60, required: 85 },
      { name: "SQL", current: 65, required: 90 },
      { name: "Statistics", current: 55, required: 85 },
      { name: "Data Visualization", current: 50, required: 85 },
      { name: "Communication", current: 70, required: 80 },
    ],
  },
];

const learningResources: Record<
  string,
  { description: string; resource: string; url: string }
> = {
  Programming: {
    description: "Practice programming fundamentals and coding exercises.",
    resource: "freeCodeCamp",
    url: "https://www.freecodecamp.org/",
  },
  "Data Structures": {
    description: "Learn arrays, linked lists, trees, graphs, and algorithms.",
    resource: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/",
  },
  SQL: {
    description: "Practice SQL queries, joins, grouping, and database design.",
    resource: "SQLBolt",
    url: "https://sqlbolt.com/",
  },
  Communication: {
    description: "Improve speaking, presentations, and professional writing.",
    resource: "Toastmasters",
    url: "https://www.toastmasters.org/",
  },
  "Problem Solving": {
    description: "Build structured problem-solving skills through challenges.",
    resource: "HackerRank",
    url: "https://www.hackerrank.com/",
  },
  Python: {
    description: "Develop Python skills through practical coding exercises.",
    resource: "Python Tutorial",
    url: "https://docs.python.org/3/tutorial/",
  },
  Statistics: {
    description: "Strengthen probability, statistics, and data interpretation.",
    resource: "Khan Academy",
    url: "https://www.khanacademy.org/math/statistics-probability",
  },
  "Data Visualization": {
    description: "Learn to communicate insights through charts and dashboards.",
    resource: "Tableau Learning",
    url: "https://www.tableau.com/learn/training",
  },
  "C/C++": {
    description: "Improve C/C++ programming and memory-management skills.",
    resource: "LearnCpp",
    url: "https://www.learncpp.com/",
  },
  Microcontrollers: {
    description: "Explore embedded programming and microcontroller projects.",
    resource: "Arduino Docs",
    url: "https://docs.arduino.cc/",
  },
  "Digital Electronics": {
    description: "Review logic gates, circuits, and digital systems.",
    resource: "All About Circuits",
    url: "https://www.allaboutcircuits.com/",
  },
  Debugging: {
    description: "Practice identifying errors and systematically testing code.",
    resource: "Visual Studio Code Docs",
    url: "https://code.visualstudio.com/docs",
  },
  "HTML/CSS": {
    description: "Learn accessible HTML and responsive CSS layouts.",
    resource: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
  },
  JavaScript: {
    description: "Practice JavaScript fundamentals and modern language features.",
    resource: "JavaScript.info",
    url: "https://javascript.info/",
  },
  React: {
    description: "Build component-based applications with React.",
    resource: "React Documentation",
    url: "https://react.dev/learn",
  },
  Git: {
    description: "Learn version control, branching, and collaboration.",
    resource: "Git Documentation",
    url: "https://git-scm.com/doc",
  },
};

const departments = [
  "All Departments",
  "Computer Engineering",
  "Information Technology",
  "Electronics",
];

const roles = [
  "All Roles",
  "Software Developer",
  "Data Analyst",
  "Embedded Engineer",
  "Web Developer",
];

function getAverageSkillScore(student: Student) {
  return Math.round(
    student.skills.reduce((sum, skill) => sum + skill.current, 0) /
      student.skills.length
  );
}

function getAverageGap(student: Student) {
  return Math.round(
    student.skills.reduce(
      (sum, skill) => sum + Math.max(0, skill.required - skill.current),
      0
    ) / student.skills.length
  );
}

function getGapCount(student: Student) {
  return student.skills.filter(
    (skill) => skill.required - skill.current >= 15
  ).length;
}

function getGapLabel(gap: number) {
  if (gap <= 5) return "On Track";
  if (gap <= 14) return "Small Gap";
  if (gap <= 24) return "Moderate Gap";
  return "High Priority";
}

function getGapColor(gap: number) {
  if (gap <= 5) return "text-emerald-600 bg-emerald-50";
  if (gap <= 14) return "text-blue-600 bg-blue-50";
  if (gap <= 24) return "text-amber-700 bg-amber-50";
  return "text-rose-600 bg-rose-50";
}

export default function SkillGapPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [role, setRole] = useState("All Roles");
  const [selectedStudentId, setSelectedStudentId] = useState(1);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.targetRole.toLowerCase().includes(normalizedSearch) ||
        student.department.toLowerCase().includes(normalizedSearch);

      const matchesDepartment =
        department === "All Departments" ||
        student.department === department;

      const matchesRole =
        role === "All Roles" || student.targetRole === role;

      return matchesSearch && matchesDepartment && matchesRole;
    });
  }, [students, search, department, role]);

  const selectedStudent = useMemo(
    () =>
      filteredStudents.find((student) => student.id === selectedStudentId) ??
      filteredStudents[0] ??
      null,
    [filteredStudents, selectedStudentId]
  );

  const averageScore = useMemo(() => {
    if (filteredStudents.length === 0) return 0;

    return Math.round(
      filteredStudents.reduce(
        (sum, student) => sum + getAverageSkillScore(student),
        0
      ) / filteredStudents.length
    );
  }, [filteredStudents]);

  const highPriorityCount = useMemo(
    () =>
      filteredStudents.filter((student) => getAverageGap(student) >= 15)
        .length,
    [filteredStudents]
  );

  const skillSummary = useMemo(() => {
    const grouped: Record<string, { current: number[]; required: number[] }> =
      {};

    filteredStudents.forEach((student) => {
      student.skills.forEach((skill) => {
        if (!grouped[skill.name]) {
          grouped[skill.name] = { current: [], required: [] };
        }

        grouped[skill.name].current.push(skill.current);
        grouped[skill.name].required.push(skill.required);
      });
    });

    return Object.entries(grouped)
      .map(([name, values]) => ({
        name,
        current: Math.round(
          values.current.reduce((sum, value) => sum + value, 0) /
            values.current.length
        ),
        required: Math.round(
          values.required.reduce((sum, value) => sum + value, 0) /
            values.required.length
        ),
      }))
      .sort(
        (a, b) =>
          b.required - b.current - (a.required - a.current)
      );
  }, [filteredStudents]);

  const topGaps = skillSummary
    .map((skill) => ({
      ...skill,
      gap: Math.max(0, skill.required - skill.current),
    }))
    .filter((skill) => skill.gap > 0)
    .slice(0, 4);

  const handleReset = () => {
    setSearch("");
    setDepartment("All Departments");
    setRole("All Roles");
    setSelectedStudentId(1);
  };

  const handleExport = () => {
    const headers = [
      "Student",
      "Department",
      "Target Role",
      "Skill",
      "Current Level",
      "Required Level",
      "Gap",
      "Recommendation",
    ];

    const rows = filteredStudents.flatMap((student) =>
      student.skills.map((skill) => [
        student.name,
        student.department,
        student.targetRole,
        skill.name,
        skill.current,
        skill.required,
        Math.max(0, skill.required - skill.current),
        getGapLabel(Math.max(0, skill.required - skill.current)),
      ])
    );

    const csvCell = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "growthtrack-skill-gap-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const updateSkillLevel = (
    studentId: number,
    skillName: string,
    value: number
  ) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.id === studentId
          ? {
              ...student,
              skills: student.skills.map((skill) =>
                skill.name === skillName
                  ? { ...skill, current: value }
                  : skill
              ),
            }
          : student
      )
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <GraduationCap size={18} />
              GrowthTrack / Student Development
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Skill Gap Analysis
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Compare current student skills with target-role requirements,
              identify areas for improvement, and plan focused learning.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={filteredStudents.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Export Report
          </button>
        </header>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<Users size={20} />}
            title="Students Analyzed"
            value={filteredStudents.length.toString()}
            subtitle="Based on current filters"
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <SummaryCard
            icon={<Target size={20} />}
            title="Average Skill Level"
            value={`${averageScore}%`}
            subtitle="Average across selected students"
            iconClass="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={<AlertTriangle size={20} />}
            title="Students Needing Focus"
            value={highPriorityCount.toString()}
            subtitle="Average skill gap of 15 points or more"
            iconClass="bg-amber-50 text-amber-700"
          />

          <SummaryCard
            icon={<TrendingUp size={20} />}
            title="Skills Tracked"
            value={skillSummary.length.toString()}
            subtitle="Unique skills in the current view"
            iconClass="bg-emerald-50 text-emerald-600"
          />
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Explore student skills</h2>
              <p className="mt-1 text-xs text-slate-500">
                Search and filter the sample student dataset.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <RotateCcw size={15} />
              Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, department, or role..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              aria-label="Filter by department"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              aria-label="Filter by target role"
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Chart and priority list */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">
            <div className="mb-5">
              <h2 className="font-semibold">Current vs. required skills</h2>
              <p className="mt-1 text-sm text-slate-500">
                Average skill levels for students matching your filters.
              </p>
            </div>

            {skillSummary.length > 0 ? (
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={skillSummary}
                    margin={{ top: 8, right: 8, left: -18, bottom: 42 }}
                    barGap={4}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      angle={-28}
                      textAnchor="end"
                      interval={0}
                      height={72}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      formatter={(value, name) => [
                        `${value}%`,
                        name === "current" ? "Current level" : "Required level",
                      ]}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ fontSize: "12px", paddingBottom: "16px" }}
                      formatter={(value) =>
                        value === "current"
                          ? "Current level"
                          : "Required level"
                      }
                    />
                    <Bar
                      dataKey="current"
                      name="current"
                      fill="#6366f1"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      dataKey="required"
                      name="required"
                      fill="#cbd5e1"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState message="No skill data matches the selected filters." />
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">Priority skill gaps</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Largest average differences
                </p>
              </div>
              <span className="rounded-lg bg-amber-50 p-2 text-amber-700">
                <AlertTriangle size={18} />
              </span>
            </div>

            {topGaps.length > 0 ? (
              <div className="space-y-5">
                {topGaps.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm font-semibold text-rose-600">
                        -{skill.gap} pts
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-rose-400"
                        style={{
                          width: `${Math.min(skill.gap, 100)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1.5 text-xs text-slate-500">
                      Current {skill.current}% · Target {skill.required}%
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No skill gaps found in this view." />
            )}

            <div className="mt-6 rounded-xl bg-indigo-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
                <BookOpen size={17} />
                Suggested next step
              </div>
              <p className="mt-2 text-sm leading-6 text-indigo-800">
                Focus learning plans on the skills with the largest gaps, then
                reassess proficiency after practice.
              </p>
            </div>
          </div>
        </section>

        {/* Student table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-6">
            <div>
              <h2 className="font-semibold">Student skill overview</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a student to inspect individual skill gaps.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              {filteredStudents.length} student
              {filteredStudents.length === 1 ? "" : "s"}
            </span>
          </div>

          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Department</th>
                    <th className="px-6 py-4 font-semibold">Target role</th>
                    <th className="px-6 py-4 font-semibold">Skill level</th>
                    <th className="px-6 py-4 font-semibold">Average gap</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => {
                    const score = getAverageSkillScore(student);
                    const gap = getAverageGap(student);
                    const isSelected =
                      selectedStudent?.id === student.id;

                    return (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedStudentId(student.id);
                          }
                        }}
                        tabIndex={0}
                        aria-selected={isSelected}
                        className={`cursor-pointer transition hover:bg-indigo-50/50 ${
                          isSelected ? "bg-indigo-50/70" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                              {student.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {student.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {student.year}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {student.department}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {student.targetRole}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="font-medium">{score}%</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-700">
                          {gap} pts
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getGapColor(gap)}`}
                          >
                            {getGapLabel(gap)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState message="No students match your search or filters. Try resetting the filters." />
            </div>
          )}
        </section>

        {/* Selected student details */}
        {selectedStudent && (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                    <GraduationCap size={20} />
                  </div>
                  <h2 className="text-lg font-bold">
                    {selectedStudent.name}&apos;s skill profile
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {selectedStudent.department} · {selectedStudent.targetRole}
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                {selectedStudent.skills.length} skills assessed
              </span>
            </div>

            <div className="space-y-5">
              {selectedStudent.skills.map((skill) => {
                const gap = Math.max(0, skill.required - skill.current);
                const resource = learningResources[skill.name];

                return (
                  <div
                    key={skill.name}
                    className="rounded-xl border border-slate-100 p-4"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="font-semibold">{skill.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Current: {skill.current}% · Required:{" "}
                          {skill.required}%
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${getGapColor(gap)}`}
                      >
                        {gap === 0 ? "Target reached" : `${gap}-point gap`}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <SkillBar
                        label="Current level"
                        value={skill.current}
                        color="bg-indigo-500"
                      />
                      <SkillBar
                        label="Required level"
                        value={skill.required}
                        color="bg-slate-300"
                      />
                    </div>

                    <div className="mt-4 flex flex-col gap-3 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-2">
                        {gap === 0 ? (
                          <CheckCircle2
                            size={17}
                            className="mt-0.5 shrink-0 text-emerald-600"
                          />
                        ) : (
                          <TrendingDown
                            size={17}
                            className="mt-0.5 shrink-0 text-amber-600"
                          />
                        )}

                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {gap === 0
                              ? "Required level achieved"
                              : gap <= 10
                                ? "Small improvement needed"
                                : "Recommended learning focus"}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {resource?.description ??
                              "Continue practicing this skill and reassess your progress."}
                          </p>
                        </div>
                      </div>

                      {resource && gap > 0 && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          {resource.resource} ↗
                        </a>
                      )}
                    </div>

                    {/* Demo control for updating the current skill level */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label
                        htmlFor={`skill-${selectedStudent.id}-${skill.name}`}
                        className="text-xs font-medium text-slate-500"
                      >
                        Update demo level
                      </label>

                      <input
                        id={`skill-${selectedStudent.id}-${skill.name}`}
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={skill.current}
                        onChange={(event) =>
                          updateSkillLevel(
                            selectedStudent.id,
                            skill.name,
                            Number(event.target.value)
                          )
                        }
                        className="w-36 accent-indigo-600"
                      />

                      <span className="min-w-10 text-xs font-semibold text-slate-700">
                        {skill.current}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <footer className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p className="font-semibold">About this analysis</p>
          <p className="mt-1">
            This page uses sample student records and illustrative proficiency
            scores. The current levels, role requirements, gap labels, and
            recommendations are demo data—not verified student assessments or
            AI-generated predictions. Slider changes update the page state
            only and are not saved to a database.
          </p>
        </footer>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconClass}`}>{icon}</div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{subtitle}</p>
    </div>
  );
}

function SkillBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{value}%</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center text-center">
      <Search size={28} className="mb-3 text-slate-300" />
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  );
}
