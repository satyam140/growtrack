import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpenCheck,
  ChartNoAxesCombined,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const adminHighlights = [
  { icon: UsersRound, label: "Student success at a glance" },
  { icon: ChartNoAxesCombined, label: "Cohort insights and trends" },
  { icon: Activity, label: "Early support and interventions" },
];

const studentHighlights = [
  { icon: BookOpenCheck, label: "Your progress, all in one place" },
  { icon: ShieldCheck, label: "Personal goals and next steps" },
  { icon: Sparkles, label: "Practice for what comes next" },
];

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f4f6f1] text-[#203128]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#dcebe0] blur-3xl" />
        <div className="absolute -right-40 top-28 h-[32rem] w-[32rem] rounded-full bg-[#dfe8f8] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3" aria-label="CampusIQ home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#193f31] text-white shadow-lg shadow-[#193f31]/15">
            <GraduationCap size={24} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-[-0.5px]">CampusIQ</span>
            <span className="mt-0.5 block text-[9px] font-bold tracking-[1.7px] text-[#75837a]">
              STUDENT SUCCESS PLATFORM
            </span>
          </span>
        </Link>
        <span className="hidden items-center gap-2 rounded-full border border-[#dbe5dc] bg-white/75 px-3 py-2 text-xs font-medium text-[#52645a] sm:inline-flex">
          <span className="h-2 w-2 rounded-full bg-[#55a477]" />
          One campus. Every next step.
        </span>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce7dd] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#38654b] shadow-sm">
            <Sparkles size={14} />
            A clearer path to student success
          </div>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-1.6px] text-[#1d3026] sm:text-5xl lg:text-[58px]">
            One campus.
            <br />
            <span className="text-[#397653]">Two ways</span> to move forward.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#647269] sm:text-lg sm:leading-8">
            Bring progress into focus. Choose your workspace to explore student
            insights, celebrate growth, and find the right next step.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-[#6d7a71]">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4e9468]" />
              Academic progress
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#547bb2]" />
              Attendance and skills
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#bf9850]" />
              Practical next steps
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DashboardCard
            eyebrow="FOR EDUCATORS"
            title="Admin dashboard"
            description="See the bigger picture, find students who need support, and turn insight into action."
            href="/admin/dashboard"
            action="Enter admin workspace"
            tone="green"
            highlights={adminHighlights}
          />
          <DashboardCard
            eyebrow="FOR STUDENTS"
            title="Student dashboard"
            description="Follow your progress, explore your strengths, and build confidence for what comes next."
            href="/student/dashboard"
            action="Enter student dashboard"
            tone="blue"
            highlights={studentHighlights}
          />
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-2 border-t border-[#dfe5dd] px-5 py-6 text-xs text-[#829087] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p>CampusIQ · Student success, made visible.</p>
        <p>Choose a workspace to get started.</p>
      </footer>
    </main>
  );
}

function DashboardCard({
  eyebrow,
  title,
  description,
  href,
  action,
  tone,
  highlights,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  tone: "green" | "blue";
  highlights: { icon: typeof UsersRound; label: string }[];
}) {
  const palette =
    tone === "green"
      ? {
          accent: "text-[#c7e2ce]",
          icon: "bg-white/10 text-[#d3ead8]",
          buttonBackground: "#f4faf5",
          buttonForeground: "#173f2b",
          border: "border-white/15",
          glow: "bg-[#8fc7a0]/20",
        }
      : {
          accent: "text-[#d0e0ff]",
          icon: "bg-white/10 text-[#d9e6ff]",
          buttonBackground: "#f3f7ff",
          buttonForeground: "#1d3f70",
          border: "border-white/15",
          glow: "bg-[#a8c6ff]/20",
        };

  return (
    <article
      className={`group relative isolate flex min-h-[390px] flex-col overflow-hidden rounded-[26px] border ${palette.border} ${
        tone === "green"
          ? "bg-gradient-to-br from-[#1b4935] via-[#193f31] to-[#102f25]"
          : "bg-gradient-to-br from-[#284c7d] via-[#203f6d] to-[#1c3459]"
      } p-6 text-white shadow-[0_22px_60px_-32px_rgba(24,49,36,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-34px_rgba(24,49,36,0.55)] sm:p-7`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full blur-3xl ${palette.glow}`}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-[10px] font-bold tracking-[1.8px] ${palette.accent}`}>
            {eyebrow}
          </p>
          <h2 className="mt-3 text-[25px] font-semibold tracking-[-0.8px]">
            {title}
          </h2>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${palette.icon}`}>
          <GraduationCap size={23} />
        </span>
      </div>

      <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
        {description}
      </p>

      <ul className="mt-6 space-y-3 border-t border-white/15 pt-5">
        {highlights.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-xs text-white/85">
            <span className={`grid h-7 w-7 place-items-center rounded-lg ${palette.icon}`}>
              <Icon size={14} />
            </span>
            {label}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className="mt-auto inline-flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/70 px-4 text-sm font-bold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        style={{
          backgroundColor: palette.buttonBackground,
          color: palette.buttonForeground,
        }}
      >
        {action}
        <ArrowRight
          size={17}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </article>
  );
}
