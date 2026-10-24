import type { StudentProfile } from "@/lib/students";

type AnalyticsStudent = Pick<
  StudentProfile,
  | "id"
  | "name"
  | "department"
  | "academicScore"
  | "attendance"
  | "assignmentCompletion"
  | "skillsScore"
  | "placementScore"
  | "engagementScore"
  | "successScore"
  | "risk"
  | "riskReasons"
  | "cgpa"
  | "sgpa"
>;

export type AdminAnalyticsAnswer = {
  title: string;
  summary: string;
  evidence: string[];
  students: AnalyticsStudent[];
  recommendation: string;
  includeGpaDetails: boolean;
};

type ScoreField =
  | "academicScore"
  | "attendance"
  | "assignmentCompletion"
  | "skillsScore"
  | "engagementScore";

const scoreFactors: { field: ScoreField; label: string }[] = [
  { field: "academicScore", label: "Academic score" },
  { field: "attendance", label: "Attendance" },
  { field: "assignmentCompletion", label: "Assignment completion" },
  { field: "skillsScore", label: "Skills score" },
  { field: "engagementScore", label: "Engagement score" },
];

function average(students: StudentProfile[], field: ScoreField | "placementScore") {
  if (students.length === 0) return 0;
  return Math.round(
    students.reduce((total, student) => total + student[field], 0) /
      students.length,
  );
}

function departmentFromQuestion(
  question: string,
  students: StudentProfile[],
): string | undefined {
  const departments = [...new Set(students.map((student) => student.department))];
  const aliases: Record<string, string[]> = {
    "Computer Science": ["cse", "computer science", "computer science engineering"],
    "Information Technology": ["information technology", "information tech"],
    Electronics: ["electronics", "ece"],
    "Mechanical Engineering": ["mechanical engineering", "mechanical", "mech"],
  };

  return departments.find((department) => {
    const candidates = aliases[department] ?? [department.toLowerCase()];
    return candidates.some((alias) => {
      const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escapedAlias}\\b`, "i").test(question);
    });
  });
}

function answer(
  title: string,
  summary: string,
  evidence: string[],
  students: StudentProfile[],
  recommendation: string,
  includeGpaDetails = false,
): AdminAnalyticsAnswer {
  return {
    title,
    summary,
    evidence,
    students,
    recommendation,
    includeGpaDetails,
  };
}

export function getAdminAnalyticsAnswer(
  question: string,
  profiles: StudentProfile[],
): AdminAnalyticsAnswer {
  const normalizedQuestion = question.trim().toLowerCase();
  const department = departmentFromQuestion(normalizedQuestion, profiles);
  const asksGpa = /\b(cgpa|sgpa|gpa)\b/.test(normalizedQuestion);
  const asksRisk =
    /(risk|at[- ]risk|struggl|most vulnerable|needs? (support|attention))/.test(
      normalizedQuestion,
    );
  const requestsAcademicPlacementMismatch =
    /(cgpa|good marks|high academic|good academic|strong academic)/.test(
      normalizedQuestion,
    ) &&
    /(placement|employab|readiness)/.test(normalizedQuestion);

  if (requestsAcademicPlacementMismatch) {
    const matches = asksGpa
      ? profiles
          .filter((student) => student.placementScore < 65)
          .sort((left, right) => left.placementScore - right.placementScore)
      : profiles
          .filter(
            (student) =>
              student.academicScore >= 70 && student.placementScore < 65,
          )
          .sort(
            (left, right) =>
              left.placementScore - right.placementScore ||
              right.academicScore - left.academicScore,
          );

    return answer(
      asksGpa
        ? "Lower placement readiness; official GPA not available"
        : "Strong academics, lower placement readiness",
      asksGpa
        ? `${matches.length} of ${profiles.length} sample students have placement scores below 65. No official CGPA is available to verify which students have strong CGPA.`
        : `${matches.length} of ${profiles.length} sample students have an academic score of at least 70 and a placement score below 65.`,
      asksGpa
        ? [
            "CGPA and SGPA are shown only when officially stored; none are recorded in the current sample profiles.",
            "Match criteria: placement score < 65. Academic scores are not used as a CGPA substitute.",
          ]
        : [
            "Academic score is used as a proxy for strong marks; this dataset does not contain CGPA.",
            "Match criteria: academic score ≥ 70 and placement score < 65.",
          ],
      matches,
      asksGpa
        ? "Review official academic records to verify CGPA before identifying high-CGPA students. These lower-readiness students may benefit from role-focused skills practice and a mock interview."
        : "Offer these students role-focused skills practice and a mock interview, then review their placement score after the next preparation cycle.",
      asksGpa,
    );
  }

  if (asksGpa) {
    const scopedStudents = profiles.filter(
      (student) =>
        (!department || student.department === department) &&
        (!asksRisk || student.risk !== "Low"),
    );
    const matchingStudents = scopedStudents.filter(
      (student) => (student.cgpa !== undefined || student.sgpa !== undefined),
    );
    const recordedCount = matchingStudents.length;
    const students =
      department ||
      asksRisk ||
      /(students?|names?|show|list|which)/.test(normalizedQuestion)
        ? scopedStudents
        : matchingStudents;

    return answer(
      "Official CGPA and SGPA records",
      recordedCount > 0
        ? `${recordedCount} of ${scopedStudents.length} matching sample student profiles have officially recorded CGPA or SGPA values.`
        : `No official CGPA or SGPA values are recorded for the ${scopedStudents.length} matching sample student profiles.`,
      [
        "CGPA and SGPA are shown only when officially stored on the student profile.",
        "Academic score is not converted into CGPA or SGPA.",
        ...(department
          ? [`Showing records for ${department}.`]
          : []),
      ],
      students,
      recordedCount > 0
        ? "Review the recorded values with the student's academic history and use your institution's criteria for any follow-up."
        : "Add verified CGPA and SGPA values to the official student records to make them available here.",
      true,
    );
  }

  if (asksRisk) {
    const matches = profiles
      .filter((student) => student.risk !== "Low")
      .sort((left, right) => {
        const riskOrder = { High: 0, Medium: 1, Low: 2 };
        return (
          riskOrder[left.risk] - riskOrder[right.risk] ||
          left.successScore - right.successScore
        );
      });
    const highRiskCount = matches.filter(
      (student) => student.risk === "High",
    ).length;

    return answer(
      "Students to prioritize for a supportive review",
      `${matches.length} of ${profiles.length} sample students are marked medium or high risk, including ${highRiskCount} at high risk. The list is ordered by risk level, then lower success score.`,
      [
        "Risk labels and success scores come from the student profiles.",
        "Review the listed attendance, academic and placement scores alongside each student's recorded risk reasons.",
        "These flags help prioritize support; they are not a substitute for a faculty review.",
      ],
      matches.slice(0, 8),
      "Start with the high-risk students, validate their latest records, and agree on an individual academic or attendance follow-up with each student.",
      asksGpa,
    );
  }

  const asksPlacementDrivers =
    /(factor|driv|why|cause|poor placement|placement readiness|employab|readiness)/.test(
      normalizedQuestion,
    );

  if (asksPlacementDrivers && !department) {
    const lowerReadiness = profiles.filter(
      (student) => student.placementScore < 65,
    );
    const otherStudents = profiles.filter(
      (student) => student.placementScore >= 65,
    );
    const factors = scoreFactors
      .map(({ field, label }) => ({
        label,
        lowerAverage: average(lowerReadiness, field),
        comparisonAverage: average(otherStudents, field),
        gap:
          average(otherStudents, field) - average(lowerReadiness, field),
      }))
      .sort((left, right) => right.gap - left.gap);
    const weakestFactor = factors[0];

    return answer(
      "Signals associated with lower placement readiness",
      `${lowerReadiness.length} of ${profiles.length} sample students have a placement score below 65. The comparisons below show cohort averages; they indicate associations, not proven causes.`,
      [
        ...factors.slice(0, 3).map(
          (factor) =>
            `${factor.label}: ${factor.lowerAverage}/100 for students below 65 placement readiness vs. ${factor.comparisonAverage}/100 for the rest (difference: ${factor.gap} points).`,
        ),
        `Placement-readiness comparison: ${average(lowerReadiness, "placementScore")}/100 vs. ${average(otherStudents, "placementScore")}/100.`,
      ],
      lowerReadiness
        .slice()
        .sort((left, right) => left.placementScore - right.placementScore)
        .slice(0, 8),
      weakestFactor
        ? `Prioritize a targeted placement support cycle around ${weakestFactor.label.toLowerCase()}, the largest observed gap. Pair it with role-specific practice and a follow-up readiness check; verify individual needs before assigning support.`
        : "Review the placement-readiness records and speak with students to identify an appropriate support action.",
      asksGpa,
    );
  }

  if (department) {
    const departmentStudents = profiles.filter(
      (student) => student.department === department,
    );

    if (departmentStudents.length === 0) {
      return answer(
        `${department} analytics`,
        `No sample student profiles were found for ${department}.`,
        ["Department results are computed from the student profiles currently loaded in the dashboard."],
        [],
        "Confirm that this department is present in the current student dataset before planning an intervention.",
      );
    }

    const lowReadiness = departmentStudents.filter(
      (student) => student.placementScore < 65,
    );
    const weakestFactor = scoreFactors
      .map(({ field, label }) => ({
        field,
        label,
        score: average(departmentStudents, field),
      }))
      .sort((left, right) => left.score - right.score)[0];
    const studentsToReview = departmentStudents
      .slice()
      .sort((left, right) => left.placementScore - right.placementScore)
      .slice(0, 8);

    return answer(
      `${department}: intervention priority`,
      `${lowReadiness.length} of ${departmentStudents.length} sample students have placement scores below 65. The department's average placement score is ${average(departmentStudents, "placementScore")}/100.`,
      [
        `Average academic score: ${average(departmentStudents, "academicScore")}/100.`,
        `Average skills score: ${average(departmentStudents, "skillsScore")}/100.`,
        `Average attendance: ${average(departmentStudents, "attendance")}%.`,
        weakestFactor
          ? `Lowest measured department signal: ${weakestFactor.label.toLowerCase()} at ${weakestFactor.score}/100.`
          : "No additional department performance signals are available.",
      ],
      studentsToReview,
      weakestFactor
        ? `Pilot a short ${weakestFactor.label.toLowerCase()} support cycle for the students listed, pair it with placement practice, and review progress before expanding the intervention.`
        : "Review the department's individual student records and agree on a focused support plan.",
      asksGpa,
    );
  }

  if (asksPlacementDrivers) {
    return answer(
      "Placement-readiness signals",
      "Ask about the factors associated with lower placement readiness, or name a department to see its intervention priority.",
      ["The copilot compares the student profiles' placement, academic, attendance, skills, assignment, and engagement scores."],
      [],
      "Try “What factors are driving poor placement readiness?” or “What intervention should we prioritize for CSE?”",
    );
  }

  return answer(
    "I couldn't match that question to a supported analysis",
    "I can answer questions about at-risk students, placement-readiness drivers, academic/placement mismatches, or a department's intervention priority.",
    [
      "Answers are computed from the student profiles currently loaded in this dashboard.",
      "Use one of the suggested questions or name a department such as CSE, Electronics, or Mechanical Engineering.",
    ],
    [],
    "Try “Which students are most at risk this semester?”, “What factors are driving poor placement readiness?”, or “What intervention should we prioritize for CSE?”",
  );
}
