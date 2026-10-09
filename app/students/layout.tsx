
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  UserRound,
  ArrowLeft,
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/student", icon: LayoutDashboard },
  {
    label: "Academic Performance",
    href: "/student/academic-performance",
    icon: GraduationCap,
  },
  {
    label: "My Attendance",
    href: "/student/attendance",
    icon: CalendarCheck,
  },
  {
    label: "My Interventions",
    href: "/student/interventions",
    icon: ClipboardList,
  },
  { label: "My Profile", href: "/student/profile", icon: UserRound },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="w-full border-b border-slate-200 bg-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <Link href="/student" className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <GraduationCap size={25} />
          </div>
          <div>
            <h1 className="text-xl font-bold">CampusIQ</h1>
            <p className="text-xs text-slate-500">Student Portal</p>
          </div>
        </Link>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Student Menu
        </p>

        <nav className="flex flex-wrap gap-2 md:flex-col">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/student" &&
                pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/admin/dashboard"
          className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}