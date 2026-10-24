import type { StudentProfile } from "@/lib/students";

export const READINESS_THRESHOLDS = {
  ready: 80,
  inPreparation: 50,
} as const;

export const TPO_SKILL_THRESHOLDS = {
  strength: 75,
  gap: 65,
} as const;

export type TpoStatus =
  | "Ready"
  | "In Preparation"
  | "Not Ready"
  | "Not Assessed";

export type TpoStudent = {
  student: StudentProfile;
  cgpa: number | null;
  readiness: number | null;
  status: TpoStatus;
  skills: { label: string; score: number | null }[];
  strengths: string[];
  weaknesses: string[];
  notAssessed: string[];
  recommendations: string[];
  lastAssessmentDate: string | null;
};

export function getTpoStatus(readiness: number | null): TpoStatus {
  if (readiness === null) return "Not Assessed";
  if (readiness >= READINESS_THRESHOLDS.ready) return "Ready";
  if (readiness >= READINESS_THRESHOLDS.inPreparation) return "In Preparation";
  return "Not Ready";
}

export function getTpoStudent(student: StudentProfile): TpoStudent {
  const skills = [
    { label: "Academic foundation", score: finiteScore(student.academicScore) },
    { label: "Practical skills", score: finiteScore(student.skillsScore) },
    { label: "Engagement", score: finiteScore(student.engagementScore) },
    { label: "Assignment completion", score: finiteScore(student.assignmentCompletion) },
  ];
  const assessed = skills.filter((skill) => skill.score !== null);
  const strengths = assessed
    .filter((skill) => (skill.score ?? 0) >= TPO_SKILL_THRESHOLDS.strength)
    .map((skill) => skill.label);
  const weaknesses = assessed
    .filter((skill) => (skill.score ?? 0) < TPO_SKILL_THRESHOLDS.gap)
    .map((skill) => skill.label);
  const notAssessed = skills
    .filter((skill) => skill.score === null)
    .map((skill) => skill.label);

  return {
    student,
    cgpa: null,
    readiness: finiteScore(student.placementScore),
    status: getTpoStatus(finiteScore(student.placementScore)),
    skills,
    strengths,
    weaknesses,
    notAssessed,
    recommendations: getRecommendations(weaknesses),
    lastAssessmentDate: null,
  };
}

function finiteScore(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getRecommendations(weaknesses: string[]) {
  const recommendations: string[] = [];
  if (weaknesses.includes("Practical skills")) recommendations.push("Technical practice and coding exercises");
  if (weaknesses.includes("Engagement")) recommendations.push("Interview participation and career mentoring");
  if (weaknesses.includes("Assignment completion")) recommendations.push("Project completion and portfolio review");
  if (weaknesses.includes("Academic foundation")) recommendations.push("Core subject revision");
  return recommendations.length ? recommendations : ["Continue placement preparation"];
}

