import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  GraduationCap,
  UsersRound,
} from "lucide-react";

const roles = [
  {
    eyebrow: "FOR FACULTY",
    title: "Continue as a Faculty",
    description:
      "Manage your classes, record student attendance, monitor academic performance, and support your students' success.",
    href: "/faculty/dashboard",
    action: "Enter Faculty Workspace",
    icon: GraduationCap,
    highlights: [
      { icon: BookOpenCheck, label: "Manage attendance" },
      { icon: ChartNoAxesCombined, label: "Track student performance" },
      { icon: UsersRound, label: "Support individual students" },
    ],
  },
  {
    eyebrow: "FOR DEPARTMENT LEADERS",
    title: "Continue as a HOD",
    description:
      "Monitor departmental performance, review faculty activities, analyze student outcomes, and identify students who need academic support.",
    href: "/hod/dashboard",
    action: "Enter HOD Workspace",
    icon: BriefcaseBusiness,
    highlights: [
      { icon: ChartNoAxesCombined, label: "Monitor department performance" },
      { icon: BookOpenCheck, label: "Review academic trends" },
      { icon: UsersRound, label: "Identify at-risk students" },
    ],
  },
];

export default function AdminDashboardSelectionPage() {
  return (
    <main className="min-h-screen bg-[#f5f7f3] text-[#252f28]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3" aria-label="GrowthTrack home">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#193f31] text-white shadow-sm">
            <GraduationCap size={24} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-[-0.5px]">GrowthTrack</span>
            <span className="mt-0.5 block text-[9px] font-bold tracking-[1.7px] text-[#75837a]">
              STUDENT SUCCESS PLATFORM
            </span>
          </span>
        </Link>
        <span className="hidden rounded-full border border-[#dce7dd] bg-white px-3 py-2 text-xs font-medium text-[#52645a] sm:block">
          Workspace selection
        </span>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[2px] text-[#367552]">
            GROWTH TRACK WORKSPACE
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-1.4px] text-[#1d3026] sm:text-5xl">
            Choose Your Workspace
          </h1>
          <p className="mt-4 text-base leading-7 text-[#647269]">
            Select how you would like to continue with GrowthTrack.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
          {roles.map((role) => (
            <article
              key={role.title}
              className="group flex min-h-[390px] flex-col rounded-2xl border border-[#dfe6de] bg-white p-7 shadow-[0_18px_45px_-32px_rgba(25,63,49,0.55)] transition duration-200 hover:-translate-y-1 hover:border-[#b9d9c2] hover:shadow-[0_24px_55px_-32px_rgba(25,63,49,0.65)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[1.8px] text-[#367552]">
                    {role.eyebrow}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.7px] text-[#213c2d]">
                    {role.title}
                  </h2>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e7f1e9] text-[#367552]">
                  <role.icon size={25} strokeWidth={1.8} />
                </span>
              </div>

              <p className="mt-5 text-sm leading-6 text-[#68766d]">
                {role.description}
              </p>

              <ul className="mt-6 space-y-3 border-t border-[#edf1ed] pt-5">
                {role.highlights.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm text-[#405345]">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f0f8f2] text-[#367552]">
                      <Icon size={15} />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>

              <Link
                href={role.href}
                className="mt-auto inline-flex min-h-12 items-center justify-between gap-3 rounded-lg bg-[#315c47] px-4 text-sm font-semibold text-white transition hover:bg-[#234b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315c47]"
              >
                {role.action}
                <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-[#89968d]">
          This screen selects a workspace route only. Production role authorization
          remains the responsibility of the existing authentication layer.
        </p>
      </section>
    </main>
  );
}
