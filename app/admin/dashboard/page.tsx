
"use client";

<<<<<<< HEAD
import { DashboardStrip } from "@/components/forecast/dashboard-strip";
import { AdminPageShell } from "@/components/admin-page-shell";
import Link from "next/link";
import { useMemo, useState } from "react";
=======
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
<<<<<<< HEAD
  CalendarCheck,
  GraduationCap,
  Search,
=======
  BookOpen,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardCheck,
  ClipboardList,
  ChevronDown,
  CircleHelp,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
<<<<<<< HEAD
import { DataState, PageHeader, Panel } from "@/components/forecast/ui";
import { LevelStack } from "@/components/forecast/charts";
import { useScope } from "@/components/role/shared";
import { toAnalyticsStudent } from "@/lib/role-analytics";
import type { ScopeStudent } from "@/lib/data/scope";
import { Pager, usePaged } from "@/components/pager";


const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const round1 = (value: number) => Math.round(value * 10) / 10;

/**
 * Every figure on this page, computed from the students the database returns for the signed-in person (forecast directory plus
 * the facts stored with each forecast), never from files bundled with the app.
 */
function buildDashboard(students: ScopeStudent[]) {
  const people = students.map((s) => ({ s, a: toAnalyticsStudent(s) }));
  const overview = {
    total: students.length,
    averageSuccess: round1(mean(students.map((s) => s.successScore))),
    averageAttendance: round1(mean(students.map((s) => s.attendance))),
    highRisk: students.filter((s) => s.overall === "High").length,
    mediumRisk: students.filter((s) => s.overall === "Medium").length,
  };
  const riskDistribution = [
    { label: "Low risk", level: "Low", color: "bg-[#4b8b65]" },
    { label: "Medium risk", level: "Medium", color: "bg-[#dfa943]" },
    { label: "High risk", level: "High", color: "bg-[#d4665e]" },
  ].map((item) => {
    const count = students.filter((s) => s.overall === item.level).length;
    return { ...item, count, percentage: round1((count / Math.max(1, students.length)) * 100) };
  });
  const attentionStudents = students
    .filter((s) => s.overall === "High")
    .sort((x, y) => x.successScore - y.successScore)
    .map((s) => ({ id: s.id, name: s.name, department: s.department, reason: s.reason || "Low overall success score", score: Math.round(s.successScore), attendance: Math.round(s.attendance), risk: s.overall }));
  const names = [...new Set(students.map((s) => s.department))].sort();
  const departments = names.map((name) => {
    const rows = students.filter((s) => s.department === name);
    return { name, score: Math.round(mean(rows.map((s) => s.successScore))), attendance: Math.round(mean(rows.map((s) => s.attendance))), students: rows.length };
  });
  const rowOf = ({ s, a }: (typeof people)[number]) => ({ id: s.id, name: s.name, department: s.department, risk: s.overall, academicScore: a.academicScore, placementScore: a.placementScore, attendance: a.attendance, engagementScore: a.engagementScore, assignmentCompletion: a.assignmentCompletion });
  const studentSegments = [
    {
      id: "placement", title: "Good marks but weak placement prep", description: "CGPA of 7.0 or more and placement readiness below 65",
      action: "Create a placement-readiness plan: role-focused practice, a mock interview, and a review with the student.",
      actionLabel: "Open placement readiness", href: "/placement-readiness", icon: GraduationCap, color: "border-[#dce8df] bg-[#f5faf6] text-[#28654d]",
      students: people.filter(({ a }) => a.academicScore >= 70 && a.placementScore < 65).map(rowOf),
    },
    {
      id: "disengaged", title: "Disengaged", description: "Engagement below 65, assignments below 60%, or attendance below 65%",
      action: "Arrange a supportive check-in, find the barrier, and agree one small attendance or coursework goal for next week.",
      actionLabel: "Open student directory", href: "/students", icon: Activity, color: "border-[#f1e6ca] bg-[#fffaf0] text-[#946417]",
      students: people.filter(({ a }) => a.engagementScore < 65 || a.assignmentCompletion < 60 || a.attendance < 65).map(rowOf),
    },
    {
      id: "critical", title: "Needs critical support", description: "High forecast risk, CGPA below 5.0, or attendance below 60%",
      action: "Prioritise an advisor review, contact the student promptly, and record a specific support and attendance plan.",
      actionLabel: "Open interventions", href: "/interventions", icon: ShieldAlert, color: "border-[#f0d8d5] bg-[#fff6f5] text-[#a33f38]",
      students: people.filter(({ s, a }) => s.overall === "High" || a.academicScore < 50 || a.attendance < 60).map(rowOf),
    },
  ];
  return { overview, riskDistribution, attentionStudents, departments, studentSegments };
}
=======
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

const navigation = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard, implemented: true },
  { label: "Students", href: "/students", icon: Users, implemented: true },
  {
    label: "Academic performance",
    href: "/academic-performance",
    icon: BookOpen,
    implemented: true,
  },
  {
    label: "Results",
    href: "/results",
    icon: ClipboardList,
    implemented: true,
  },
  {
    label: "Attendance management",
    href: "/admin/attendance",
    icon: ClipboardCheck,
    implemented: true,
  },
  {
    label: "Placement readiness",
    href: "/placement-readiness",
    icon: BriefcaseBusiness,
    implemented: true,
  },
  {
    label: "Interventions",
    href: "/interventions",
    icon: Activity,
    implemented: true,
  },
];

const trendData = [
  { month: "Jan", score: 68 },
  { month: "Feb", score: 71 },
  { month: "Mar", score: 69 },
  { month: "Apr", score: 75 },
  { month: "May", score: 78 },
  { month: "Jun", score: 82 },
];

const attentionStudents = [
  {
    id: "STU-1024",
    name: "Aarav Sharma",
    department: "Computer Science",
    reason: "Low attendance and academic performance",
    score: 48,
    attendance: 62,
    risk: "High",
  },
  {
    id: "STU-1132",
    name: "Rohan Verma",
    department: "Electronics",
    reason: "Attendance below the institutional target",
    score: 42,
    attendance: 58,
    risk: "High",
  },
  {
    id: "STU-1087",
    name: "Priya Patel",
    department: "Information Technology",
    reason: "Placement readiness needs improvement",
    score: 56,
    attendance: 71,
    risk: "Medium",
  },
  {
    id: "STU-1169",
    name: "Ananya Singh",
    department: "Computer Science",
    reason: "Additional technical practice recommended",
    score: 61,
    attendance: 76,
    risk: "Medium",
  },
];

const departments = [
  { name: "Computer Science", score: 79, attendance: 87, students: 680 },
  { name: "Information Technology", score: 77, attendance: 86, students: 540 },
  { name: "Electronics", score: 73, attendance: 82, students: 460 },
  { name: "Mechanical Engineering", score: 75, attendance: 84, students: 800 },
];

const studentSegments = [
  {
    id: "placement",
    title: "Good marks but weak placement prep",
    description: "Academic score ≥ 70 and placement score < 65",
    action:
      "Create a placement-readiness plan: assign role-focused practice, schedule a mock interview, and review progress with the student.",
    actionLabel: "Open placement readiness",
    href: "/placement-readiness",
    icon: GraduationCap,
    color: "border-[#dce8df] bg-[#f5faf6] text-[#28654d]",
    students: studentProfiles.filter(
      (student) =>
        student.academicScore >= 70 && student.placementScore < 65,
    ),
  },
  {
    id: "disengaged",
    title: "Disengaged",
    description:
      "Engagement score < 65, assignment completion < 60, or attendance < 65",
    action:
      "Arrange a supportive check-in, identify barriers to participation, and agree on one small attendance or coursework goal to review next week.",
    actionLabel: "Open student directory",
    href: "/students",
    icon: Activity,
    color: "border-[#f1e6ca] bg-[#fffaf0] text-[#946417]",
    students: studentProfiles.filter(
      (student) =>
        student.engagementScore < 65 ||
        student.assignmentCompletion < 60 ||
        student.attendance < 65,
    ),
  },
  {
    id: "critical",
    title: "Needs critical support",
    description: "High risk, academic score < 50, or attendance < 60",
    action:
      "Prioritize a faculty/advisor review, contact the student promptly, and document a specific academic support and attendance follow-up plan.",
    actionLabel: "Open interventions",
    href: "/interventions",
    icon: ShieldAlert,
    color: "border-[#f0d8d5] bg-[#fff6f5] text-[#a33f38]",
    students: studentProfiles.filter(
      (student) =>
        student.risk === "High" ||
        student.academicScore < 50 ||
        student.attendance < 60,
    ),
  },
];
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  change?: string;
  positive?: boolean;
  icon: typeof Users;
};

function MetricCard({
  title,
  value,
  description,
  change,
  positive = true,
  icon: Icon,
}: MetricCardProps) {
  return (
    <section className="rounded-md border border-[#e2e7df] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
<<<<<<< HEAD
        <p className="text-[14.5px] text-[#4b564e]">{title}</p>
=======
        <p className="text-[12px] text-[#737e74]">{title}</p>
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#edf4ef] text-[#28684e]">
          <Icon size={18} strokeWidth={1.8} />
        </span>
      </div>

      <p className="mt-3 text-[29px] font-semibold tracking-[-1px] text-[#252f28]">
        {value}
      </p>

<<<<<<< HEAD
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px]">
=======
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              positive ? "text-[#26724e]" : "text-[#bd5149]"
            }`}
          >
            {positive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}
            {change}
          </span>
        )}
<<<<<<< HEAD
        <span className="text-[#556057]">{description}</span>
=======
        <span className="text-[#879087]">{description}</span>
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
      </div>
    </section>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const classes =
    risk === "High"
      ? "bg-[#f9e9e7] text-[#a33f38]"
      : risk === "Medium"
        ? "bg-[#fbf1dc] text-[#946417]"
        : "bg-[#e8f1eb] text-[#28654d]";

  return (
    <span
<<<<<<< HEAD
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-1 text-[13px] font-semibold ${classes}`}
=======
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-1 text-[10px] font-semibold ${classes}`}
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          risk === "High"
            ? "bg-[#bf5a52]"
            : risk === "Medium"
              ? "bg-[#c18a2c]"
              : "bg-[#4c9169]"
        }`}
      />
      {risk} risk
    </span>
  );
}

export default function AdminDashboard() {
<<<<<<< HEAD
  const scope = useScope();
  return (
    <AdminPageShell title="Overview">
      <PageHeader
        eyebrow="INSTITUTIONAL OVERVIEW"
        title="Student success dashboard"
        subtitle="Monitor performance, identify risk early, and help every student progress."
      />
      <DashboardStrip />
      <DataState state={scope} skeletonRows={4} empty={{ when: (d) => d.length === 0, title: "No student data yet", hint: "Students appear here once they are in the database and their forecast is loaded." }}>
        {(students) => <DashboardBody students={students} />}
      </DataState>
    </AdminPageShell>
  );
}

function DashboardBody({ students }: { students: ScopeStudent[] }) {
  const { overview, riskDistribution, attentionStudents, departments, studentSegments } = useMemo(() => buildDashboard(students), [students]);
  const [search, setSearch] = useState("");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

  const filteredStudents = attentionStudents.filter((student) => {
    const query = search.trim().toLowerCase();
    return student.name.toLowerCase().includes(query) || student.id.toLowerCase().includes(query) || student.department.toLowerCase().includes(query);
  });
  const pagedAttention = usePaged(filteredStudents, search, 10);
  const selectedSegment = studentSegments.find((segment) => segment.id === selectedSegmentId);
  const pagedSegment = usePaged(selectedSegment?.students ?? [], selectedSegmentId ?? "", 12);

  return (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MetricCard
                title="Average success score"
                value={String(overview.averageSuccess)}
=======
  const pathname = usePathname();
  const [period, setPeriod] = useState("Last 6 months");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
    null,
  );

  function toggleNavigation() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarCollapsed((collapsed) => !collapsed);
    } else {
      setMobileMenuOpen((open) => !open);
    }
  }

  const filteredStudents = attentionStudents.filter((student) => {
    const query = search.trim().toLowerCase();

    return (
      student.name.toLowerCase().includes(query) ||
      student.id.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query)
    );
  });
  const selectedSegment = studentSegments.find(
    (segment) => segment.id === selectedSegmentId,
  );

  function handleUnavailableSection(label: string) {
    setNotice(`${label} is planned for the next development step.`);
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#252f28]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          id="admin-dashboard-sidebar"
          className={`fixed bottom-0 left-0 top-[66px] z-40 flex w-[252px] flex-col overflow-hidden bg-[#193f31] text-white transition-[transform,width,opacity] duration-200 lg:sticky lg:inset-y-0 lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            sidebarCollapsed
              ? "lg:w-0 lg:opacity-0"
              : "lg:w-[252px] lg:opacity-100"
          }`}
        >
          <div className="flex h-[96px] items-center justify-between px-6">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25">
                <GraduationCap size={24} strokeWidth={1.7} />
              </span>
              <span>
                <span className="block text-[20px] font-semibold tracking-[-0.6px]">
                  GrowthTrack
                </span>
                <span className="mt-1 block text-[9px] font-semibold tracking-[1.5px] text-[#a7beb0]">
                  STUDENT SUCCESS PLATFORM
                </span>
              </span>
            </Link>

          </div>

          <nav className="flex-1 px-[18px] pt-7">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[1.5px] text-[#9cb5a6]">
              WORKSPACE
            </p>

            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                if (item.implemented) {
                  return (
                    <Link
                      href={item.href}
                      key={item.label}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex min-h-[43px] items-center gap-3 rounded-md px-3 text-[12px] transition-colors ${
                        active
                          ? "bg-[#315c47] font-semibold text-white"
                          : "text-[#c2d2c7] hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r bg-[#b5d7bd]" />
                      )}
                      <Icon size={18} strokeWidth={1.7} />
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleUnavailableSection(item.label)}
                    title="Planned for a later development step"
                    className="flex min-h-[43px] w-full items-center gap-3 rounded-md px-3 text-left text-[12px] text-[#c2d2c7] transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Icon size={18} strokeWidth={1.7} />
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="my-6 border-t border-white/10" />

            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[1.5px] text-[#9cb5a6]">
              ADMINISTRATION
            </p>

            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              aria-current={pathname === "/settings" ? "page" : undefined}
              className={`flex min-h-[43px] w-full items-center gap-3 rounded-md px-3 text-left text-[12px] transition-colors ${
                pathname === "/settings"
                  ? "bg-[#315c47] font-semibold text-white"
                  : "text-[#c2d2c7] hover:bg-white/10 hover:text-white"
              }`}
            >
              <Settings size={18} strokeWidth={1.7} />
              Settings
            </Link>

            <Link
              href="/help"
              onClick={() => setMobileMenuOpen(false)}
              aria-current={pathname === "/help" ? "page" : undefined}
              className={`flex min-h-[43px] w-full items-center gap-3 rounded-md px-3 text-left text-[12px] transition-colors ${
                pathname === "/help"
                  ? "bg-[#315c47] font-semibold text-white"
                  : "text-[#c2d2c7] hover:bg-white/10 hover:text-white"
              }`}
            >
              <CircleHelp size={18} strokeWidth={1.7} />
              Help and documentation
            </Link>

          </nav>

          <div className="border-t border-white/10 p-5">
            <div className="flex items-center gap-3 rounded-md bg-white/[0.06] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9e7dc] text-[12px] font-semibold text-[#234b38]">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold">Administrator</p>
                <p className="mt-1 text-[10px] text-[#a8bfb0]">
                  Demo workspace
                </p>
              </div>
              <ShieldAlert size={16} className="text-[#a8bfb0]" />
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <button
            aria-label="Close navigation backdrop"
            className="fixed bottom-0 left-0 right-0 top-[66px] z-10 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Top header */}
          <header className="sticky top-0 z-20 flex h-[66px] items-center justify-between border-b border-[#e2e7df] bg-white px-4 sm:px-7 lg:px-9">
            <div className="flex items-center gap-3">
              <button
                className="rounded-md border border-[#e2e7df] p-2 text-[#47564b]"
                onClick={toggleNavigation}
                aria-label="Toggle navigation"
                aria-controls="admin-dashboard-sidebar"
                title="Show or hide navigation"
              >
                <Menu size={19} />
              </button>
              <div className="flex items-center gap-3 text-[12px]">
                <span className="text-[#879087]">Workspace</span>
                <span className="text-[#c3c9c1]">/</span>
                <span className="font-semibold text-[#2b382e]">Overview</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <span className="inline-flex items-center gap-2 rounded border border-[#dce8df] bg-[#f5faf6] px-2.5 py-2 text-[10px] text-[#28654d] sm:px-3 sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4c9169]" />
                Demo data
              </span>
              <span className="hidden border-l border-[#e3e7e1] pl-5 text-[11px] text-[#737e74] sm:block">
                Academic year 2026–27
              </span>
              <Link
                href="/"
                aria-label="Logout"
                title="Logout"
                className="inline-flex items-center gap-2 rounded-md border border-[#dfe5dc] px-3 py-2 text-[11px] font-medium text-[#47564b] transition hover:bg-[#f5f7f4] hover:text-[#193f31]"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </Link>
            </div>
          </header>

          <main className="mx-auto max-w-[1580px] px-4 pb-10 pt-7 sm:px-7 lg:px-9">
            {/* Page title */}
            <section className="mb-7 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-2 text-[10px] font-bold tracking-[1.7px] text-[#28684e]">
                  INSTITUTIONAL OVERVIEW
                </p>
                <h1 className="text-[27px] font-semibold leading-tight tracking-[-1px] sm:text-[30px]">
                  Student success dashboard
                </h1>
                <p className="mt-2 text-[12px] leading-5 text-[#7a847b]">
                  Monitor performance, identify risk early, and help every
                  student progress.
                </p>
              </div>

              <label className="relative flex h-9 items-center gap-2 rounded-md border border-[#dfe5dc] bg-white px-3 text-[11px] text-[#4e5d52]">
                <CalendarCheck size={15} />
                <select
                  aria-label="Dashboard time period"
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  className="max-w-[125px] appearance-none bg-transparent pr-5 outline-none"
                >
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>Last 12 months</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3"
                />
              </label>
            </section>

            {notice && (
              <div
                role="status"
                className="mb-5 flex items-center justify-between gap-3 rounded-md border border-[#dce8df] bg-[#f5faf6] px-4 py-3 text-[12px] text-[#28654d]"
              >
                <span>{notice}</span>
                <button
                  onClick={() => setNotice("")}
                  aria-label="Dismiss notice"
                  className="shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* KPI cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Total students"
                value="2,480"
                change="+8.2%"
                description="vs. previous semester"
                icon={Users}
              />
              <MetricCard
                title="Average success score"
                value="76.4"
                change="+4.6%"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                description="out of 100 points"
                icon={GraduationCap}
              />
              <MetricCard
                title="Attendance rate"
<<<<<<< HEAD
                value={`${overview.averageAttendance}%`}
                description="average across all students, semester 5"
                icon={CalendarCheck}
              />
            </section>

            {/* Distribution */}
            <section className="mt-[18px]">
              <Panel title="Student distribution" subtitle="Students at each overall forecast risk level. Risk levels help prioritise support; they do not label students.">
                <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-center">
                  <div>
                    <p className="text-[44px] font-bold leading-none text-[#1f2c24]">{overview.total.toLocaleString()}</p>
                    <p className="mt-1 text-[15px] text-[#4b564e]">students assessed</p>
                  </div>
                  <LevelStack
                    label="Overall risk"
                    counts={{ Low: riskDistribution[0].count, Medium: riskDistribution[1].count, High: riskDistribution[2].count }}
                  />
                </div>
              </Panel>
=======
                value="84.7%"
                change="-1.3%"
                positive={false}
                description="institution-wide average"
                icon={CalendarCheck}
              />
              <MetricCard
                title="Students at risk"
                value="186"
                change="7.5%"
                positive={false}
                description="require timely review"
                icon={ShieldAlert}
              />
            </section>

            {/* Charts */}
            <section className="mt-[18px] grid grid-cols-1 gap-[18px] xl:grid-cols-[1.65fr_1fr]">
              <div className="min-w-0 rounded-md border border-[#e2e7df] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[13px] font-semibold">
                      Success score trend
                    </h2>
                    <p className="mt-2 text-[11px] text-[#7b857c]">
                      Average student success score over time
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#758077]">
                    <span className="h-[3px] w-4 rounded bg-[#28684e]" />
                    Success score
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-3">
                  <p className="text-[28px] font-semibold tracking-[-0.8px]">
                    82<span className="text-[13px] font-normal text-[#899289]">/100</span>
                  </p>
                  <span className="mb-1 inline-flex items-center gap-1 text-[10px] text-[#28684e]">
                    <ArrowUpRight size={14} />
                    14 points since January
                  </span>
                </div>

                <div className="mt-3 h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="#e8ece6"
                        strokeDasharray="3 4"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#818b81", fontSize: 11 }}
                        dy={8}
                      />
                      <YAxis
                        domain={[40, 100]}
                        ticks={[40, 60, 80, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#818b81", fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}/100`, "Success score"]}
                        contentStyle={{
                          border: "1px solid #e2e7df",
                          borderRadius: "5px",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#28684e"
                        strokeWidth={2.5}
                        dot={{
                          r: 2.5,
                          fill: "#28684e",
                          stroke: "#ffffff",
                          strokeWidth: 1.5,
                        }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex justify-between border-t border-[#edf0eb] pt-3 text-[9px] text-[#939b93]">
                  <span>Source: academic and engagement records</span>
                  <span>Illustrative data</span>
                </div>
              </div>

              <div className="rounded-md border border-[#e2e7df] bg-white p-5">
                <h2 className="text-[13px] font-semibold">
                  Student distribution
                </h2>
                <p className="mt-2 text-[11px] text-[#7b857c]">
                  By current success score
                </p>

                <div className="mt-7 flex items-baseline gap-3">
                  <span className="text-[27px] font-semibold tracking-[-0.8px]">
                    2,480
                  </span>
                  <span className="text-[10px] text-[#7b857c]">
                    students assessed
                  </span>
                </div>

                <div
                  className="mt-5 flex h-[9px] gap-[3px] overflow-hidden rounded-sm"
                  aria-label="65 percent on track, 27.5 percent needs attention, 7.5 percent high risk"
                >
                  <div className="h-full bg-[#4b8b65]" style={{ width: "65%" }} />
                  <div className="h-full bg-[#dfa943]" style={{ width: "27.5%" }} />
                  <div className="h-full bg-[#d4665e]" style={{ width: "7.5%" }} />
                </div>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      label: "On track",
                      count: "1,612",
                      percentage: "65%",
                      color: "bg-[#4b8b65]",
                    },
                    {
                      label: "Needs attention",
                      count: "682",
                      percentage: "27.5%",
                      color: "bg-[#dfa943]",
                    },
                    {
                      label: "High risk",
                      count: "186",
                      percentage: "7.5%",
                      color: "bg-[#d4665e]",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 text-[11px]"
                    >
                      <span className="flex items-center gap-2 text-[#667168]">
                        <span className={`h-2 w-2 rounded-sm ${item.color}`} />
                        {item.label}
                      </span>
                      <span className="flex items-center gap-4">
                        <strong className="font-semibold text-[#344037]">
                          {item.count}
                        </strong>
                        <span className="w-10 text-right text-[#899289]">
                          {item.percentage}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-start gap-2 rounded border border-[#dce9df] bg-[#f5faf6] p-3 text-[10px] leading-5 text-[#28654d]">
                  <ShieldAlert size={15} className="mt-0.5 shrink-0" />
                  Risk levels help prioritize support, not label students.
                </div>
              </div>
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
            </section>

            {/* Student groups */}
            <section className="mt-[18px] overflow-hidden rounded-md border border-[#e2e7df] bg-white">
              <div className="border-b border-[#edf0eb] px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
<<<<<<< HEAD
                    <h2 className="text-[15px] font-semibold">
                      Student groups (segments)
                    </h2>
                    <p className="mt-2 max-w-2xl text-[14px] leading-5 text-[#4b564e]">
=======
                    <h2 className="text-[13px] font-semibold">
                      Student groups (segments)
                    </h2>
                    <p className="mt-2 max-w-2xl text-[11px] leading-5 text-[#7b857c]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                      Select a group to review matching students and a suggested
                      support action. Students can appear in more than one
                      segment because the signals are independent.
                    </p>
                  </div>
<<<<<<< HEAD
                  <span className="rounded bg-[#f0f2ee] px-2 py-1 text-[12.5px] text-[#637066]">
                    {overview.total} students
=======
                  <span className="rounded bg-[#f0f2ee] px-2 py-1 text-[9px] text-[#637066]">
                    {studentProfiles.length} sample profiles
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                  </span>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
                {studentSegments.map((segment) => {
                  const Icon = segment.icon;
                  const selected = selectedSegmentId === segment.id;
                  return (
                    <button
                      key={segment.id}
                      type="button"
                      aria-expanded={selected}
                      onClick={() =>
                        setSelectedSegmentId(selected ? null : segment.id)
                      }
                      className={`rounded-md border p-4 text-left transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57906f] ${
                        selected
                          ? "border-[#28684e] ring-1 ring-[#28684e]"
                          : "border-[#e5e9e3]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
<<<<<<< HEAD
                          <p className="text-[14.5px] font-semibold text-[#344037]">
                            {segment.title}
                          </p>
                          <p className="mt-2 text-[13px] leading-4 text-[#4b564e]">
=======
                          <p className="text-[12px] font-semibold text-[#344037]">
                            {segment.title}
                          </p>
                          <p className="mt-2 text-[10px] leading-4 text-[#7b857c]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                            {segment.description}
                          </p>
                        </div>
                        <span className={`rounded-md p-2 ${segment.color}`}>
                          <Icon size={18} />
                        </span>
                      </div>
                      <div className="mt-5 flex items-end justify-between">
                        <span className="text-[28px] font-semibold tracking-[-0.8px] text-[#25352a]">
                          {segment.students.length}
                        </span>
<<<<<<< HEAD
                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#28684e]">
=======
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#28684e]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                          {selected ? "Hide students" : "View students"}
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedSegment && (
                <div className="border-t border-[#edf0eb] bg-[#fbfcfa] p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
<<<<<<< HEAD
                      <p className="text-[15px] font-semibold text-[#344037]">
=======
                      <p className="text-[13px] font-semibold text-[#344037]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                        {selectedSegment.title} ·{" "}
                        {selectedSegment.students.length} students
                      </p>
                      <div className="mt-3 max-w-4xl rounded-md border border-[#dce9df] bg-[#f5faf6] p-4">
<<<<<<< HEAD
                        <p className="text-[13px] font-bold uppercase tracking-wide text-[#28654d]">
                          Suggested action
                        </p>
                        <p className="mt-1.5 text-[14px] leading-5 text-[#536056]">
=======
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#28654d]">
                          Suggested action
                        </p>
                        <p className="mt-1.5 text-[11px] leading-5 text-[#536056]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                          {selectedSegment.action}
                        </p>
                        <Link
                          href={selectedSegment.href}
<<<<<<< HEAD
                          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#28684e] hover:underline"
=======
                          className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#28684e] hover:underline"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                        >
                          {selectedSegment.actionLabel}
                          <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedSegmentId(null)}
<<<<<<< HEAD
                      className="rounded-md border border-[#dfe5dc] px-3 py-2 text-[13px] font-medium text-[#536056] hover:bg-white"
=======
                      className="rounded-md border border-[#dfe5dc] px-3 py-2 text-[10px] font-medium text-[#536056] hover:bg-white"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                    >
                      Close group
                    </button>
                  </div>

                  {selectedSegment.students.length > 0 ? (
                    <ul className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
<<<<<<< HEAD
                      {pagedSegment.pageItems.map((student) => (
=======
                      {selectedSegment.students.map((student) => (
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                        <li
                          key={student.id}
                          className="rounded-md border border-[#e5e9e3] bg-white p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
<<<<<<< HEAD
                              <p className="text-[14px] font-semibold text-[#344037]">
                                {student.name}
                              </p>
                              <p className="mt-1 text-[13px] text-[#556057]">
                                {student.id} · {student.department}
                              </p>
                            </div>
                            <span className="whitespace-nowrap rounded bg-[#f0f2ee] px-2 py-1 text-[12.5px] text-[#637066]">
                              {student.risk} risk
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#4b564e]">
=======
                              <p className="text-[11px] font-semibold text-[#344037]">
                                {student.name}
                              </p>
                              <p className="mt-1 text-[10px] text-[#899289]">
                                {student.id} · {student.department}
                              </p>
                            </div>
                            <span className="whitespace-nowrap rounded bg-[#f0f2ee] px-2 py-1 text-[9px] text-[#637066]">
                              {student.risk} risk
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#667168]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                            <span>Academic {student.academicScore}</span>
                            <span>Placement {student.placementScore}</span>
                            <span>Attendance {student.attendance}%</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
<<<<<<< HEAD
                    <p className="mt-4 rounded-md border border-[#e5e9e3] bg-white p-4 text-[14px] text-[#4b564e]">
                      No students currently match this segment.
                    </p>
                  )}
                  <Pager paged={pagedSegment} noun="students" />
=======
                    <p className="mt-4 rounded-md border border-[#e5e9e3] bg-white p-4 text-[11px] text-[#7b857c]">
                      No students currently match this segment.
                    </p>
                  )}
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                </div>
              )}
            </section>

            {/* Students needing attention */}
            <section className="mt-[18px] overflow-hidden rounded-md border border-[#e2e7df] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0eb] px-5 py-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
<<<<<<< HEAD
                    <h2 className="text-[15px] font-semibold">
                      Students requiring attention
                    </h2>
                    <span className="rounded bg-[#f0f2ee] px-2 py-1 text-[12.5px] text-[#637066]">
                      {attentionStudents.length} high risk
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] text-[#4b564e]">
=======
                    <h2 className="text-[13px] font-semibold">
                      Students requiring attention
                    </h2>
                    <span className="rounded bg-[#f0f2ee] px-2 py-1 text-[9px] text-[#637066]">
                      {attentionStudents.length} shown
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-[#7b857c]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                    Review early signals and plan appropriate interventions.
                  </p>
                </div>

                <Link
                  href="/students"
<<<<<<< HEAD
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#28684e] hover:underline"
=======
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#28684e] hover:underline"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                >
                  View all students <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="border-b border-[#edf0eb] bg-[#fbfcfa] p-3 sm:px-5">
<<<<<<< HEAD
                <label className="flex h-9 max-w-md items-center gap-2 rounded border border-[#dfe4dd] bg-white px-3 text-[#556057]">
=======
                <label className="flex h-9 max-w-md items-center gap-2 rounded border border-[#dfe4dd] bg-white px-3 text-[#879087]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                  <Search size={15} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search students, IDs or departments"
<<<<<<< HEAD
                    className="w-full bg-transparent text-[14px] text-[#303b32] outline-none placeholder:text-[#929a92]"
=======
                    className="w-full bg-transparent text-[11px] text-[#303b32] outline-none placeholder:text-[#929a92]"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                    aria-label="Search students requiring attention"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      aria-label="Clear student search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
<<<<<<< HEAD
                    <tr className="text-[12.5px] font-semibold tracking-[0.4px] text-[#818a81]">
=======
                    <tr className="text-[9px] font-semibold tracking-[0.4px] text-[#818a81]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                      <th className="px-5 py-3">STUDENT</th>
                      <th className="px-4 py-3">REASON FOR REVIEW</th>
                      <th className="px-4 py-3">SUCCESS SCORE</th>
                      <th className="px-4 py-3">ATTENDANCE</th>
                      <th className="px-4 py-3">RISK</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
<<<<<<< HEAD
                    {pagedAttention.pageItems.map((student) => (
=======
                    {filteredStudents.map((student) => (
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                      <tr
                        key={student.id}
                        className="border-t border-[#edf0eb] hover:bg-[#fafbf9]"
                      >
                        <td className="px-5 py-3.5">
<<<<<<< HEAD
                          <div className="font-semibold text-[#344037] text-[14px]">
                            {student.name}
                          </div>
                          <div className="mt-1 text-[12.5px] text-[#929a92]">
                            {student.id} · {student.department}
                          </div>
                        </td>
                        <td className="max-w-[240px] whitespace-normal px-4 py-3.5 text-[13px] leading-5 text-[#4b564e]">
                          {student.reason}
                        </td>
                        <td className="px-4 py-3.5">
                          <strong className="text-[14.5px] text-[#344037]">
                            {student.score}
                          </strong>
                          <span className="text-[13px] text-[#929a92]">
=======
                          <div className="font-semibold text-[#344037] text-[11px]">
                            {student.name}
                          </div>
                          <div className="mt-1 text-[9px] text-[#929a92]">
                            {student.id} · {student.department}
                          </div>
                        </td>
                        <td className="max-w-[240px] whitespace-normal px-4 py-3.5 text-[10px] leading-5 text-[#737e74]">
                          {student.reason}
                        </td>
                        <td className="px-4 py-3.5">
                          <strong className="text-[12px] text-[#344037]">
                            {student.score}
                          </strong>
                          <span className="text-[10px] text-[#929a92]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                            {" "}
                            / 100
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={
                              student.attendance < 75
<<<<<<< HEAD
                                ? "text-[14px] font-semibold text-[#b94f47]"
                                : "text-[14px] text-[#536056]"
=======
                                ? "text-[11px] font-semibold text-[#b94f47]"
                                : "text-[11px] text-[#536056]"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                            }
                          >
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <RiskBadge risk={student.risk} />
                        </td>
                        <td className="px-4 py-3.5">
                          <Link
                            href="/students"
<<<<<<< HEAD
                            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#28684e] hover:underline"
=======
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#28684e] hover:underline"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                          >
                            Review <ArrowRight size={13} />
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
<<<<<<< HEAD
                          className="px-5 py-10 text-center text-[14.5px] text-[#4b564e]"
=======
                          className="px-5 py-10 text-center text-[12px] text-[#7b857c]"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                        >
                          No matching students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

<<<<<<< HEAD
              <div className="border-t border-[#edf0eb] px-4">
                <Pager paged={pagedAttention} noun="students" />
=======
              <div className="border-t border-[#edf0eb] px-5 py-3 text-[10px] text-[#899289]">
                Illustrative student records · Verify against institutional
                data before taking action.
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
              </div>
            </section>

            {/* Department performance */}
            <section className="mt-[18px] overflow-hidden rounded-md border border-[#e2e7df] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0eb] px-5 py-5">
                <div>
<<<<<<< HEAD
                  <h2 className="text-[15px] font-semibold">
                    Department performance
                  </h2>
                  <p className="mt-2 text-[14px] text-[#4b564e]">
                    Compare student success and attendance across departments.
                  </p>
                </div>
                <span className="text-[13px] text-[#556057]">
                  Computed from {overview.total} student records
=======
                  <h2 className="text-[13px] font-semibold">
                    Department performance
                  </h2>
                  <p className="mt-2 text-[11px] text-[#7b857c]">
                    Compare student success and attendance across departments.
                  </p>
                </div>
                <span className="text-[10px] text-[#899289]">
                  Sample comparison
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[570px] border-collapse text-left">
                  <thead>
<<<<<<< HEAD
                    <tr className="text-[12.5px] font-semibold tracking-[0.4px] text-[#818a81]">
=======
                    <tr className="text-[9px] font-semibold tracking-[0.4px] text-[#818a81]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                      <th className="px-5 py-3">DEPARTMENT</th>
                      <th className="px-4 py-3">STUDENTS</th>
                      <th className="px-4 py-3">SUCCESS SCORE</th>
                      <th className="px-4 py-3">ATTENDANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department) => (
                      <tr
                        key={department.name}
                        className="border-t border-[#edf0eb]"
                      >
<<<<<<< HEAD
                        <td className="px-5 py-4 text-[14px] font-medium text-[#344037]">
                          {department.name}
                        </td>
                        <td className="px-4 py-4 text-[14px] text-[#536056]">
=======
                        <td className="px-5 py-4 text-[11px] font-medium text-[#344037]">
                          {department.name}
                        </td>
                        <td className="px-4 py-4 text-[11px] text-[#536056]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                          {department.students.toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
<<<<<<< HEAD
                            <span className="w-7 text-[14px] font-semibold text-[#344037]">
=======
                            <span className="w-7 text-[11px] font-semibold text-[#344037]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                              {department.score}
                            </span>
                            <div className="h-[5px] w-24 overflow-hidden rounded bg-[#edf0eb]">
                              <div
                                className="h-full rounded bg-[#689578]"
                                style={{ width: `${department.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
<<<<<<< HEAD
                        <td className="px-4 py-4 text-[14px] text-[#536056]">
=======
                        <td className="px-4 py-4 text-[11px] text-[#536056]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                          {department.attendance}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

<<<<<<< HEAD
            <footer className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-[#e2e7df] pt-4 text-[13px] text-[#556057]">
              <span>GrowthTrack · Student Success Platform</span>
              <span>Academic year 2026–27</span>
            </footer>
          </>
=======
            <footer className="mt-7 flex flex-wrap items-center justify-between gap-2 border-t border-[#e2e7df] pt-4 text-[10px] text-[#899289]">
              <span>GrowthTrack · Student Success Platform</span>
              <span>Demo analytics · Academic year 2026–27</span>
            </footer>
          </main>
        </div>
      </div>
    </div>
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
  );
}