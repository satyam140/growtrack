"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Plus,
  Search,
  Send,
  Users,
} from "lucide-react";

import {
  attendanceDepartments,
  attendanceStudents,
  attendanceSubjects,
  attendanceYears,
  readAttendanceSessions,
  saveAttendanceSessions,
  type AttendanceRecord,
  type AttendanceSession,
  type AttendanceStatus,
} from "@/lib/attendance";

const statusOptions: AttendanceStatus[] = [
  "present",
  "absent",
  "late",
];

export default function AdminAttendancePage() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [ready, setReady] = useState(false);

  const [title, setTitle] = useState("Regular Lecture");
  const [subject, setSubject] = useState(attendanceSubjects[0]);
  const [department, setDepartment] = useState(attendanceDepartments[0]);
  const [year, setYear] = useState(attendanceYears[1]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setSessions(readAttendanceSessions());

    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    setDate(localDate);
    setReady(true);

    const refresh = () => setSessions(readAttendanceSessions());

    window.addEventListener("campusiq-attendance-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("campusiq-attendance-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const eligibleStudents = useMemo(
    () =>
      attendanceStudents.filter(
        (student) =>
          student.department === department && student.year === year
      ),
    [department, year]
  );

  const activeSession = sessions.find(
    (session) => session.id === activeSessionId && !session.submitted
  );

  const activeStudents = useMemo(() => {
    if (!activeSession) return [];

    const normalized = search.trim().toLowerCase();

    return attendanceStudents
      .filter((student) =>
        activeSession.records.some((record) => record.studentId === student.id)
      )
      .filter(
        (student) =>
          student.name.toLowerCase().includes(normalized) ||
          student.rollNo.toLowerCase().includes(normalized)
      );
  }, [activeSession, search]);

  const activeCounts = useMemo(() => {
    const records = activeSession?.records ?? [];

    return {
      present: records.filter((record) => record.status === "present").length,
      absent: records.filter((record) => record.status === "absent").length,
      late: records.filter((record) => record.status === "late").length,
    };
  }, [activeSession]);

  const submittedSessions = sessions
    .filter((session) => session.submitted)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function createSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    if (!title.trim() || !date || !startTime || !endTime) {
      setNotice("Please complete all session details.");
      return;
    }

    if (endTime <= startTime) {
      setNotice("End time must be later than start time.");
      return;
    }

    if (eligibleStudents.length === 0) {
      setNotice("There are no students in the selected class.");
      return;
    }

    const existing = sessions.some(
      (session) =>
        session.submitted &&
        session.subject === subject &&
        session.department === department &&
        session.year === year &&
        session.date === date &&
        session.startTime === startTime
    );

    if (existing) {
      setNotice(
        "An attendance session already exists for this subject, class, date, and start time."
      );
      return;
    }

    const session: AttendanceSession = {
      id: `ATT-${Date.now()}`,
      title: title.trim(),
      subject,
      department,
      year,
      date,
      startTime,
      endTime,
      submitted: false,
      createdAt: new Date().toISOString(),
      records: eligibleStudents.map((student) => ({
        studentId: student.id,
        status: "absent",
      })),
    };

    const updated = [session, ...sessions];
    setSessions(updated);
    saveAttendanceSessions(updated);
    setActiveSessionId(session.id);
    setSearch("");
    setNotice("Session created. Review each student's status before submitting.");
  }

  function updateStatus(studentId: string, status: AttendanceStatus) {
    if (!activeSession) return;

    const updated = sessions.map((session) =>
      session.id === activeSession.id
        ? {
            ...session,
            records: session.records.map((record) =>
              record.studentId === studentId
                ? { ...record, status }
                : record
            ),
          }
        : session
    );

    setSessions(updated);
    saveAttendanceSessions(updated);
  }

  function markAll(status: AttendanceStatus) {
    if (!activeSession) return;

    const updated = sessions.map((session) =>
      session.id === activeSession.id
        ? {
            ...session,
            records: session.records.map((record) => ({
              ...record,
              status,
            })),
          }
        : session
    );

    setSessions(updated);
    saveAttendanceSessions(updated);
  }

  function submitSession() {
    if (!activeSession) return;

    const confirmed = window.confirm(
      "Submit attendance for this session? Submitted sessions become read-only in this demo."
    );

    if (!confirmed) return;

    const updated = sessions.map((session) =>
      session.id === activeSession.id
        ? { ...session, submitted: true }
        : session
    );

    setSessions(updated);
    saveAttendanceSessions(updated);
    setActiveSessionId(null);
    setNotice("Attendance submitted successfully.");
  }

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  if (!ready) {
    return <main className="min-h-screen bg-slate-50 p-8">Loading attendance...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-600">
              CampusIQ / Administrator
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Attendance Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create class sessions, record attendance, and submit attendance registers.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
            <ClipboardCheck size={19} />
            Attendance console
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"
          >
            {notice}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<CalendarDays size={20} />}
            label="Total sessions"
            value={String(sessions.length)}
          />
          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Submitted sessions"
            value={String(submittedSessions.length)}
          />
          <StatCard
            icon={<Users size={20} />}
            label="Demo students"
            value={String(attendanceStudents.length)}
          />
        </section>

        <section className={cardClass}>
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Plus size={21} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Create attendance session</h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose the class and subject for the register.
              </p>
            </div>
          </div>

          <form onSubmit={createSession} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Session title">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={inputClass}
                placeholder="e.g. Morning Lecture"
                required
              />
            </Field>

            <Field label="Subject">
              <select value={subject} onChange={(event) => setSubject(event.target.value)} className={inputClass}>
                {attendanceSubjects.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>

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

            <div className="flex flex-col justify-end gap-2 md:col-span-2 xl:col-span-3">
              <p className="text-xs text-slate-500">
                {eligibleStudents.length} student(s) match the selected department and year.
              </p>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-fit">
                <Plus size={17} />
                Create and take attendance
              </button>
            </div>
          </form>
        </section>

        {activeSession && (
          <section className={cardClass}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold">{activeSession.title}</h2>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Draft
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {activeSession.subject} · {activeSession.department} · {activeSession.year}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 size={15} />
                  {activeSession.date} · {activeSession.startTime}–{activeSession.endTime}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <CountBox label="Present" value={activeCounts.present} color="text-emerald-700 bg-emerald-50" />
                <CountBox label="Absent" value={activeCounts.absent} color="text-rose-700 bg-rose-50" />
                <CountBox label="Late" value={activeCounts.late} color="text-amber-700 bg-amber-50" />
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row">
              <div className="relative w-full sm:max-w-sm">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search student or roll number"
                  className={`${inputClass} pl-9`}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => markAll("present")} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                  Mark all present
                </button>
                <button type="button" onClick={() => markAll("absent")} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                  Mark all absent
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Roll number</th>
                    <th className="px-4 py-3">Attendance status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeStudents.map((student) => {
                    const record = activeSession.records.find((item) => item.studentId === student.id);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium">{student.name}</td>
                        <td className="px-4 py-4 text-slate-500">{student.rollNo}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => updateStatus(student.id, status)}
                                aria-pressed={record?.status === status}
                                className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition ${
                                  record?.status === status
                                    ? status === "present"
                                      ? "border-emerald-600 bg-emerald-600 text-white"
                                      : status === "absent"
                                        ? "border-rose-600 bg-rose-600 text-white"
                                        : "border-amber-500 bg-amber-500 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {activeStudents.length === 0 && (
                <p className="p-6 text-center text-sm text-slate-500">No students found.</p>
              )}
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs leading-5 text-slate-500">
                New records default to Absent. Verify each student's status before submission.
              </p>
              <button type="button" onClick={submitSession} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                <Send size={17} />
                Submit attendance
              </button>
            </div>
          </section>
        )}

        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Attendance session history</h2>
          <p className="mt-1 text-sm text-slate-500">
            Submitted registers are listed below.
          </p>

          {submittedSessions.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <CalendarDays className="mx-auto mb-3 text-slate-400" size={28} />
              <p className="font-medium">No submitted sessions yet</p>
              <p className="mt-1 text-sm text-slate-500">Create and submit your first attendance session above.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {submittedSessions.map((session) => {
                const present = session.records.filter((record) => record.status === "present").length;
                const late = session.records.filter((record) => record.status === "late").length;
                const absent = session.records.filter((record) => record.status === "absent").length;

                return (
                  <div key={session.id} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-semibold">{session.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{session.subject} · {session.department} · {session.year}</p>
                      <p className="mt-1 text-xs text-slate-400">{session.date} · {session.startTime}–{session.endTime}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1.5 text-emerald-700">{present} Present</span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1.5 text-amber-700">{late} Late</span>
                      <span className="rounded-full bg-rose-50 px-2.5 py-1.5 text-rose-700">{absent} Absent</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1.5 text-slate-600">Submitted</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <p className="text-xs leading-5 text-slate-400">
          Demo mode: attendance is stored in this browser only. No server-side authentication or database is configured.
        </p>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}

function CountBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`min-w-[76px] rounded-xl px-3 py-2 text-center ${color}`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="mt-0.5 text-xs font-medium">{label}</p>
    </div>
  );
}