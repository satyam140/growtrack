"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  UsersRound,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin-page-shell";
import {
  getStudentPercentage,
  readAttendanceSessions,
  subscribeToAttendanceSessions,
  type AttendanceSession,
} from "@/lib/attendance";
import {
  readDeclaredResults,
  subscribeToDeclaredResults,
  type DeclaredStudentResult,
} from "@/lib/declared-results";
import {
  DEFAULT_ADMIN_SETTINGS,
  readAdminSettings,
} from "@/lib/admin-settings";
import { DEMO_PASS_MARK } from "@/lib/student-academics";
import { studentProfiles } from "@/lib/students";
import { demoFaculty, getDemoFacultyStudents } from "@/lib/hod-demo";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: typeof UsersRound;
};

function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-[#dfe6de] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[1.2px] text-[#7a867c]">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#213c2d]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[#89968d]">{detail}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#e7f1e9] text-[#367552]">
          <Icon size={20} />
        </span>
      </div>
    </article>
  );
}

function Panel({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-lg border border-[#dfe6de] bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="border-b border-[#edf1ed] pb-4">
        <h2 className="text-lg font-semibold text-[#213c2d]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-[#7a867c]">{description}</p>
        )}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

export function HodDashboard() {
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [declaredResults, setDeclaredResults] = useState<DeclaredStudentResult[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [settings, setSettings] = useState(DEFAULT_ADMIN_SETTINGS);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const refresh = () => {
      try {
        setAttendanceSessions(readAttendanceSessions());
        setDeclaredResults(readDeclaredResults());
        setSettings(readAdminSettings());
        setLoadError("");
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Saved dashboard data could not be loaded.",
        );
      }
    };

    refresh();
    return () => undefined;
  }, []);

  useEffect(() => {
    const refresh = () => {
      try {
        setAttendanceSessions(readAttendanceSessions());
        setDeclaredResults(readDeclaredResults());
        setLoadError("");
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Saved dashboard data could not be loaded.",
        );
      }
    };
    const unsubscribeAttendance = subscribeToAttendanceSessions(refresh);
    const unsubscribeResults = subscribeToDeclaredResults(refresh);
    return () => {
      unsubscribeAttendance();
      unsubscribeResults();
    };
  }, []);

  const academicSummary = useMemo(() => {
    const scores = studentProfiles
      .map((student) => student.academicScore)
      .filter((score) => Number.isFinite(score));
    const passing = scores.filter((score) => score >= DEMO_PASS_MARK).length;
    return {
      average: scores.length
        ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10
        : null,
      passing: scores.length ? Math.round((passing / scores.length) * 100) : null,
    };
  }, []);

  const attendanceSummary = useMemo(() => {
    const submitted = attendanceSessions.filter((session) => session.submitted);
    const percentages = studentProfiles
      .map((student) => getStudentPercentage(student.id, submitted))
      .filter((summary) => summary.total > 0)
      .map((summary) => summary.percentage);
    const threshold = settings.minimumAttendance;
    return {
      sessions: submitted.length,
      average: percentages.length
        ? Math.round((percentages.reduce((sum, percentage) => sum + percentage, 0) / percentages.length) * 10) / 10
        : null,
      belowThreshold: percentages.filter((percentage) => percentage < threshold).length,
      studentsWithRecords: percentages.length,
    };
  }, [attendanceSessions, settings.minimumAttendance]);

  const resultSummary = useMemo(() => {
    const finalizedMarks = declaredResults.flatMap((result) =>
      result.subjects.map((subject) => subject.score),
    );
    const passed = finalizedMarks.filter((score) => score >= DEMO_PASS_MARK).length;
    return {
      average: finalizedMarks.length
        ? Math.round((finalizedMarks.reduce((sum, score) => sum + score, 0) / finalizedMarks.length) * 10) / 10
        : null,
      passing: finalizedMarks.length ? Math.round((passed / finalizedMarks.length) * 100) : null,
      finalizedStudents: new Set(declaredResults.map((result) => result.studentId)).size,
    };
  }, [declaredResults]);

  const selectedFacultyRecord = demoFaculty.find((faculty) => faculty.id === selectedFaculty);
  const selectedFacultyStudents = selectedFacultyRecord
    ? getDemoFacultyStudents(selectedFacultyRecord)
    : [];
  const selectedFacultyAverage = selectedFacultyStudents.length
    ? Math.round(
        (selectedFacultyStudents.reduce((sum, student) => sum + student.academicScore, 0) /
          selectedFacultyStudents.length) *
          10,
      ) / 10
    : null;

  return (
    <AdminPageShell title="HOD Dashboard">
      <div className="mx-auto max-w-[1200px] space-y-7">
        <header>
          <p className="text-xs font-bold tracking-[2px] text-[#367552]">
            DEPARTMENT MANAGEMENT
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#213c2d]">
            HOD Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a867c]">
            Monitor departmental performance, faculty activities, student outcomes, and academic progress from one place.
          </p>
        </header>

        {loadError && (
          <div className="flex items-start gap-3 rounded-lg border border-[#e7caca] bg-[#fff7f7] p-4 text-sm text-[#8b4b4b]">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{loadError}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total faculty"
            value={String(demoFaculty.length)}
            detail="Illustrative demo faculty"
            icon={UsersRound}
          />
          <MetricCard
            label="Total students"
            value={String(studentProfiles.length)}
            detail="Across available departments"
            icon={UsersRound}
          />
          <MetricCard
            label="Average academic score"
            value={academicSummary.average === null ? "—" : `${academicSummary.average}%`}
            detail="Illustrative scores out of 100"
            icon={BarChart3}
          />
          <MetricCard
            label="Overall passing"
            value={academicSummary.passing === null ? "—" : `${academicSummary.passing}%`}
            detail={`Using ${DEMO_PASS_MARK}/100 demo pass mark`}
            icon={BookOpenCheck}
          />
        </div>

        <Panel
          id="faculty"
          title="Faculty Performance Overview"
          description="Illustrative faculty assignments are provided for this demo workspace. Production faculty records can replace them without changing the page."
        >
          <label className="block max-w-md text-sm font-semibold text-[#405345]" htmlFor="hod-faculty">
            Select Faculty
          </label>
          <select
            id="hod-faculty"
            value={selectedFaculty}
            onChange={(event) => setSelectedFaculty(event.target.value)}
            className="mt-2 h-11 w-full max-w-md rounded-lg border border-[#dfe6de] bg-white px-3 text-sm text-[#405345] outline-none focus:border-[#6da47e]"
          >
            <option value="">Choose a faculty member</option>
            {demoFaculty.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-[#89968d]">Demo data only. Faculty records are read-only.</p>
          {selectedFacultyRecord ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <div className="rounded-lg border border-[#edf1ed] bg-[#fbfdfb] p-4">
                <p className="text-xs font-semibold uppercase tracking-[1px] text-[#89968d]">Faculty profile</p>
                <h3 className="mt-2 text-lg font-semibold text-[#2c4031]">{selectedFacultyRecord.name}</h3>
                <p className="mt-1 text-sm text-[#7a867c]">{selectedFacultyRecord.id} · {selectedFacultyRecord.designation}</p>
                <p className="mt-3 text-sm text-[#405345]">{selectedFacultyRecord.department}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <ReadOnlyStat label="Subjects" value={String(selectedFacultyRecord.subjects.length)} />
                  <ReadOnlyStat label="Students" value={String(selectedFacultyStudents.length)} />
                  <ReadOnlyStat label="Average score" value={`${selectedFacultyAverage}%`} />
                  <ReadOnlyStat label="Pass rate" value={`${Math.round((selectedFacultyStudents.filter((student) => student.academicScore >= DEMO_PASS_MARK).length / Math.max(selectedFacultyStudents.length, 1)) * 100)}%`} />
                </div>
              </div>
              <div className="rounded-lg border border-[#edf1ed] bg-white p-4">
                <h3 className="text-sm font-semibold text-[#2c4031]">Assigned subjects</h3>
                <div className="mt-3 space-y-2">
                  {selectedFacultyRecord.subjects.map((subject) => (
                    <div key={subject} className="flex items-center justify-between rounded-lg border border-[#edf1ed] px-3 py-3 text-sm">
                      <span className="text-[#405345]">{subject}</span>
                      <span className="text-xs text-[#89968d]">{selectedFacultyRecord.department}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#dfe6de] bg-[#fbfdfb] p-4 text-sm text-[#7a867c]">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#367552]" />
              <p>Select a faculty member to view their demo assignments and read-only performance summary.</p>
            </div>
          )}
        </Panel>

        <div className="grid gap-7 lg:grid-cols-2">
          <Panel
            id="results"
            title="Academic Results & Passing Analysis"
            description="Finalized results are read from the existing browser-stored results module."
          >
            {declaredResults.length === 0 ? (
              <EmptyState text="No finalized results are available for analysis." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                <ReadOnlyStat label="Average marks" value={`${resultSummary.average}%`} />
                <ReadOnlyStat label="Passing percentage" value={`${resultSummary.passing}%`} />
                <ReadOnlyStat label="Finalized students" value={String(resultSummary.finalizedStudents)} />
              </div>
            )}
            <p className="mt-4 text-xs leading-5 text-[#89968d]">
              Students without finalized results are not classified as failed. The existing
              demo subject model uses a pass mark of {DEMO_PASS_MARK}/100.
            </p>
          </Panel>

          <Panel
            id="attendance"
            title="Attendance Analytics"
            description="Only submitted attendance sessions contribute to these read-only metrics."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyStat label="Students with records" value={String(attendanceSummary.studentsWithRecords)} />
              <ReadOnlyStat label="Average attendance" value={attendanceSummary.average === null ? "—" : `${attendanceSummary.average}%`} />
              <ReadOnlyStat label="Below threshold" value={String(attendanceSummary.belowThreshold)} />
              <ReadOnlyStat label="Submitted sessions" value={String(attendanceSummary.sessions)} />
            </div>
            <p className="mt-4 text-xs leading-5 text-[#89968d]">
              Attendance threshold: {settings.minimumAttendance}%. Missing records are excluded,
              not treated as zero.
            </p>
          </Panel>
        </div>

        <Panel
          id="students"
          title="Student Performance"
          description="Department-wide student records from the existing illustrative student directory."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[#edf1ed] text-xs uppercase tracking-[1px] text-[#89968d]">
                <tr>
                  <th className="px-3 py-3 font-semibold">Student</th>
                  <th className="px-3 py-3 font-semibold">Department</th>
                  <th className="px-3 py-3 font-semibold">Year</th>
                  <th className="px-3 py-3 font-semibold">Academic score</th>
                  <th className="px-3 py-3 font-semibold">Result</th>
                  <th className="px-3 py-3 font-semibold">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1ed] text-[#405345]">
                {studentProfiles.map((student) => (
                  <tr key={student.id}>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-[#2c4031]">{student.name}</p>
                      <p className="mt-1 text-xs text-[#89968d]">{student.id}</p>
                    </td>
                    <td className="px-3 py-3">{student.department}</td>
                    <td className="px-3 py-3">{student.year}</td>
                    <td className="px-3 py-3">{student.academicScore}/100</td>
                    <td className="px-3 py-3">
                      <span className={student.academicScore >= DEMO_PASS_MARK ? "text-[#367552]" : "text-[#a45757]"}>
                        {student.academicScore >= DEMO_PASS_MARK ? "Pass" : "Fail"}
                      </span>
                    </td>
                    <td className="px-3 py-3">{student.attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="grid gap-7 lg:grid-cols-2">
          <Panel
            title="Student Risk Overview"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <ReadOnlyStat label="High risk" value={String(studentProfiles.filter((student) => student.risk === "High").length)} />
              <ReadOnlyStat label="Medium risk" value={String(studentProfiles.filter((student) => student.risk === "Medium").length)} />
              <ReadOnlyStat label="Low risk" value={String(studentProfiles.filter((student) => student.risk === "Low").length)} />
            </div>
            <p className="mt-4 text-xs leading-5 text-[#89968d]">
              Risk indicators come from the existing illustrative student profiles and are shown for monitoring only.
            </p>
          </Panel>
          <Panel title="Quick Navigation">
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["Faculty Overview", "/hod/faculty"],
                ["Student Performance", "/hod/students"],
                ["Attendance Analytics", "/hod/attendance"],
                ["Academic Results", "/hod/results"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg border border-[#dfe6de] bg-[#fbfdfb] px-4 py-3 text-sm font-semibold text-[#405345] transition hover:border-[#b9d9c2] hover:bg-[#f5faf6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#367552]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        <p className="text-xs leading-5 text-[#89968d]">
          This workspace is read-only. It does not expose controls to modify faculty, students,
          marks, results, or attendance. The current application has no backend authorization layer;
          route access remains a navigation prototype.
        </p>
      </div>
    </AdminPageShell>
  );
}

function ReadOnlyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#edf1ed] bg-[#fbfdfb] p-3">
      <p className="text-xs text-[#89968d]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#2c4031]">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#dfe6de] bg-[#fbfdfb] p-4 text-sm text-[#7a867c]">
      <ClipboardCheck size={18} className="text-[#8aa493]" />
      {text}
    </div>
  );
}
