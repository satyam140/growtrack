"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
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
import { DEMO_PASS_MARK } from "@/lib/student-academics";
import { studentProfiles } from "@/lib/students";
import { demoFaculty, getDemoFacultyStudents } from "@/lib/hod-demo";

function Header({ title, description }: { title: string; description: string }) {
  return (
    <header>
      <p className="text-xs font-bold tracking-[2px] text-[#367552]">DEPARTMENT MANAGEMENT</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#213c2d]">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#7a867c]">{description}</p>
    </header>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-[#dfe6de] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="border-b border-[#edf1ed] pb-4 text-lg font-semibold text-[#213c2d]">{title}</h2>
      <div className="pt-5">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#dfe6de] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[1.2px] text-[#7a867c]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#213c2d]">{value}</p>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-dashed border-[#dfe6de] bg-[#fbfdfb] p-4 text-sm leading-6 text-[#7a867c]">
      <AlertCircle size={18} className="mt-1 shrink-0 text-[#b38a3c]" />
      <span>{children}</span>
    </div>
  );
}

function useHodData() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [results, setResults] = useState<DeclaredStudentResult[]>([]);

  useEffect(() => {
    const refresh = () => {
      setSessions(readAttendanceSessions());
      setResults(readDeclaredResults());
    };
    refresh();
    const unsubscribeAttendance = subscribeToAttendanceSessions(refresh);
    const unsubscribeResults = subscribeToDeclaredResults(refresh);
    return () => {
      unsubscribeAttendance();
      unsubscribeResults();
    };
  }, []);

  return { sessions, results };
}

export function HodFacultyPage() {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [search, setSearch] = useState("");
  const [studentDepartment, setStudentDepartment] = useState("all");
  const [studentYear, setStudentYear] = useState("all");
  const [readinessFilter, setReadinessFilter] = useState("all");
  const faculty = demoFaculty.find((item) => item.id === selectedFaculty);
  const facultyStudents = useMemo(
    () =>
      faculty
        ? Array.from(
            new Map(
              getDemoFacultyStudents(faculty).map((student) => [student.id, student]),
            ).values(),
          )
        : [],
    [faculty],
  );
  const visibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return facultyStudents.filter((student) => {
      const score = getPlacementScore(student);
      return (
        `${student.name} ${student.id}`.toLowerCase().includes(query) &&
        (studentDepartment === "all" || student.department === studentDepartment) &&
        (studentYear === "all" || student.year === studentYear) &&
        (readinessFilter === "all" || getReadinessFilterValue(score) === readinessFilter)
      );
    });
  }, [facultyStudents, readinessFilter, search, studentDepartment, studentYear]);

  const studentDepartments = Array.from(new Set(facultyStudents.map((student) => student.department)));
  const studentYears = Array.from(new Set(facultyStudents.map((student) => student.year)));
  return (
    <AdminPageShell title="Faculty Overview">
      <div className="mx-auto max-w-[1200px] space-y-7">
        <Header title="Faculty Overview" description="Review faculty assignments, teaching responsibilities, and the students associated with each faculty member." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total faculty" value={String(demoFaculty.length)} />
          <Stat label="Departments" value={String(new Set(studentProfiles.map((student) => student.department)).size)} />
          <Stat label="Assigned subjects" value={faculty ? String(faculty.subjects.length) : "-"} />
          <Stat label="Students under faculty" value={faculty ? String(facultyStudents.length) : "—"} />
        </div>
        <Panel title="Faculty Directory">
          <label htmlFor="faculty-select" className="text-sm font-semibold text-[#405345]">Select Faculty</label>
          <select id="faculty-select" value={selectedFaculty} onChange={(event) => {
            setSelectedFaculty(event.target.value);
            setSearch("");
            setStudentDepartment("all");
            setStudentYear("all");
            setReadinessFilter("all");
          }} className="mt-2 h-11 w-full max-w-md rounded-lg border border-[#dfe6de] bg-white px-3 text-sm text-[#405345]">
            <option value="">Choose a faculty member</option>
            {demoFaculty.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <p className="mt-2 text-xs text-[#89968d]">Demo faculty records only. This page is read-only.</p>
          {faculty ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-[#edf1ed] bg-[#fbfdfb] p-4">
                <p className="text-xs uppercase tracking-[1px] text-[#89968d]">Faculty profile</p>
                <h3 className="mt-2 text-lg font-semibold text-[#2c4031]">{faculty.name}</h3>
                <p className="mt-1 text-sm text-[#7a867c]">{faculty.id} · {faculty.designation}</p>
                <p className="mt-3 text-sm text-[#405345]">{faculty.department}</p>
                <p className="mt-3 text-sm text-[#405345]">{facultyStudents.length} unique students · {faculty.subjects.length} assigned subjects</p>
              </div>
              <div className="rounded-lg border border-[#edf1ed] p-4">
                <h3 className="text-sm font-semibold text-[#2c4031]">Assigned subjects</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#405345]">
                  {faculty.subjects.map((subject) => <li key={subject} className="rounded-lg bg-[#f5faf6] px-3 py-2">{subject}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <div className="mt-5"><Empty>Select a faculty member to view the demo profile and assigned subjects.</Empty></div>
          )}
        </Panel>
        <Panel title="Students Under This Faculty">
          <p className="text-sm leading-6 text-[#7a867c]">
            View students associated with the selected faculty member and their placement readiness.
          </p>
          {!faculty ? (
            <div className="mt-5">
              <Empty>Select a faculty member to view associated students.</Empty>
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <input
                  aria-label="Search students under faculty"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name or ID"
                  className="h-10 rounded-lg border border-[#dfe6de] px-3 text-sm outline-none focus:border-[#6da47e]"
                />
                <select
                  aria-label="Filter students by department"
                  value={studentDepartment}
                  onChange={(event) => setStudentDepartment(event.target.value)}
                  className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm"
                >
                  <option value="all">All departments</option>
                  {studentDepartments.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select
                  aria-label="Filter students by year"
                  value={studentYear}
                  onChange={(event) => setStudentYear(event.target.value)}
                  className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm"
                >
                  <option value="all">All years</option>
                  {studentYears.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select
                  aria-label="Filter students by placement readiness"
                  value={readinessFilter}
                  onChange={(event) => setReadinessFilter(event.target.value)}
                  className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm"
                >
                  <option value="all">All readiness levels</option>
                  <option value="ready">Ready</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-ready">Not Ready</option>
                  <option value="not-assessed">Not Assessed</option>
                </select>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#405345]">
                {visibleStudents.length === facultyStudents.length
                  ? `${facultyStudents.length} students`
                  : `${visibleStudents.length} of ${facultyStudents.length} students`}
              </p>
              <div className="mt-3 overflow-x-auto rounded-lg border border-[#edf1ed]">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-[#edf1ed] bg-[#fbfdfb] text-xs uppercase tracking-[1px] text-[#89968d]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Student Name</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Year</th>
                      <th className="px-4 py-3 font-semibold">Ready for Placements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf1ed] text-[#405345]">
                    {visibleStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[#2c4031]">{student.name}</span>
                          <span className="mt-1 block text-xs text-[#89968d]">{student.id}</span>
                        </td>
                        <td className="px-4 py-3">{student.department}</td>
                        <td className="px-4 py-3">{student.year}</td>
                        <td className="px-4 py-3">
                          <ReadinessBadge score={getPlacementScore(student)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleStudents.length === 0 && (
                <p className="mt-4 text-sm text-[#7a867c]">
                  No students match the selected filters.
                </p>
              )}
            </>
          )}
        </Panel>
      </div>
    </AdminPageShell>
  );
}

function getPlacementScore(student: (typeof studentProfiles)[number]) {
  return Number.isFinite(student.placementScore) ? student.placementScore : null;
}

function getReadinessFilterValue(score: number | null) {
  if (score === null) return "not-assessed";
  if (score >= 80) return "ready";
  if (score >= 65) return "in-progress";
  return "not-ready";
}

function ReadinessBadge({ score }: { score: number | null }) {
  const status = score === null
    ? "Not Assessed"
    : score >= 80
      ? "Ready"
      : score >= 65
        ? "In Progress"
        : "Not Ready";
  const style = score === null
    ? "bg-[#f1f3f1] text-[#6f7b72]"
    : score >= 80
      ? "bg-green-50 text-green-700"
      : score >= 65
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${style}`}>
      {status}
      {score !== null && <span className="ml-1">({score})</span>}
    </span>
  );
}

export function HodStudentsPage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [year, setYear] = useState("all");
  const [risk, setRisk] = useState("all");
  const departments = Array.from(new Set(studentProfiles.map((student) => student.department)));
  const years = Array.from(new Set(studentProfiles.map((student) => student.year)));
  const filtered = studentProfiles.filter((student) => {
    const matchesQuery = `${student.name} ${student.id}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery &&
      (department === "all" || student.department === department) &&
      (year === "all" || student.year === year) &&
      (risk === "all" || student.risk === risk);
  });
  const average = studentProfiles.reduce((sum, student) => sum + student.academicScore, 0) / studentProfiles.length;

  return (
    <AdminPageShell title="Student Performance">
      <div className="mx-auto max-w-[1200px] space-y-7">
        <Header title="Student Performance" description="Analyze student achievement, identify performance trends, and understand which students may need additional academic support." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total students" value={String(studentProfiles.length)} />
          <Stat label="Average score" value={`${Math.round(average * 10) / 10}%`} />
          <Stat label="Meeting pass criteria" value={String(studentProfiles.filter((student) => student.academicScore >= DEMO_PASS_MARK).length)} />
          <Stat label="Needs support" value={String(studentProfiles.filter((student) => student.risk !== "Low").length)} />
        </div>
        <Panel title="Student Performance Directory">
          <div className="grid gap-3 md:grid-cols-4">
            <input aria-label="Search students" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or ID" className="h-10 rounded-lg border border-[#dfe6de] px-3 text-sm outline-none focus:border-[#6da47e]" />
            <select aria-label="Department filter" value={department} onChange={(event) => setDepartment(event.target.value)} className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm">
              <option value="all">All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select aria-label="Academic year filter" value={year} onChange={(event) => setYear(event.target.value)} className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm">
              <option value="all">All years</option>{years.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select aria-label="Risk filter" value={risk} onChange={(event) => setRisk(event.target.value)} className="h-10 rounded-lg border border-[#dfe6de] bg-white px-3 text-sm">
              <option value="all">All risk levels</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-[#edf1ed] text-xs uppercase tracking-[1px] text-[#89968d]"><tr>{["Student", "Department", "Year", "Average marks", "Result", "Risk"].map((label) => <th key={label} className="px-3 py-3 font-semibold">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-[#edf1ed] text-[#405345]">{filtered.map((student) => <tr key={student.id}><td className="px-3 py-3"><b className="text-[#2c4031]">{student.name}</b><span className="mt-1 block text-xs text-[#89968d]">{student.id}</span></td><td className="px-3 py-3">{student.department}</td><td className="px-3 py-3">{student.year}</td><td className="px-3 py-3">{student.academicScore}/100</td><td className="px-3 py-3">{student.academicScore >= DEMO_PASS_MARK ? "Pass" : "Fail"}</td><td className="px-3 py-3">{student.risk}</td></tr>)}</tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="mt-4 text-sm text-[#7a867c]">No students match the selected filters.</p>}
        </Panel>
      </div>
    </AdminPageShell>
  );
}

export function HodAttendancePage() {
  const { sessions } = useHodData();
  const submitted = sessions.filter((session) => session.submitted);
  const summaries = studentProfiles.map((student) => ({ student, summary: getStudentPercentage(student.id, submitted) })).filter((item) => item.summary.total > 0);
  const average = summaries.length ? summaries.reduce((sum, item) => sum + item.summary.percentage, 0) / summaries.length : null;
  const below = summaries.filter((item) => item.summary.percentage < 75);
  return (
    <AdminPageShell title="Attendance Analytics">
      <div className="mx-auto max-w-[1200px] space-y-7">
        <Header title="Attendance Analytics" description="Monitor attendance patterns, review class participation, and identify students who may require attendance-related support." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Attendance sessions" value={String(sessions.length)} /><Stat label="Average attendance" value={average === null ? "—" : `${Math.round(average * 10) / 10}%`} /><Stat label="Below threshold" value={String(below.length)} /><Stat label="Sessions submitted" value={String(submitted.length)} /></div>
        <Panel title="Low-attendance students">
          {below.length === 0 ? <Empty>No submitted attendance records are available below the configured default threshold of 75%.</Empty> : <ReadOnlyAttendanceTable rows={below} />}
        </Panel>
        <Panel title="Session history">
          {sessions.length === 0 ? <Empty>No attendance sessions are available. Draft and submitted sessions will appear here when created through Attendance Management.</Empty> : <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-[#edf1ed] text-xs uppercase tracking-[1px] text-[#89968d]"><tr><th className="px-3 py-3">Subject</th><th className="px-3 py-3">Department</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Status</th></tr></thead><tbody className="divide-y divide-[#edf1ed]">{sessions.map((session) => <tr key={session.id}><td className="px-3 py-3">{session.subject}</td><td className="px-3 py-3">{session.department}</td><td className="px-3 py-3">{session.date}</td><td className="px-3 py-3">{session.submitted ? "Submitted" : "Draft"}</td></tr>)}</tbody></table></div>}
        </Panel>
      </div>
    </AdminPageShell>
  );
}

function ReadOnlyAttendanceTable({ rows }: { rows: { student: (typeof studentProfiles)[number]; summary: ReturnType<typeof getStudentPercentage> }[] }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-[#edf1ed] text-xs uppercase tracking-[1px] text-[#89968d]"><tr><th className="px-3 py-3">Student</th><th className="px-3 py-3">Student ID</th><th className="px-3 py-3">Attended</th><th className="px-3 py-3">Eligible</th><th className="px-3 py-3">Attendance</th></tr></thead><tbody className="divide-y divide-[#edf1ed]">{rows.map(({ student, summary }) => <tr key={student.id}><td className="px-3 py-3">{student.name}</td><td className="px-3 py-3">{student.id}</td><td className="px-3 py-3">{summary.attended}</td><td className="px-3 py-3">{summary.total}</td><td className="px-3 py-3">{summary.percentage}%</td></tr>)}</tbody></table></div>;
}

export function HodResultsPage() {
  const { results } = useHodData();
  const marks = results.flatMap((result) => result.subjects.map((subject) => ({ ...subject, studentId: result.studentId, semester: result.semester })));
  const average = marks.length ? marks.reduce((sum, subject) => sum + subject.score, 0) / marks.length : null;
  const passed = marks.filter((subject) => subject.score >= DEMO_PASS_MARK).length;
  const subjectSummary = Array.from(new Set(marks.map((mark) => mark.name))).map((name) => {
    const subjectMarks = marks.filter((mark) => mark.name === name);
    const passedSubject = subjectMarks.filter((mark) => mark.score >= DEMO_PASS_MARK).length;
    return { name, count: subjectMarks.length, average: subjectMarks.reduce((sum, mark) => sum + mark.score, 0) / subjectMarks.length, passing: Math.round((passedSubject / subjectMarks.length) * 100) };
  });
  return (
    <AdminPageShell title="Academic Results">
      <div className="mx-auto max-w-[1200px] space-y-7">
        <Header title="Academic Results" description="Review examination outcomes, subject-wise performance, passing percentages, and departmental academic trends." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Finalized students" value={String(new Set(results.map((result) => result.studentId)).size)} /><Stat label="Average marks" value={average === null ? "—" : `${Math.round(average * 10) / 10}%`} /><Stat label="Passing percentage" value={marks.length ? `${Math.round((passed / marks.length) * 100)}%` : "—"} /><Stat label="Results pending" value={String(Math.max(0, studentProfiles.length - new Set(results.map((result) => result.studentId)).size))} /></div>
        <Panel title="Subject-wise results">
          {subjectSummary.length === 0 ? <Empty>No finalized results are available. Pending results are not counted as failures.</Empty> : <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-[#edf1ed] text-xs uppercase tracking-[1px] text-[#89968d]"><tr><th className="px-3 py-3">Subject</th><th className="px-3 py-3">Evaluated</th><th className="px-3 py-3">Average marks</th><th className="px-3 py-3">Passing percentage</th></tr></thead><tbody className="divide-y divide-[#edf1ed]">{subjectSummary.map((subject) => <tr key={subject.name}><td className="px-3 py-3">{subject.name}</td><td className="px-3 py-3">{subject.count}</td><td className="px-3 py-3">{Math.round(subject.average * 10) / 10}/100</td><td className="px-3 py-3">{subject.passing}%</td></tr>)}</tbody></table></div>}
        </Panel>
        <Panel title="Finalized result register">
          {marks.length === 0 ? <Empty>No finalized result records are available.</Empty> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-[#edf1ed] text-xs uppercase tracking-[1px] text-[#89968d]"><tr><th className="px-3 py-3">Student</th><th className="px-3 py-3">Subject</th><th className="px-3 py-3">Semester</th><th className="px-3 py-3">Marks</th><th className="px-3 py-3">Result</th></tr></thead><tbody className="divide-y divide-[#edf1ed]">{marks.map((mark) => <tr key={`${mark.studentId}-${mark.name}-${mark.semester}`}><td className="px-3 py-3">{studentProfiles.find((student) => student.id === mark.studentId)?.name ?? mark.studentId}</td><td className="px-3 py-3">{mark.name}</td><td className="px-3 py-3">{mark.semester}</td><td className="px-3 py-3">{mark.score}/100</td><td className="px-3 py-3">{mark.score >= DEMO_PASS_MARK ? "Pass" : "Fail"}</td></tr>)}</tbody></table></div>}
        </Panel>
      </div>
    </AdminPageShell>
  );
}
