
"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import { studentProfiles, type StudentProfile } from "@/lib/students";
import { AdminPageShell } from "@/components/admin-page-shell";

const students = studentProfiles;

const departments = [
  "All departments",
  ...Array.from(new Set(students.map((student) => student.department))),
];

const riskClass: Record<StudentProfile["risk"], string> = {
  High: "student-risk-high",
  Medium: "student-risk-medium",
  Low: "student-risk-low",
};

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [risk, setRisk] = useState("All risks");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentProfile | null>(null);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All departments" ||
        student.department === department;

      const matchesRisk = risk === "All risks" || student.risk === risk;

      return matchesSearch && matchesDepartment && matchesRisk;
    });
  }, [search, department, risk]);

  return (
    <AdminPageShell title="Students">
      <div className="directory-page">
      <div className="directory-heading">
        <div>
          <div className="eyebrow">CAMPUS DIRECTORY</div>
          <h1>Student list</h1>
        </div>
        <div className="directory-demo-label">
          <span /> Sample student records
        </div>
      </div>

      <section className="directory-panel">
        <div className="directory-panel-heading">
          <div>
            <h2>All students</h2>
            <p>
              Showing {filteredStudents.length} of {students.length} sample
              records
            </p>
          </div>
          <span className="directory-record-tag">Student directory</span>
        </div>

        <div className="directory-filters">
          <label className="directory-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by student name or ID"
              aria-label="Search by student name or ID"
            />
            {search && (
              <button
                className="directory-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </label>

          <label className="directory-select-wrap">
            <span className="sr-only">Filter by department</span>
            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>

          <label className="directory-select-wrap">
            <span className="sr-only">Filter by risk level</span>
            <select
              value={risk}
              onChange={(event) => setRisk(event.target.value)}
            >
              <option>All risks</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="directory-table-wrap">
          <table className="directory-table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>DEPARTMENT / YEAR</th>
                <th>ATTENDANCE</th>
                <th>ACADEMIC SCORE</th>
                <th>SUCCESS SCORE</th>
                <th>RISK LEVEL</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="directory-student-cell">
                      <div className="directory-avatar">
                        {student.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="directory-student-name">
                          {student.name}
                        </div>
                        <div className="directory-student-id">
                          {student.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="directory-department">
                      {student.department}
                    </div>
                    <div className="directory-year">{student.year}</div>
                  </td>
                  <td>
                    <div className="directory-progress-cell">
                      <span
                        className={
                          student.attendance < 75
                            ? "directory-number-low"
                            : "directory-number"
                        }
                      >
                        {student.attendance}%
                      </span>
                      <div className="directory-progress-track">
                        <div
                          className={
                            student.attendance < 75
                              ? "directory-progress-fill directory-progress-warning"
                              : "directory-progress-fill"
                          }
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{student.academicScore}/100</td>
                  <td>
                    <strong className="directory-score">
                      {student.successScore}
                    </strong>
                    <span className="directory-score-total"> / 100</span>
                  </td>
                  <td>
                    <span className={`directory-risk ${riskClass[student.risk]}`}>
                      <span />
                      {student.risk} risk
                    </span>
                  </td>
                  <td>
                    <button
                      className="directory-view-button"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="directory-empty">
                    No students match these filters. Try changing your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="directory-table-footer">
          <span>
            Demo dataset · {filteredStudents.length} record
            {filteredStudents.length === 1 ? "" : "s"} displayed
          </span>
          <button
            className="directory-reset-button"
            onClick={() => {
              setSearch("");
              setDepartment("All departments");
              setRisk("All risks");
            }}
          >
            Reset filters
          </button>
        </div>
      </section>

      {selectedStudent && (
        <div
          className="student-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedStudent(null);
            }
          }}
        >
          <section
            className="student-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-detail-title"
          >
            <div className="student-modal-header">
              <button
                className="student-modal-back"
                onClick={() => setSelectedStudent(null)}
              >
                <ArrowLeft size={16} /> Back to directory
              </button>
              <button
                className="student-modal-close"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close student profile"
              >
                <X size={19} />
              </button>
            </div>

            <div className="student-detail-identity">
              <div className="student-detail-avatar">
                {selectedStudent.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div>
                <div className="eyebrow">STUDENT PROFILE</div>
                <h2 id="student-detail-title">{selectedStudent.name}</h2>
                <p>
                  {selectedStudent.id} · {selectedStudent.department} ·{" "}
                  {selectedStudent.year}
                </p>
              </div>
            </div>

            <div className="student-detail-score">
              <div>
                <span>Student Success Score</span>
                <strong>{selectedStudent.successScore}<small>/100</small></strong>
              </div>
              <span className={`directory-risk ${riskClass[selectedStudent.risk]}`}>
                <span />
                {selectedStudent.risk} risk
              </span>
            </div>

            <h3 className="student-detail-section-title">Performance breakdown</h3>
            <div className="student-breakdown">
              {[
                ["Academic performance", selectedStudent.academicScore],
                ["Attendance", selectedStudent.attendance],
                ["Assignment completion", selectedStudent.assignmentCompletion],
                ["Practical skills", selectedStudent.skillsScore],
                ["Placement readiness", selectedStudent.placementScore],
                ["Engagement", selectedStudent.engagementScore],
              ].map(([label, score]) => (
                <div className="student-breakdown-row" key={label}>
                  <div className="student-breakdown-heading">
                    <span>{label}</span>
                    <strong>{score}%</strong>
                  </div>
                  <div className="directory-progress-track">
                    <div
                      className="directory-progress-fill"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <h3 className="student-detail-section-title">Risk factors and guidance</h3>
            {selectedStudent.riskReasons.length ? (
              <div className="student-risk-reasons">
                {selectedStudent.riskReasons.map((reason) => (
                  <div className="student-risk-reason" key={reason}>
                    <ShieldAlert size={16} />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="student-positive-note">
                <CheckCircle2 size={17} />
                No current risk factors in this sample record. Continue regular
                progress monitoring.
              </div>
            )}

            <div className="student-profile-disclaimer">
              <BookOpen size={15} />
              Sample profile for demonstration. Scores and risk flags must be
              validated against actual institutional data before use.
            </div>
          </section>
        </div>
      )}
      </div>
    </AdminPageShell>
  );
}