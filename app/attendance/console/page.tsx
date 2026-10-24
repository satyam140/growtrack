"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Eye,
  Filter,
  RotateCcw,
  Search,
  Send,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin-page-shell";
import {
  attendanceDepartments,
  attendanceStudents,
  attendanceSubjects,
  attendanceYears,
  getStudentPercentage,
  readAttendanceSessions,
  saveAttendanceSessions,
  subscribeToAttendanceSessions,
  type AttendanceRecord,
  type AttendanceSession,
  type AttendanceStatus,
} from "@/lib/attendance";
import { readAdminSettings } from "@/lib/admin-settings";
import { studentProfiles } from "@/lib/students";

const MINIMUM_SESSIONS = 2;
const statusOptions: Array<{ value: AttendanceStatus; label: string }> = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
];

type RegisterStudent = (typeof attendanceStudents)[number];
type RegisterMode = "new" | "edit" | "view";
type StatusFilter = AttendanceStatus | "all" | "unmarked";

function today() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusLabel(status: AttendanceStatus | null) {
  return status ? statusOptions.find((item) => item.value === status)?.label : "Not marked";
}

function statusClasses(status: AttendanceStatus | null) {
  if (status === "present") return "bg-[#f0f8f2] text-[#28684e]";
  if (status === "absent") return "bg-[#fff5f4] text-[#9b4d47]";
  if (status === "late") return "bg-[#fff5df] text-[#8a641e]";
  return "bg-[#f1f4f1] text-[#59675b]";
}

function makeSession(
  students: RegisterStudent[],
  values: {
    title: string;
    department: string;
    year: string;
    subject: string;
    date: string;
    startTime: string;
    endTime: string;
  },
): AttendanceSession {
  return {
    id: `ATT-${Date.now()}`,
    title: values.title.trim(),
    subject: values.subject,
    department: values.department,
    year: values.year,
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    submitted: false,
    createdAt: new Date().toISOString(),
    records: students.map((student) => ({ studentId: student.id, status: null })),
  };
}

export default function AttendanceConsolePage() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [threshold, setThreshold] = useState(75);
  const [mode, setMode] = useState<RegisterMode>("new");
  const [register, setRegister] = useState<AttendanceSession | null>(null);
  const [department, setDepartment] = useState(attendanceDepartments[0]);
  const [year, setYear] = useState(attendanceYears[0]);
  const [subject, setSubject] = useState(attendanceSubjects[0]);
  const [title, setTitle] = useState("Regular Lecture");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [saving, setSaving] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  useEffect(() => {
    function load() {
      try {
        setSessions(readAttendanceSessions());
        setThreshold(readAdminSettings().minimumAttendance);
        setDate((currentDate) => currentDate || today());
        setError("");
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? `Could not load attendance data: ${loadError.message}`
            : "Could not load attendance data.",
        );
      } finally {
        setReady(true);
      }
    }

    load();
    return subscribeToAttendanceSessions(() => {
      try {
        setSessions(readAttendanceSessions());
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? `Could not refresh attendance data: ${loadError.message}`
            : "Could not refresh attendance data.",
        );
      }
    });
  }, []);

  const eligibleStudents = useMemo(
    () =>
      attendanceStudents.filter(
        (student) =>
          student.department === department && student.year === year,
      ),
    [department, year],
  );

  const registerStudents = useMemo(() => {
    if (!register) return [];
    const normalizedSearch = search.trim().toLowerCase();
    return attendanceStudents
      .filter((student) =>
        register.records.some((record) => record.studentId === student.id),
      )
      .filter((student) => {
        const record = register.records.find(
          (item) => item.studentId === student.id,
        );
        const matchesSearch =
          !normalizedSearch ||
          student.name.toLowerCase().includes(normalizedSearch) ||
          student.id.toLowerCase().includes(normalizedSearch);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "unmarked"
            ? record?.status === null
            : record?.status === statusFilter);
        return matchesSearch && matchesStatus;
      });
  }, [register, search, statusFilter]);

  const stats = useMemo(() => {
    const records = register?.records ?? [];
    const present = records.filter((record) => record.status === "present").length;
    const absent = records.filter((record) => record.status === "absent").length;
    const late = records.filter((record) => record.status === "late").length;
    const total = records.length;
    const notMarked = records.filter((record) => record.status === null).length;
    return {
      total,
      present,
      absent,
      late,
      notMarked,
      percentage: total ? Math.round((present / total) * 100) : 0,
    };
  }, [register]);

  const submittedSessions = useMemo(
    () =>
      sessions
        .filter((session) => session.submitted)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [sessions],
  );

  const lowAttendanceStudents = useMemo(
    () =>
      studentProfiles
        .map((student) => {
          const summary = getStudentPercentage(student.id, submittedSessions);
          return { student, summary };
        })
        .filter(
          ({ summary }) =>
            summary.total >= MINIMUM_SESSIONS && summary.percentage < threshold,
        ),
    [submittedSessions, threshold],
  );

  const hasUnsavedChanges =
    Boolean(register && !register.submitted) && mode !== "view";

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [hasUnsavedChanges]);

  function updateRegisterRecord(studentId: string, status: AttendanceStatus) {
    if (!register || mode === "view") return;
    setRegister({
      ...register,
      records: register.records.map((record) =>
        record.studentId === studentId ? { ...record, status } : record,
      ),
    });
  }

  function validateSetup() {
    if (!title.trim()) return "Session title is required.";
    if (!department || !year || !subject || !date) {
      return "Department, class year, subject, and date are required.";
    }
    if (!startTime || !endTime || endTime <= startTime) {
      return "End time must be later than start time.";
    }
    if (!eligibleStudents.length) {
      return "No students match the selected department and class year.";
    }
    return "";
  }

  function startRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateSetup();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setNotice("");
    setRegister(
      makeSession(eligibleStudents, {
        title,
        department,
        year,
        subject,
        date,
        startTime,
        endTime,
      }),
    );
    setMode("new");
    setSearch("");
    setStatusFilter("all");
  }

  function resetRegister() {
    if (hasUnsavedChanges && !window.confirm("Reset this unsaved register?")) return;
    setRegister(null);
    setMode("new");
    setNotice("");
    setError("");
  }

  function bulkSetStatus(status: AttendanceStatus) {
    if (!register || mode === "view") return;
    if (
      status === "absent" &&
      !window.confirm("Mark every student in this register absent?")
    ) {
      return;
    }
    setRegister({
      ...register,
      records: register.records.map((record) => ({ ...record, status })),
    });
  }

  function editSession(session: AttendanceSession) {
    setRegister({
      ...session,
      records: session.records.map((record) => ({ ...record })),
    });
    setMode("edit");
    setNotice("Editing a submitted register. Save it to update the existing session.");
    setError("");
  }

  function viewSession(session: AttendanceSession) {
    setRegister({
      ...session,
      records: session.records.map((record) => ({ ...record })),
    });
    setMode("view");
    setNotice("Read-only view of the submitted register.");
    setError("");
  }

  function saveRegister() {
    if (!register || saving) return;
    if (register.records.some((record) => !record.status)) {
      setError("Mark every student before saving attendance.");
      return;
    }
    if (
      mode === "new" &&
      sessions.some(
        (session) =>
          session.submitted &&
          session.department === register.department &&
          session.year === register.year &&
          session.subject === register.subject &&
          session.date === register.date &&
          session.startTime === register.startTime,
      )
    ) {
      setError("A submitted session already exists for this class, subject, date, and start time.");
      return;
    }

    setSaving(true);
    try {
      const nextSessions =
        mode === "edit"
          ? sessions.map((session) =>
              session.id === register.id ? { ...register, submitted: true } : session,
            )
          : [...sessions, { ...register, submitted: true }];
      saveAttendanceSessions(nextSessions);
      setSessions(nextSessions);
      setRegister({ ...register, submitted: true });
      setMode("view");
      setNotice(mode === "edit" ? "Attendance updated successfully." : "Attendance submitted successfully.");
      setError("");
      setShowSubmitConfirmation(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? `Could not save attendance: ${saveError.message}`
          : "Could not save attendance.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!ready) {
    return (
      <AdminPageShell title="Attendance Console">
        <p className="text-sm text-[#7a867c]">Loading attendance console...</p>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell title="Attendance Console">
      <div className="mx-auto max-w-[1500px] space-y-6 text-[#25352a]">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[2px] text-[#367552]">
              ATTENDANCE OFFICE
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#213c2d]">
              Attendance Console
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#7a867c]">
              Take, submit, review, and edit class attendance from one workspace.
            </p>
          </div>
          <Link
            href="/admin/attendance"
            className="inline-flex items-center gap-2 rounded-lg border border-[#dfe6de] bg-white px-3 py-2 text-sm font-medium text-[#405345] transition hover:bg-[#f5f8f5]"
          >
            <ArrowLeft size={16} />
            Back to Attendance Management
          </Link>
        </header>

        {error && <Notice tone="error">{error}</Notice>}
        {notice && <Notice tone="success">{notice}</Notice>}

        <section className="rounded-lg border border-[#dfe6de] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-[#e7f1e9] p-3 text-[#367552]">
              <ClipboardCheck size={21} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Session setup</h2>
              <p className="mt-1 text-sm text-[#7a867c]">
                Students are loaded from the selected department and academic year.
              </p>
            </div>
          </div>
          <form onSubmit={startRegister} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Department">
              <select value={department} onChange={(event) => setDepartment(event.target.value)} className={inputClass}>
                {attendanceDepartments.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Class / Year">
              <select value={year} onChange={(event) => setYear(event.target.value)} className={inputClass}>
                {attendanceYears.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Subject">
              <select value={subject} onChange={(event) => setSubject(event.target.value)} className={inputClass}>
                {attendanceSubjects.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Session title">
              <input value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} required />
            </Field>
            <Field label="Session date">
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start time">
                <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className={inputClass} required />
              </Field>
              <Field label="End time">
                <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} className={inputClass} required />
              </Field>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2 xl:col-span-3">
              <p className="text-xs text-[#7a867c]">{eligibleStudents.length} student(s) match the selected class.</p>
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#315c47] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#234b38]">
                <Users size={17} />
                {register ? "Start a new register" : "Open register"}
              </button>
            </div>
          </form>
        </section>

        {register && (
          <RegisterPanel
            register={register}
            mode={mode}
            students={registerStudents}
            stats={stats}
            search={search}
            statusFilter={statusFilter}
            saving={saving}
            onSearch={setSearch}
            onStatusFilter={setStatusFilter}
            onStatusChange={updateRegisterRecord}
            onBulkStatus={bulkSetStatus}
            onReset={resetRegister}
            onSubmit={() => setShowSubmitConfirmation(true)}
          />
        )}

        <History
          sessions={submittedSessions}
          onView={viewSession}
          onEdit={editSession}
        />

        <LowAttendance
          students={lowAttendanceStudents}
          threshold={threshold}
        />
      </div>

      {showSubmitConfirmation && register && (
        <ConfirmationDialog
          register={register}
          stats={stats}
          saving={saving}
          onCancel={() => setShowSubmitConfirmation(false)}
          onConfirm={saveRegister}
        />
      )}
    </AdminPageShell>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#dfe6de] bg-white px-3 py-2.5 text-sm text-[#405345] outline-none focus:border-[#6d9d7d] focus:ring-2 focus:ring-[#e7f1e9]";

function Notice({ children, tone }: { children: string; tone: "error" | "success" }) {
  return (
    <div role="status" className={`rounded-lg border px-4 py-3 text-sm ${tone === "error" ? "border-[#e7c4c1] bg-[#fff5f4] text-[#9b4d47]" : "border-[#dce8df] bg-[#f5faf6] text-[#28654d]"}`}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#405345]">{label}</span>
      {children}
    </label>
  );
}

function RegisterPanel({
  register,
  mode,
  students,
  stats,
  search,
  statusFilter,
  saving,
  onSearch,
  onStatusFilter,
  onStatusChange,
  onBulkStatus,
  onReset,
  onSubmit,
}: {
  register: AttendanceSession;
  mode: RegisterMode;
  students: RegisterStudent[];
  stats: { total: number; present: number; absent: number; late: number; notMarked: number; percentage: number };
  search: string;
  statusFilter: StatusFilter;
  saving: boolean;
  onSearch: (value: string) => void;
  onStatusFilter: (value: StatusFilter) => void;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onBulkStatus: (status: AttendanceStatus) => void;
  onReset: () => void;
  onSubmit: () => void;
}) {
  return (
    <section className="rounded-lg border border-[#dfe6de] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[1.5px] text-[#367552]">{mode === "view" ? "READ-ONLY REGISTER" : "LIVE REGISTER"}</p>
          <h2 className="mt-2 text-xl font-semibold text-[#213c2d]">{register.title}</h2>
          <p className="mt-1 text-sm text-[#7a867c]">{register.subject} · {register.department} · {register.year} · {register.date} · {register.startTime}–{register.endTime}</p>
        </div>
        <span className="rounded-full bg-[#f0f8f2] px-3 py-1.5 text-xs font-semibold text-[#28684e]">{mode === "view" ? "Submitted" : mode === "edit" ? "Editing" : "Draft"}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat title="Total" value={stats.total} />
        <Stat title="Present" value={stats.present} tone="green" />
        <Stat title="Absent" value={stats.absent} tone="red" />
        <Stat title="Late" value={stats.late} tone="amber" />
        <Stat title="Not marked" value={stats.notMarked} />
        <Stat title="Attendance %" value={`${stats.percentage}%`} tone="green" />
      </div>

      <div className="mt-5 flex flex-col justify-between gap-3 lg:flex-row">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative">
            <span className="sr-only">Search by name or student ID</span>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa69c]" />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search name or student ID" className={`${inputClass} pl-9 sm:w-72`} />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select value={statusFilter} onChange={(event) => onStatusFilter(event.target.value as StatusFilter)} className={inputClass}>
              <option value="all">All statuses</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="unmarked">Not marked</option>
            </select>
          </label>
        </div>
        {mode !== "view" && (
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={saving} onClick={() => onBulkStatus("present")} className="rounded-lg border border-[#b9d9c2] px-3 py-2 text-xs font-semibold text-[#28684e] hover:bg-[#f0f8f2] disabled:opacity-50">Mark all present</button>
            <button type="button" disabled={saving} onClick={() => onBulkStatus("absent")} className="rounded-lg border border-[#e7c4c1] px-3 py-2 text-xs font-semibold text-[#9b4d47] hover:bg-[#fff5f4] disabled:opacity-50">Mark all absent</button>
            <button type="button" disabled={saving} onClick={onReset} className="rounded-lg border border-[#dfe6de] px-3 py-2 text-xs font-semibold text-[#59675b] hover:bg-[#f5f8f5] disabled:opacity-50"><RotateCcw size={14} className="mr-1 inline" />Reset</button>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-[#7a867c]">Search and filters affect the view only. Bulk actions apply to the whole register.</p>

      <div className="mt-4 overflow-x-auto rounded-lg border border-[#dfe6de]">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-[#f5f8f5] text-xs uppercase tracking-wide text-[#7a867c]">
            <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Student ID</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Academic Year</th><th className="px-4 py-3">Attendance Status</th><th className="px-4 py-3">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-[#edf1ed]">
            {students.map((student) => {
              const record = register.records.find((item) => item.studentId === student.id);
              return (
                <tr key={student.id} className="hover:bg-[#f8fbf8]">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f1e9] text-xs font-semibold text-[#28684e]">{initials(student.name)}</span><span className="font-medium text-[#2b382e]">{student.name}</span></div></td>
                  <td className="px-4 py-3 text-[#7a867c]">{student.id}</td>
                  <td className="px-4 py-3 text-[#59675b]">{student.department}</td>
                  <td className="px-4 py-3 text-[#59675b]">{student.year}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${statusClasses(record?.status ?? null)}`}>{statusLabel(record?.status ?? null)}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {statusOptions.map((option) => (
                        <button key={option.value} type="button" disabled={mode === "view" || saving} aria-pressed={record?.status === option.value} onClick={() => onStatusChange(student.id, option.value)} className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${record?.status === option.value ? "border-[#315c47] bg-[#315c47] text-white" : "border-[#dfe6de] bg-white text-[#59675b] hover:bg-[#f5f8f5]"}`}>{option.label}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!students.length && <p className="p-8 text-center text-sm text-[#7a867c]">No students match this search and status filter.</p>}
      </div>

      {mode !== "view" && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#7a867c]">{stats.notMarked ? `${stats.notMarked} student(s) still need a status.` : "Every student has a status."}</p>
          <button type="button" disabled={saving} onClick={onSubmit} className="inline-flex items-center gap-2 rounded-lg bg-[#315c47] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#234b38] disabled:opacity-50"><Send size={16} />{saving ? "Saving..." : mode === "edit" ? "Save Attendance Changes" : "Submit Attendance"}</button>
        </div>
      )}
    </section>
  );
}

function Stat({ title, value, tone = "default" }: { title: string; value: number | string; tone?: "default" | "green" | "red" | "amber" }) {
  const toneClass = tone === "green" ? "text-[#28684e]" : tone === "red" ? "text-[#9b4d47]" : tone === "amber" ? "text-[#8a641e]" : "text-[#213c2d]";
  return <div className="rounded-lg border border-[#edf1ed] bg-[#f8fbf8] p-3"><p className="text-xs text-[#7a867c]">{title}</p><p className={`mt-1 text-2xl font-semibold ${toneClass}`}>{value}</p></div>;
}

function History({ sessions, onView, onEdit }: { sessions: AttendanceSession[]; onView: (session: AttendanceSession) => void; onEdit: (session: AttendanceSession) => void }) {
  return (
    <section className="rounded-lg border border-[#dfe6de] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Session history</h2>
      <p className="mt-1 text-sm text-[#7a867c]">Submitted registers are read from the shared browser storage.</p>
      {!sessions.length ? <div className="mt-5 rounded-lg border border-dashed border-[#cbd8cd] p-8 text-center text-sm text-[#7a867c]"><ClipboardCheck className="mx-auto mb-3 text-[#9aa69c]" size={28} />No submitted sessions yet.</div> : (
        <div className="mt-5 overflow-x-auto rounded-lg border border-[#dfe6de]">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-[#f5f8f5] text-xs uppercase tracking-wide text-[#7a867c]"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Present</th><th className="px-4 py-3">Absent</th><th className="px-4 py-3">Late</th><th className="px-4 py-3">Attendance %</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-[#edf1ed]">{sessions.map((session) => { const total = session.records.length; const present = session.records.filter((record) => record.status === "present").length; const absent = session.records.filter((record) => record.status === "absent").length; const late = session.records.filter((record) => record.status === "late").length; return <tr key={session.id}><td className="px-4 py-3 font-medium">{session.title}</td><td className="px-4 py-3 text-[#59675b]">{session.subject}</td><td className="px-4 py-3 text-[#59675b]">{session.department} · {session.year}</td><td className="px-4 py-3 text-[#7a867c]">{session.date}</td><td className="px-4 py-3">{total}</td><td className="px-4 py-3 text-[#28684e]">{present}</td><td className="px-4 py-3 text-[#9b4d47]">{absent}</td><td className="px-4 py-3 text-[#8a641e]">{late}</td><td className="px-4 py-3 font-semibold">{total ? Math.round((present / total) * 100) : 0}%</td><td className="px-4 py-3"><span className="rounded-full bg-[#f0f8f2] px-2.5 py-1.5 text-xs font-semibold text-[#28684e]">Submitted</span></td><td className="px-4 py-3"><div className="flex gap-1.5"><button type="button" onClick={() => onView(session)} className="rounded-md border border-[#dfe6de] px-2 py-1.5 text-xs font-semibold text-[#59675b] hover:bg-[#f5f8f5]"><Eye size={13} className="mr-1 inline" />View</button><button type="button" onClick={() => onEdit(session)} className="rounded-md border border-[#b9d9c2] px-2 py-1.5 text-xs font-semibold text-[#28684e] hover:bg-[#f0f8f2]">Edit</button></div></td></tr>; })}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function LowAttendance({ students, threshold }: { students: Array<{ student: (typeof studentProfiles)[number]; summary: ReturnType<typeof getStudentPercentage> }>; threshold: number }) {
  return (
    <section className="rounded-lg border border-[#dfe6de] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">Low-attendance students</h2><p className="mt-1 text-sm text-[#7a867c]">Threshold: {threshold}%. Students need at least {MINIMUM_SESSIONS} submitted sessions to be flagged. Late follows the existing attendance policy and counts as attended.</p></div><AlertTriangle className="text-[#c18a2c]" size={20} /></div>
      {!students.length ? <p className="mt-5 rounded-lg bg-[#f5faf6] p-4 text-sm text-[#28654d]">No students meet the low-attendance criteria yet.</p> : <div className="mt-5 grid gap-3 md:grid-cols-2">{students.map(({ student, summary }) => <div key={student.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#e7c4c1] bg-[#fffafa] p-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff5df] text-xs font-semibold text-[#8a641e]">{initials(student.name)}</span><div><p className="font-semibold">{student.name}</p><p className="text-xs text-[#7a867c]">{student.id} · {summary.attended}/{summary.total} sessions attended</p></div></div><span className="rounded-full bg-[#fff5f4] px-2.5 py-1.5 text-xs font-semibold text-[#9b4d47]">{summary.percentage}% · Warning</span></div>)}</div>}
    </section>
  );
}

function ConfirmationDialog({ register, stats, saving, onCancel, onConfirm }: { register: AttendanceSession; stats: { total: number; present: number; absent: number; late: number; notMarked: number; percentage: number }; saving: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div role="dialog" aria-modal="true" aria-labelledby="submit-title" className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"><div className="flex items-start justify-between gap-4"><div><h2 id="submit-title" className="text-xl font-semibold text-[#213c2d]">Confirm attendance submission</h2><p className="mt-1 text-sm text-[#7a867c]">{register.title} · {register.subject} · {register.department} · {register.year} · {register.date}</p></div><button type="button" onClick={onCancel} aria-label="Close confirmation"><X size={18} /></button></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat title="Total" value={stats.total} /><Stat title="Present" value={stats.present} tone="green" /><Stat title="Absent" value={stats.absent} tone="red" /><Stat title="Late" value={stats.late} tone="amber" /></div>{stats.notMarked > 0 && <p className="mt-4 rounded-lg bg-[#fff5df] p-3 text-sm text-[#8a641e]"><AlertTriangle size={16} className="mr-1 inline" />{stats.notMarked} student(s) are unmarked. You must mark every student before saving.</p>}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-lg border border-[#dfe6de] px-4 py-2.5 text-sm font-semibold text-[#59675b]">Cancel</button><button type="button" disabled={saving || stats.notMarked > 0} onClick={onConfirm} className="rounded-lg bg-[#315c47] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Confirm and save"}</button></div></div></div>;
}
