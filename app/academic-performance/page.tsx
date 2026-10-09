
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Menu,
  Printer,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  X,
  AlertTriangle,
  Clock3,
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
import { studentProfiles } from "@/lib/students";
import {
  readAcademicUpdates,
  saveAcademicUpdate,
  subscribeToAcademicUpdates,
  type AcademicUpdate,
} from "@/lib/student-portal";

type Subject = {
  name: string;
  score: number;
  previousScore: number;
  target: number;
};

type Student = {
  id: string;
  name: string;
  department: string;
  semester: string;
  score: number;
  previousScore: number;
  attendance: number;
  assessmentsCompleted: number;
  assessmentsTotal: number;
  subjects: Subject[];
  history: { semester: string; score: number }[];
};

const baseStudents: Student[] = [
  {
    id: "STU-1024",
    name: "Aarav Sharma",
    department: "Computer Science",
    semester: "Semester 6",
    score: 48,
    previousScore: 55,
    attendance: 68,
    assessmentsCompleted: 7,
    assessmentsTotal: 10,
    subjects: [
      { name: "Data Structures", score: 42, previousScore: 51, target: 60 },
      { name: "Database Systems", score: 58, previousScore: 54, target: 60 },
      { name: "Operating Systems", score: 45, previousScore: 52, target: 60 },
      { name: "Computer Networks", score: 51, previousScore: 57, target: 60 },
      { name: "Mathematics", score: 44, previousScore: 61, target: 60 },
    ],
    history: [
      { semester: "Sem 2", score: 62 },
      { semester: "Sem 3", score: 59 },
      { semester: "Sem 4", score: 57 },
      { semester: "Sem 5", score: 55 },
      { semester: "Sem 6", score: 48 },
    ],
  },
  {
    id: "STU-1132",
    name: "Rohan Verma",
    department: "Electronics",
    semester: "Semester 5",
    score: 42,
    previousScore: 49,
    attendance: 62,
    assessmentsCompleted: 6,
    assessmentsTotal: 10,
    subjects: [
      { name: "Digital Electronics", score: 39, previousScore: 48, target: 60 },
      { name: "Circuit Theory", score: 45, previousScore: 52, target: 60 },
      { name: "Signals and Systems", score: 38, previousScore: 43, target: 60 },
      { name: "Mathematics", score: 47, previousScore: 53, target: 60 },
      { name: "Communication Systems", score: 41, previousScore: 49, target: 60 },
    ],
    history: [
      { semester: "Sem 1", score: 55 },
      { semester: "Sem 2", score: 53 },
      { semester: "Sem 3", score: 51 },
      { semester: "Sem 4", score: 49 },
      { semester: "Sem 5", score: 42 },
    ],
  },
  {
    id: "STU-1087",
    name: "Priya Patel",
    department: "Information Technology",
    semester: "Semester 6",
    score: 76,
    previousScore: 72,
    attendance: 91,
    assessmentsCompleted: 9,
    assessmentsTotal: 10,
    subjects: [
      { name: "Data Structures", score: 78, previousScore: 74, target: 70 },
      { name: "Database Systems", score: 84, previousScore: 80, target: 70 },
      { name: "Operating Systems", score: 70, previousScore: 72, target: 70 },
      { name: "Computer Networks", score: 73, previousScore: 69, target: 70 },
      { name: "Mathematics", score: 75, previousScore: 65, target: 70 },
    ],
    history: [
      { semester: "Sem 2", score: 64 },
      { semester: "Sem 3", score: 68 },
      { semester: "Sem 4", score: 70 },
      { semester: "Sem 5", score: 72 },
      { semester: "Sem 6", score: 76 },
    ],
  },
  {
    id: "STU-1169",
    name: "Ananya Singh",
    department: "Computer Science",
    semester: "Semester 4",
    score: 81,
    previousScore: 78,
    attendance: 95,
    assessmentsCompleted: 10,
    assessmentsTotal: 10,
    subjects: [
      { name: "Data Structures", score: 86, previousScore: 82, target: 70 },
      { name: "Database Systems", score: 83, previousScore: 80, target: 70 },
      { name: "Operating Systems", score: 78, previousScore: 77, target: 70 },
      { name: "Computer Networks", score: 79, previousScore: 76, target: 70 },
      { name: "Mathematics", score: 79, previousScore: 75, target: 70 },
    ],
    history: [
      { semester: "Sem 1", score: 70 },
      { semester: "Sem 2", score: 73 },
      { semester: "Sem 3", score: 78 },
      { semester: "Sem 4", score: 81 },
    ],
  },
  {
    id: "STU-1201",
    name: "Kabir Mehta",
    department: "Mechanical Engineering",
    semester: "Semester 3",
    score: 64,
    previousScore: 67,
    attendance: 79,
    assessmentsCompleted: 8,
    assessmentsTotal: 10,
    subjects: [
      { name: "Engineering Mechanics", score: 62, previousScore: 68, target: 65 },
      { name: "Thermodynamics", score: 58, previousScore: 63, target: 65 },
      { name: "Manufacturing", score: 72, previousScore: 70, target: 65 },
      { name: "Mathematics", score: 61, previousScore: 66, target: 65 },
      { name: "Material Science", score: 67, previousScore: 68, target: 65 },
    ],
    history: [
      { semester: "Sem 1", score: 60 },
      { semester: "Sem 2", score: 67 },
      { semester: "Sem 3", score: 64 },
    ],
  },
  {
    id: "STU-1244",
    name: "Ishita Rao",
    department: "Information Technology",
    semester: "Semester 5",
    score: 88,
    previousScore: 84,
    attendance: 97,
    assessmentsCompleted: 10,
    assessmentsTotal: 10,
    subjects: [
      { name: "Data Structures", score: 91, previousScore: 88, target: 75 },
      { name: "Database Systems", score: 89, previousScore: 84, target: 75 },
      { name: "Operating Systems", score: 85, previousScore: 82, target: 75 },
      { name: "Computer Networks", score: 87, previousScore: 83, target: 75 },
      { name: "Mathematics", score: 88, previousScore: 83, target: 75 },
    ],
    history: [
      { semester: "Sem 1", score: 75 },
      { semester: "Sem 2", score: 79 },
      { semester: "Sem 3", score: 81 },
      { semester: "Sem 4", score: 84 },
      { semester: "Sem 5", score: 88 },
    ],
  },
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

const institutionTrend = [
  { semester: "Sem 1", score: 68 },
  { semester: "Sem 2", score: 71 },
  { semester: "Sem 3", score: 73 },
  { semester: "Sem 4", score: 70 },
  { semester: "Sem 5", score: 77 },
  { semester: "Sem 6", score: 81 },
];

function getStatus(score: number) {
  if (score < 50) return "Needs support";
  if (score < 70) return "Developing";
  return "On track";
}

function StatusBadge({ score }: { score: number }) {
  const styles =
    score < 50
      ? "bg-red-50 text-red-700"
      : score < 70
        ? "bg-amber-50 text-amber-700"
        : "bg-green-50 text-green-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {getStatus(score)}
    </span>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="rounded-xl border border-[#e2e8e2] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#718075]">{title}</p>
        <div className="rounded-lg bg-[#edf5ef] p-2.5 text-[#28684e]">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold text-[#203d2e]">{value}</p>
      <p className="mt-2 text-xs text-[#89938a]">{subtitle}</p>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: typeof BookOpen;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#e2e8e2] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-lg bg-[#edf5ef] p-2 text-[#28684e]">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="font-semibold text-[#2c4031]">{title}</h2>
          {subtitle && <p className="mt-1 text-xs leading-5 text-[#89938a]">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function StudentReport({
  student,
  onBack,
}: {
  student: Student;
  onBack: () => void;
}) {
  const improvement = student.score - student.previousScore;
  const belowTarget = student.subjects.filter((subject) => subject.score < subject.target);
  const strongSubjects = student.subjects.filter((subject) => subject.score >= subject.target);
  const decliningSubjects = student.subjects.filter(
    (subject) => subject.score < subject.previousScore,
  );
  const completedRate = Math.round(
    (student.assessmentsCompleted / student.assessmentsTotal) * 100,
  );

  const supportReasons = [
    ...(student.score < 50
      ? [`Overall academic score is ${student.score}%, below the 50% support threshold used in this demo.`]
      : []),
    ...(improvement < 0
      ? [`Overall score decreased by ${Math.abs(improvement)} percentage points compared with the previous result.`]
      : []),
    ...(student.attendance < 75
      ? [`Attendance is ${student.attendance}%, below the 75% monitoring threshold used in this demo.`]
      : []),
    ...(belowTarget.length
      ? [`${belowTarget.length} of ${student.subjects.length} tracked subjects are below their individual target.`]
      : []),
    ...(decliningSubjects.length
      ? [`Scores declined in ${decliningSubjects.length} subject${decliningSubjects.length === 1 ? "" : "s"} compared with previous results.`]
      : []),
    ...(completedRate < 80
      ? [`Only ${student.assessmentsCompleted} of ${student.assessmentsTotal} sample assessments are recorded as completed.`]
      : []),
  ];

  const recommendations = [
    ...(belowTarget.length
      ? [`Arrange focused revision for ${belowTarget.slice(0, 3).map((subject) => subject.name).join(", ")}.`]
      : []),
    ...(student.attendance < 75
      ? ["Meet with the student to understand attendance barriers and agree on an attendance improvement plan."]
      : []),
    ...(decliningSubjects.length
      ? ["Review recent assessment mistakes with the subject faculty and schedule a short follow-up assessment."]
      : []),
    ...(completedRate < 80
      ? ["Confirm whether missing assessments are pending, excused, or require a catch-up plan."]
      : []),
    ...(improvement >= 0 && strongSubjects.length
      ? ["Maintain current study habits and use stronger subjects as a model for revision routines."]
      : []),
    "Set a measurable goal for the next assessment and review progress in two to four weeks.",
  ];

  const overallStatus = getStatus(student.score);
  const developmentText =
    improvement > 0
      ? `The score improved by ${improvement} percentage points since the previous result.`
      : improvement < 0
        ? `The score declined by ${Math.abs(improvement)} percentage points since the previous result; a review of recent assessments is recommended.`
        : "The score is unchanged from the previous result.";

  return (
    <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-[#dfe6de] bg-white px-4 py-2.5 text-sm font-medium text-[#405345] hover:bg-[#f7faf6]"
        >
          <ArrowLeft size={16} />
          Back to academic performance
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#193f31] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#285943]"
        >
          <Printer size={16} />
          Print report
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-[#dfe7dd] bg-white p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf2eb] text-xl font-semibold text-[#28684e]">
              {student.name.split(" ").map((part) => part[0]).join("")}
            </div>
            <div>
              <p className="text-xs font-bold tracking-[1.8px] text-[#367552]">
                INDIVIDUAL STUDENT REPORT
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#213c2d] sm:text-3xl">
                {student.name}
              </h1>
              <p className="mt-2 text-sm text-[#718075]">
                {student.id} · {student.department} · {student.semester}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge score={student.score} />
                <span className="rounded-full bg-[#f4f6f2] px-3 py-1 text-xs text-[#657267]">
                  Demo academic record
                </span>
              </div>
            </div>
          </div>
          <div className="min-w-[160px] rounded-xl bg-[#f6f8f4] p-4">
            <p className="text-xs text-[#718075]">Current average</p>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-4xl font-semibold text-[#203d2e]">{student.score}</span>
              <span className="pb-1 text-sm text-[#89938a]">/ 100</span>
            </div>
            <div className={`mt-2 inline-flex items-center gap-1 text-sm font-medium ${improvement >= 0 ? "text-green-700" : "text-red-700"}`}>
              {improvement >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
              {improvement > 0 ? "+" : ""}{improvement} points vs previous
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Current average"
          value={`${student.score}%`}
          subtitle={`Previous result: ${student.previousScore}%`}
          icon={GraduationCap}
        />
        <MetricCard
          title="Attendance"
          value={`${student.attendance}%`}
          subtitle={student.attendance < 75 ? "Below demo monitoring threshold" : "Meets demo attendance threshold"}
          icon={CalendarCheck}
        />
        <MetricCard
          title="Subjects on target"
          value={`${strongSubjects.length}/${student.subjects.length}`}
          subtitle="At or above individual subject targets"
          icon={Target}
        />
        <MetricCard
          title="Assessments recorded"
          value={`${student.assessmentsCompleted}/${student.assessmentsTotal}`}
          subtitle={`${completedRate}% of sample assessments`}
          icon={ClipboardList}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard
          title="Academic development over time"
          subtitle="Recorded semester averages for this demo student"
          icon={Activity}
        >
          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={student.history} margin={{ top: 10, right: 12, bottom: 5, left: -15 }}>
                <CartesianGrid stroke="#e9eee8" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="semester" tickLine={false} axisLine={false} tick={{ fill: "#7c897e", fontSize: 11 }} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={{ fill: "#7c897e", fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value}/100`, "Score"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8e2", fontSize: 12 }}
                />
                <Line type="monotone" dataKey="score" stroke="#367552" strokeWidth={3} dot={{ r: 4, fill: "#367552" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 rounded-lg bg-[#f6f8f4] p-4">
            <p className="text-sm font-semibold text-[#2c4031]">Development summary</p>
            <p className="mt-1 text-sm leading-6 text-[#657267]">{developmentText}</p>
            <p className="mt-2 text-xs leading-5 text-[#89938a]">
              This comparison describes the supplied demo scores; it does not establish the cause of a change.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Academic support assessment"
          subtitle="Reasons to investigate based on the displayed sample data"
          icon={HeartHandshake}
        >
          <div className={`rounded-xl border p-4 ${supportReasons.length ? "border-amber-200 bg-amber-50/70" : "border-green-200 bg-green-50/70"}`}>
            <div className="flex items-center gap-2">
              {supportReasons.length ? (
                <AlertTriangle size={18} className="text-amber-700" />
              ) : (
                <CheckCircle2 size={18} className="text-green-700" />
              )}
              <p className={`text-sm font-semibold ${supportReasons.length ? "text-amber-900" : "text-green-900"}`}>
                {supportReasons.length ? `${supportReasons.length} item(s) to review` : "No current support flags"}
              </p>
            </div>
            {supportReasons.length ? (
              <ul className="mt-3 space-y-3">
                {supportReasons.map((reason, index) => (
                  <li key={reason} className="flex items-start gap-2 text-sm leading-5 text-[#586557]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-amber-800">
                      {index + 1}
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm leading-6 text-[#586557]">
                Current sample metrics meet the configured review thresholds. Continue monitoring progress and check in with the student regularly.
              </p>
            )}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#89938a]">
            These flags identify areas for a supportive conversation, not a diagnosis or a final judgment about the student.
          </p>
        </SectionCard>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard
          title="Subject-wise performance"
          subtitle="Current score compared with the individual demo target"
          icon={BookOpen}
        >
          <div className="space-y-5">
            {student.subjects.map((subject) => {
              const gap = subject.target - subject.score;
              const change = subject.score - subject.previousScore;
              const onTarget = gap <= 0;

              return (
                <div key={subject.name}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-[#344638]">{subject.name}</p>
                      <p className="mt-1 text-xs text-[#89938a]">
                        Target {subject.target}% · Previous {subject.previousScore}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#2c4031]">{subject.score}%</p>
                      <p className={`mt-1 text-xs ${change >= 0 ? "text-green-700" : "text-red-700"}`}>
                        {change > 0 ? "+" : ""}{change} pts
                      </p>
                    </div>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-[#edf1ec]">
                    <div
                      className={`h-full rounded-full ${onTarget ? "bg-[#679678]" : "bg-amber-500"}`}
                      style={{ width: `${subject.score}%` }}
                    />
                    <div
                      className="absolute -top-1 h-4 w-0.5 bg-[#263b2d]"
                      style={{ left: `${subject.target}%` }}
                      title={`Target: ${subject.target}%`}
                    />
                  </div>
                  <p className={`mt-1.5 text-xs ${onTarget ? "text-green-700" : "text-amber-700"}`}>
                    {onTarget ? "Target achieved" : `${gap} points below target`}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 border-t border-[#edf0eb] pt-4 text-xs text-[#718075]">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#679678]" />At target</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Below target</span>
            <span className="flex items-center gap-2"><span className="h-3 w-0.5 bg-[#263b2d]" />Target marker</span>
          </div>
        </SectionCard>

        <SectionCard
          title="Strengths and progress"
          subtitle="Recognize what is working alongside areas to improve"
          icon={CheckCircle2}
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-green-100 bg-green-50/60 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-green-900">
                <TrendingUp size={17} /> Subjects meeting target
              </p>
              {strongSubjects.length ? (
                <ul className="mt-3 space-y-2">
                  {strongSubjects.map((subject) => (
                    <li key={subject.name} className="flex items-center justify-between gap-3 text-sm text-[#526354]">
                      <span>{subject.name}</span>
                      <span className="font-semibold">{subject.score}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm leading-5 text-[#657267]">
                  No tracked subject has reached its current demo target yet. Set small milestones and acknowledge incremental improvement.
                </p>
              )}
            </div>
            <div className="rounded-lg border border-[#e6ebe4] bg-[#fafbf9] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#344638]">
                <Activity size={17} /> Improving subjects
              </p>
              {student.subjects.some((subject) => subject.score > subject.previousScore) ? (
                <ul className="mt-3 space-y-2">
                  {student.subjects
                    .filter((subject) => subject.score > subject.previousScore)
                    .map((subject) => (
                      <li key={subject.name} className="flex items-center justify-between gap-3 text-sm text-[#526354]">
                        <span>{subject.name}</span>
                        <span className="font-semibold text-green-700">+{subject.score - subject.previousScore} pts</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm leading-5 text-[#657267]">
                  No subject shows an increase in the sample comparison. Review assessment feedback with the student to identify a helpful next step.
                </p>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Recommended support plan"
          subtitle="Suggested actions to discuss with the student and faculty"
          icon={Lightbulb}
        >
          <ol className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <li key={recommendation} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf5ef] text-xs font-semibold text-[#28684e]">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm leading-6 text-[#4e5e50]">{recommendation}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard
          title="Follow-up plan"
          subtitle="A suggested review schedule, not a saved appointment"
          icon={Clock3}
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-[#e6ebe4] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#89938a]">Within 7 days</p>
              <p className="mt-2 text-sm font-semibold text-[#344638]">Student and faculty check-in</p>
              <p className="mt-1 text-sm leading-5 text-[#718075]">
                Discuss difficult topics, attendance if relevant, and barriers to completing assessments.
              </p>
            </div>
            <div className="rounded-lg border border-[#e6ebe4] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#89938a]">Within 2–4 weeks</p>
              <p className="mt-2 text-sm font-semibold text-[#344638]">Review measurable progress</p>
              <p className="mt-1 text-sm leading-5 text-[#718075]">
                Compare the next assessment with the current baseline and adjust support if necessary.
              </p>
            </div>
            <div className="rounded-lg bg-[#f2f6f0] p-4">
              <p className="text-sm font-semibold text-[#2c4031]">Suggested next target</p>
              <p className="mt-1 text-2xl font-semibold text-[#28684e]">
                {Math.min(100, Math.max(student.score + 5, 50))}%
              </p>
              <p className="mt-1 text-xs leading-5 text-[#718075]">
                A demo goal based on the current score. Faculty should confirm an achievable target with the student.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="rounded-xl border border-[#e2e8e2] bg-white p-5 text-xs leading-5 text-[#89938a]">
        <p className="font-semibold text-[#536354]">Data and interpretation note</p>
        This report currently uses illustrative in-code demo records. Attendance, assessment completion, subject scores, and semester history are examples, not verified student records. Replace them with actual institutional data before using this report for academic decisions.
      </div>
    </div>
  );
}

export default function AcademicPerformancePage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [semester, setSemester] = useState("All semesters");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [academicUpdates, setAcademicUpdates] = useState<AcademicUpdate[]>([]);
  const [editingAcademicStudent, setEditingAcademicStudent] =
    useState<Student | null>(null);
  const [editScore, setEditScore] = useState("");
  const [editFeedback, setEditFeedback] = useState("");
  const [academicNotice, setAcademicNotice] = useState("");

  useEffect(() => {
    const refresh = () => {
      try {
        setAcademicUpdates(readAcademicUpdates());
      } catch (error) {
        setAcademicNotice(
          error instanceof Error
            ? `Could not load saved academic updates: ${error.message}`
            : "Could not load saved academic updates.",
        );
      }
    };

    refresh();
    const unsubscribe = subscribeToAcademicUpdates(refresh);
    return unsubscribe;
  }, []);

  const students = useMemo(
    () =>
      baseStudents.map((record) => {
        const sharedProfile = studentProfiles.find(
          (profile) =>
            profile.id === record.id && profile.name === record.name,
        );
        if (!sharedProfile) return record;

        const update = academicUpdates.find(
          (item) => item.studentId === sharedProfile.id,
        );
        return {
          ...record,
          score: update?.currentScore ?? sharedProfile.academicScore,
          previousScore: update?.previousScore ?? record.previousScore,
        };
      }),
    [academicUpdates],
  );

  function beginAcademicUpdate(student: Student) {
    setEditingAcademicStudent(student);
    setEditScore(String(student.score));
    setEditFeedback(
      academicUpdates.find((item) => item.studentId === student.id)?.feedback ??
        "",
    );
    setAcademicNotice("");
  }

  function saveAcademicResult(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingAcademicStudent) return;
    const linkedProfile = studentProfiles.find(
      (profile) =>
        profile.id === editingAcademicStudent.id &&
        profile.name === editingAcademicStudent.name,
    );
    if (!linkedProfile) {
      setAcademicNotice(
        "This demo record does not have a matching student profile ID and name.",
      );
      return;
    }

    const score = Number(editScore);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      setAcademicNotice("Academic score must be between 0 and 100.");
      return;
    }

    try {
      saveAcademicUpdate(linkedProfile.id, score, editFeedback);
      setAcademicUpdates(readAcademicUpdates());
      setEditingAcademicStudent(null);
      setAcademicNotice(`Academic result saved for ${linkedProfile.name}.`);
    } catch (error) {
      setAcademicNotice(
        error instanceof Error
          ? `Could not save academic result: ${error.message}`
          : "Could not save academic result.",
      );
    }
  }

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All departments" || student.department === department;

      const matchesSemester =
        semester === "All semesters" || student.semester === semester;

      return matchesSearch && matchesDepartment && matchesSemester;
    });
  }, [search, department, semester]);

  const improving = students.filter((student) => student.score > student.previousScore).length;
  const needsSupport = students.filter((student) => student.score < 50).length;
  const selectedStudent = students.find((student) => student.id === selectedStudentId);

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-[#25352a]">
      <div className="flex min-h-screen">
        <aside
          id="workspace-sidebar"
          aria-label="Workspace navigation"
          className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col overflow-y-auto bg-[#193f31] text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-6 py-7">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="rounded-xl border border-white/25 p-2">
                <GraduationCap size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">CampusIQ</h2>
                <p className="mt-1 text-[9px] font-semibold tracking-[1.5px] text-[#b4c9ba]">
                  STUDENT SUCCESS PLATFORM
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
              className="rounded p-1 text-white/75 hover:bg-white/10 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-4 pt-5">
            <p className="mb-3 px-3 text-xs font-semibold tracking-[2px] text-[#a5bca9]">
              WORKSPACE
            </p>
            <nav className="space-y-2">
              <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
                <BookOpen size={19} /> Overview
              </Link>
              <Link href="/students" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
                <Users size={19} /> Students
              </Link>
              <Link href="/academic-performance" aria-current="page" className="flex items-center gap-3 rounded-lg bg-[#315d47] px-4 py-3 text-sm font-semibold text-white">
                <BookOpen size={19} /> Academic performance
              </Link>
              <Link href="/placement-readiness" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
                <GraduationCap size={19} /> Placement readiness
              </Link>
              <Link href="/interventions" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
                <TrendingUp size={19} /> Interventions
              </Link>
            </nav>

            <div className="my-6 border-t border-white/15" />
            <p className="mb-3 px-3 text-xs font-semibold tracking-[2px] text-[#a5bca9]">
              ADMINISTRATION
            </p>
            <nav className="space-y-2">
              <Link href="/settings" className="block rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
                Settings
              </Link>
              <Link href="/help" className="block rounded-lg px-4 py-3 text-sm text-[#d1dfd5] hover:bg-white/10">
                Help and documentation
              </Link>
            </nav>
          </div>

          <div className="mt-auto border-t border-white/15 p-5">
            <p className="text-sm font-medium">Administrator</p>
            <p className="mt-1 text-xs text-[#a5bca9]">CampusIQ workspace</p>
          </div>
        </aside>

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation backdrop"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1">
          <header className="flex min-h-[70px] items-center justify-between border-b border-[#e2e8e2] bg-white px-5 sm:px-8 print:hidden">
            <div className="flex min-w-0 items-center gap-3 text-xs text-[#758176] sm:text-sm">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation"
                aria-controls="workspace-sidebar"
                aria-expanded={mobileMenuOpen}
                className="shrink-0 rounded-md border border-[#e2e8e2] p-2 text-[#47564b] lg:hidden"
              >
                <Menu size={19} />
              </button>
              <span className="truncate whitespace-nowrap">
                Workspace <span className="mx-2">/</span>
                <span className="font-semibold text-[#263b2d]">
                  {selectedStudent ? "Student report" : "Academic performance"}
                </span>
              </span>
            </div>
            <span className="shrink-0 whitespace-nowrap rounded-full bg-[#edf5ef] px-3 py-2 text-xs font-medium text-[#28684e]">
              Demo data
            </span>
          </header>

          {academicNotice && (
            <div
              role="status"
              className="mx-5 mt-4 rounded-md border border-[#dce8df] bg-[#f5faf6] px-4 py-3 text-sm text-[#28654d] sm:mx-8"
            >
              {academicNotice}
            </div>
          )}
          {editingAcademicStudent && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setEditingAcademicStudent(null);
                }
              }}
            >
              <form
                onSubmit={saveAcademicResult}
                aria-labelledby="academic-update-title"
                className="w-full max-w-lg rounded-xl border border-[#e2e8e2] bg-white p-5 shadow-xl sm:p-6"
              >
                <h2
                  id="academic-update-title"
                  className="text-lg font-semibold text-[#2c4031]"
                >
                  Update academic result
                </h2>
                <p className="mt-1 text-sm text-[#748075]">
                  {editingAcademicStudent.name} · {editingAcademicStudent.id}
                </p>
                <label className="mt-5 block text-sm font-medium text-[#46564a]">
                  Current score (0–100)
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    required
                    value={editScore}
                    onChange={(event) => setEditScore(event.target.value)}
                    className="mt-1.5 w-full rounded-md border border-[#dfe5dc] px-3 py-2.5 outline-none focus:border-[#57906f]"
                  />
                </label>
                <label className="mt-4 block text-sm font-medium text-[#46564a]">
                  Feedback for the student
                  <textarea
                    rows={4}
                    value={editFeedback}
                    onChange={(event) => setEditFeedback(event.target.value)}
                    className="mt-1.5 w-full rounded-md border border-[#dfe5dc] px-3 py-2.5 outline-none focus:border-[#57906f]"
                    placeholder="Add optional academic feedback"
                  />
                </label>
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAcademicStudent(null)}
                    className="rounded-md border border-[#dfe5dc] px-4 py-2.5 text-sm font-medium text-[#46564a] hover:bg-[#f5f7f4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-[#28684e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1e573f]"
                  >
                    Save result
                  </button>
                </div>
              </form>
            </div>
          )}

          {selectedStudent ? (
            <StudentReport
              student={selectedStudent}
              onBack={() => setSelectedStudentId(null)}
            />
          ) : (
            <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
              <div className="mb-8">
                <p className="text-xs font-bold tracking-[2px] text-[#367552]">
                  LEARNING ANALYTICS
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#213c2d]">
                  Academic Performance
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a867c]">
                  Monitor academic progress, compare subject results, and identify students who may need additional support.
                </p>
              </div>

              <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard title="Average academic score" value={`${(students.reduce((sum, student) => sum + student.score, 0) / students.length).toFixed(1)}%`} subtitle="Average across sample student records" icon={GraduationCap} />
                <MetricCard title="Subjects monitored" value="5" subtitle="Illustrative tracked subjects per student" icon={BookOpen} />
                <MetricCard title="Students improving" value={String(improving)} subtitle="Compared with previous scores" icon={TrendingUp} />
                <MetricCard title="Need academic support" value={String(needsSupport)} subtitle="Below 50% in sample records" icon={Users} />
              </section>

              <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
                <div className="rounded-xl border border-[#e2e8e2] bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-[#2c4031]">Semester performance trend</h2>
                      <p className="mt-1 text-xs text-[#89938a]">Illustrative institution average across six semesters</p>
                    </div>
                    <span className="rounded-lg bg-[#edf5ef] px-3 py-2 text-sm font-semibold text-[#28684e]">81/100</span>
                  </div>
                  <div className="mt-6 h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={institutionTrend} margin={{ top: 10, right: 10, bottom: 5, left: -15 }}>
                        <CartesianGrid stroke="#e9eee8" strokeDasharray="4 4" vertical={false} />
                        <XAxis dataKey="semester" tickLine={false} axisLine={false} tick={{ fill: "#7c897e", fontSize: 11 }} />
                        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={{ fill: "#7c897e", fontSize: 11 }} />
                        <Tooltip formatter={(value) => [`${value}/100`, "Average score"]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8e2", fontSize: 12 }} />
                        <Line type="monotone" dataKey="score" stroke="#367552" strokeWidth={3} dot={{ r: 4, fill: "#367552" }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="border-t border-[#edf0eb] pt-3 text-xs text-[#89938a]">
                    Sample trend data. Connect actual academic records for institutional results.
                  </p>
                </div>

                <div className="rounded-xl border border-[#e2e8e2] bg-white p-5 sm:p-6">
                  <h2 className="font-semibold text-[#2c4031]">Subject-wise averages</h2>
                  <p className="mt-1 text-xs text-[#89938a]">Average score across the sample student set</p>
                  <div className="mt-7 space-y-6">
                    {[
                      { name: "Data Structures", score: 69.3 },
                      { name: "Database Systems", score: 74.3 },
                      { name: "Operating Systems", score: 65.0 },
                      { name: "Computer Networks", score: 67.8 },
                      { name: "Mathematics", score: 64.0 },
                    ].map((subject) => (
                      <div key={subject.name}>
                        <div className="mb-2 flex justify-between gap-3 text-sm">
                          <span className="text-[#4b5c4e]">{subject.name}</span>
                          <span className="font-semibold text-[#2c4031]">{subject.score.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#edf1ec]">
                          <div className={`h-full rounded-full ${subject.score < 70 ? "bg-amber-500" : "bg-[#679678]"}`} style={{ width: `${subject.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-[#e2e8e2] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ede7] p-5">
                  <div>
                    <h2 className="font-semibold text-[#2c4031]">Student academic records</h2>
                    <p className="mt-1 text-xs text-[#89938a]">Search and filter sample records, then open a student&apos;s individual report.</p>
                  </div>
                  <span className="rounded-full bg-[#edf5ef] px-3 py-1.5 text-xs font-medium text-[#28684e]">
                    {filteredStudents.length} students
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 border-b border-[#e8ede7] bg-[#fafbf9] p-4 md:grid-cols-[1fr_220px_180px]">
                  <label className="flex h-10 items-center gap-2 rounded-lg border border-[#dfe6de] bg-white px-3">
                    <Search size={16} className="text-[#879287]" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search name, ID, or department"
                      aria-label="Search students"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />
                  </label>
                  <select value={department} onChange={(event) => setDepartment(event.target.value)} aria-label="Filter by department" className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm outline-none focus:border-[#367552]">
                    {departments.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <select value={semester} onChange={(event) => setSemester(event.target.value)} aria-label="Filter by semester" className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm outline-none focus:border-[#367552]">
                    {semesters.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left">
                    <thead className="bg-[#fafbf9] text-[11px] uppercase tracking-wide text-[#849084]">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Student</th>
                        <th className="px-4 py-4 font-semibold">Department</th>
                        <th className="px-4 py-4 font-semibold">Semester</th>
                        <th className="px-4 py-4 font-semibold">Current score</th>
                        <th className="px-4 py-4 font-semibold">Previous score</th>
                        <th className="px-4 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => {
                        const improved = student.score > student.previousScore;
                        return (
                          <tr key={student.id} className="border-t border-[#edf0eb] hover:bg-[#fafcf9]">
                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-[#2c4031]">{student.name}</p>
                              <p className="mt-1 text-xs text-[#89938a]">{student.id}</p>
                            </td>
                            <td className="px-4 py-4 text-sm text-[#59675b]">{student.department}</td>
                            <td className="px-4 py-4 text-sm text-[#59675b]">{student.semester}</td>
                            <td className="px-4 py-4 text-sm font-semibold">{student.score}%</td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center gap-1 text-sm text-[#59675b]">
                                {student.previousScore}%
                                {improved ? <TrendingUp size={14} className="text-green-700" /> : <TrendingDown size={14} className="text-red-600" />}
                              </span>
                            </td>
                            <td className="px-4 py-4"><StatusBadge score={student.score} /></td>
                            <td className="px-5 py-4 text-right">
                              {studentProfiles.some(
                                (profile) =>
                                  profile.id === student.id &&
                                  profile.name === student.name,
                              ) && (
                                <button
                                  type="button"
                                  onClick={() => beginAcademicUpdate(student)}
                                  className="mr-2 inline-flex items-center gap-1.5 rounded-lg border border-[#dfe6de] bg-white px-3 py-2 text-sm font-medium text-[#405345] transition hover:bg-[#f7faf6]"
                                >
                                  Update
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStudentId(student.id);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#cddbcf] bg-white px-3 py-2 text-sm font-medium text-[#28684e] transition hover:bg-[#edf5ef]"
                              >
                                Review <ArrowUpRight size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#89938a]">
                            No matching student records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-[#e8ede7] px-5 py-4 text-xs text-[#89938a]">
                  Demo records only. Review individual circumstances before making academic support decisions.
                </div>
              </section>

              <footer className="mt-7 flex flex-wrap justify-between gap-2 border-t border-[#e2e8e2] pt-5 text-xs text-[#89938a]">
                <span>CampusIQ · Student Success Platform</span>
                <span>Academic Performance · Demo analytics</span>
              </footer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}