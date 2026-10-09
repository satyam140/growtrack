"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  BriefcaseBusiness,
  CircleHelp,
  ClipboardList,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  UserRound,
} from "lucide-react";

const workspaceLinks = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/students", icon: Users },
  {
    label: "Academic performance",
    href: "/academic-performance",
    icon: BookOpen,
  },
  { label: "Results", href: "/results", icon: ClipboardList },
  {
    label: "Attendance management",
    href: "/admin/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Placement readiness",
    href: "/placement-readiness",
    icon: BriefcaseBusiness,
  },
  { label: "Interventions", href: "/interventions", icon: Activity },
];

type AdminPageShellProps = {
  title: string;
  children: ReactNode;
};

export function AdminPageShell({ title, children }: AdminPageShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function toggleNavigation() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarCollapsed((collapsed) => !collapsed);
    } else {
      setMobileMenuOpen((open) => !open);
    }
  }

  function navClass(active: boolean) {
    return `flex min-h-[43px] items-center gap-3 rounded-md px-3 text-[12px] transition-colors ${
      active
        ? "bg-[#315c47] font-semibold text-white"
        : "text-[#c2d2c7] hover:bg-white/10 hover:text-white"
    }`;
  }

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#252f28]">
      <div className="flex min-h-screen">
        <aside
          id="admin-sidebar"
          className={`fixed bottom-0 left-0 top-[66px] z-40 flex w-[252px] flex-col overflow-hidden bg-[#193f31] text-white transition-[transform,width,opacity] duration-200 lg:sticky lg:inset-y-0 lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            sidebarCollapsed
              ? "lg:w-0 lg:opacity-0"
              : "lg:w-[252px] lg:opacity-100"
          }`}
        >
          <div className="flex h-[96px] items-center justify-between px-6">
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
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
              {workspaceLinks.map(({ label, href, icon: Icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/" && pathname.startsWith(`${href}/`));

                return (
                  <Link
                    href={href}
                    key={href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`${navClass(active)} relative`}
                  >
                    {active && (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r bg-[#b5d7bd]" />
                    )}
                    <Icon size={18} strokeWidth={1.7} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="my-6 border-t border-white/10" />
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[1.5px] text-[#9cb5a6]">
              ADMINISTRATION
            </p>
            <div className="space-y-1">
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === "/settings" ? "page" : undefined}
                className={navClass(pathname === "/settings")}
              >
                <Settings size={18} strokeWidth={1.7} />
                Settings
              </Link>
              <Link
                href="/help"
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === "/help" ? "page" : undefined}
                className={navClass(pathname === "/help")}
              >
                <CircleHelp size={18} strokeWidth={1.7} />
                Help and documentation
              </Link>
              <Link
                href="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[43px] items-center gap-3 rounded-md px-3 text-[12px] text-[#c2d2c7] transition-colors hover:bg-white/10 hover:text-white"
              >
                <UserRound size={18} strokeWidth={1.7} />
                Student portal
              </Link>
            </div>
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
            </div>
          </div>
        </aside>

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation backdrop"
            className="fixed bottom-0 left-0 right-0 top-[66px] z-10 bg-black/40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[66px] items-center justify-between border-b border-[#e2e7df] bg-white px-4 sm:px-7 lg:px-9">
            <div className="flex items-center gap-3 text-[12px]">
              <button
                type="button"
                className="rounded-md border border-[#e2e7df] p-2 text-[#47564b]"
                onClick={toggleNavigation}
                aria-label="Toggle navigation"
                aria-controls="admin-sidebar"
                title="Show or hide navigation"
              >
                <Menu size={19} />
              </button>
              <span className="text-[#879087]">Workspace</span>
              <span className="text-[#c3c9c1]">/</span>
              <span className="font-semibold text-[#2b382e]">{title}</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded border border-[#dce8df] bg-[#f5faf6] px-2.5 py-2 text-[10px] text-[#28654d] sm:px-3 sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4c9169]" />
              Demo data
            </span>
          </header>
          <main className="mx-auto max-w-[1580px] px-4 pb-10 pt-7 sm:px-7 lg:px-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
