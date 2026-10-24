"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  BriefcaseBusiness,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";

const adminWorkspaceLinks = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/students", icon: Users },
  {
    label: "Academic Performance",
    href: "/academic-performance",
    icon: BookOpen,
  },
  { label: "Results", href: "/results", icon: ClipboardList },
  {
    label: "Attendance Management",
    href: "/admin/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Placement Readiness",
    href: "/placement-readiness",
    icon: BriefcaseBusiness,
  },
  { label: "Interventions", href: "/interventions", icon: Activity },
];

const hodWorkspaceLinks = [
  { label: "Overview", href: "/hod/dashboard", icon: LayoutDashboard },
  { label: "Faculty Overview", href: "/hod/faculty", icon: Users },
  { label: "Student Performance", href: "/hod/students", icon: BookOpen },
  { label: "Attendance Analytics", href: "/hod/attendance", icon: ClipboardCheck },
  { label: "Academic Results", href: "/hod/results", icon: ClipboardList },
];

const tpoWorkspaceLinks = [
  { label: "Overview", href: "/tpo/dashboard", icon: LayoutDashboard },
  { label: "Student Placement Readiness", href: "/tpo/placement-readiness", icon: BriefcaseBusiness },
  { label: "Strong & Weak Areas", href: "/tpo/strong-weak-areas", icon: BookOpen },
  { label: "Students Needing Support", href: "/tpo/students-needing-support", icon: Activity },
  { label: "Placement Analytics", href: "/tpo/placement-analytics", icon: ClipboardList },
];

const administrationLinks = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help and Documentation", href: "/help", icon: CircleHelp },
];

type SidebarProps = {
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
};

export function Sidebar({
  mobileMenuOpen,
  onCloseMobileMenu,
  sidebarCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();
  const role = pathname.startsWith("/hod")
    ? "HOD"
    : pathname.startsWith("/tpo")
      ? "TPO"
      : pathname.startsWith("/faculty")
        ? "Faculty"
        : "Administrator";
  const workspaceLinks = pathname.startsWith("/hod")
    ? hodWorkspaceLinks
    : pathname.startsWith("/tpo")
      ? tpoWorkspaceLinks
      : adminWorkspaceLinks;
  const scopedAdministrationLinks =
    role === "HOD"
      ? administrationLinks.map((link) => ({ ...link, href: link.href.replace("/", "/hod/") }))
      : role === "TPO"
        ? administrationLinks.map((link) => ({ ...link, href: link.href.replace("/", "/tpo/") }))
        : role === "Faculty"
          ? administrationLinks.map((link) => ({ ...link, href: link.href.replace("/", "/faculty/") }))
          : administrationLinks;

  const homeHref =
    role === "HOD"
      ? "/hod/dashboard"
      : role === "TPO"
        ? "/tpo/dashboard"
        : role === "Faculty"
          ? "/faculty/dashboard"
          : "/admin/dashboard";

  function isActive(href: string) {
    const route = href.split("#")[0];
    return pathname === route || pathname.startsWith(`${route}/`);
  }

  function navClass(active: boolean) {
    return `relative flex min-h-[43px] items-center gap-3 rounded-md px-3 text-[12px] leading-none tracking-normal transition-colors ${
      active
        ? "bg-[#315c47] font-semibold text-white"
        : "text-[#c2d2c7] hover:bg-white/10 hover:text-white"
    }`;
  }

  return (
    <aside
      id="workspace-sidebar"
      aria-label="Workspace navigation"
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
          href={homeHref}
          onClick={onCloseMobileMenu}
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
        <button
          type="button"
          onClick={onCloseMobileMenu}
          aria-label="Close navigation"
          className="rounded p-1 text-white/70 hover:bg-white/10 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-[18px] pt-7">
        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[1.5px] text-[#9cb5a6]">
          WORKSPACE
        </p>
        <div className="space-y-1">
          {workspaceLinks.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                href={href}
                key={href}
                onClick={onCloseMobileMenu}
                aria-current={active ? "page" : undefined}
                className={navClass(active)}
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
          {scopedAdministrationLinks.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                href={href}
                key={href}
                onClick={onCloseMobileMenu}
                aria-current={active ? "page" : undefined}
                className={navClass(active)}
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
      </nav>

      <div className="border-t border-white/10 p-5">
        <div className="flex items-center gap-3 rounded-md bg-white/[0.06] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9e7dc] text-[12px] font-semibold text-[#234b38]">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold">{role}</p>
            <p className="mt-1 text-[10px] text-[#a8bfb0]">Demo workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
