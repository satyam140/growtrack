import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  GraduationCap,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin-page-shell";

type WorkspaceLandingProps = {
  role: "Faculty" | "HOD" | "TPO";
};

const facultyLinks = [
  { label: "Faculty overview", href: "/admin/dashboard", icon: BarChart3 },
  { label: "Students", href: "/students", icon: UsersRound },
  { label: "Attendance Management", href: "/admin/attendance", icon: ClipboardCheck },
  { label: "Academic Performance", href: "/academic-performance", icon: BookOpenCheck },
  { label: "Results", href: "/results", icon: BarChart3 },
  { label: "Interventions", href: "/interventions", icon: ShieldAlert },
];

const hodLinks = [
  { label: "Department overview", href: "/admin/dashboard", icon: BarChart3 },
  { label: "Department students", href: "/students", icon: UsersRound },
  { label: "Attendance analytics", href: "/attendance", icon: ClipboardCheck },
  { label: "Academic performance", href: "/academic-performance", icon: BookOpenCheck },
  { label: "Results and trends", href: "/results", icon: BarChart3 },
  { label: "Students requiring support", href: "/interventions", icon: ShieldAlert },
  { label: "Placement readiness", href: "/placement-readiness", icon: BriefcaseBusiness },
];

const tpoLinks = [
  { label: "Placement readiness", href: "/placement-readiness", icon: BriefcaseBusiness },
  { label: "Students", href: "/students", icon: UsersRound },
  { label: "Academic performance", href: "/academic-performance", icon: BookOpenCheck },
  { label: "Skills and training", href: "/skill-gap", icon: BookOpenCheck },
  { label: "Results and trends", href: "/results", icon: BarChart3 },
  { label: "Students requiring support", href: "/interventions", icon: ShieldAlert },
];

export function WorkspaceLanding({ role }: WorkspaceLandingProps) {
  const links =
    role === "Faculty" ? facultyLinks : role === "HOD" ? hodLinks : tpoLinks;
  const workspaceLabel =
    role === "Faculty"
      ? "FACULTY WORKSPACE"
      : role === "HOD"
        ? "HOD WORKSPACE"
        : "TPO WORKSPACE";
  const heading =
    role === "Faculty"
      ? "Faculty overview"
      : role === "HOD"
        ? "Department overview"
        : "Training and placement overview";
  const description =
    role === "Faculty"
      ? "Use the existing GrowthTrack tools to manage classes, monitor students, and plan timely support."
      : role === "HOD"
        ? "Use the existing GrowthTrack dashboards to review department-level outcomes and coordinate student support."
        : "Use the existing GrowthTrack tools to review readiness, skills, and placement-related student progress.";

  return (
    <AdminPageShell title={`${role} Workspace`}>
      <div className="mx-auto max-w-[1240px] space-y-6">
        <header className="rounded-xl border border-[#dce8df] bg-gradient-to-br from-[#f7fbf7] via-white to-[#eef7f0] px-6 py-7 shadow-[0_8px_24px_rgba(38,85,57,0.05)] sm:px-8">
          <p className="text-[11px] font-bold tracking-[2px] text-[#367552]">{workspaceLabel}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#213c2d] sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#66756a]">
            {description}
          </p>
        </header>

        <section className="rounded-xl border border-[#dfe6de] bg-white p-5 shadow-[0_4px_18px_rgba(38,85,57,0.04)] sm:p-6">
          <div className="flex items-start gap-3 border-b border-[#edf1ed] pb-5">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#e7f1e9] text-[#367552]">
              {role === "Faculty" ? (
                <GraduationCap size={23} />
              ) : role === "HOD" ? (
                <BriefcaseBusiness size={23} />
              ) : (
                <BriefcaseBusiness size={23} />
              )}
            </span>
            <div>
              <h2 className="text-xl font-semibold text-[#213c2d]">Quick access</h2>
              <p className="mt-1 text-sm leading-6 text-[#7a867c]">
                Jump directly to the student insights and workflows you use most.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={href + label}
                href={href}
                className="group flex min-h-[82px] items-center justify-between gap-3 rounded-xl border border-[#e1e9e1] bg-[#fcfefc] px-4 py-4 transition duration-200 hover:-translate-y-1 hover:border-[#9fc8aa] hover:bg-[#f5faf6] hover:shadow-[0_10px_22px_rgba(38,85,57,0.1)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7eae8b] focus-visible:ring-offset-2"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#e7f1e9] text-[#367552] transition duration-200 group-hover:bg-[#d5e9da] group-hover:text-[#28654d]">
                    <Icon size={18} />
                  </span>
                  <span className="text-[15px] font-semibold text-[#405345]">{label}</span>
                </span>
                <ArrowRight size={16} className="text-[#7a867c] transition duration-200 group-hover:translate-x-1 group-hover:text-[#28654d]" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}
