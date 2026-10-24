
import { connection } from "next/server";

import StudentPortalApp from "@/components/student-portal-app";

const studentPortalPaths = [
  ["dashboard"],
  ["dashboard", "attendance"],
  ["dashboard", "results"],
  ["dashboard", "engagement"],
  ["dashboard", "placement"],
  ["dashboard", "placement", "aptitude"],
  ["dashboard", "placement", "interview"],

  ["dashboard", "placement", "soft-skills"],

  ["dashboard", "skills"],
  ["dashboard", "skills", "coding"],
  ["dashboard", "feedback"],
];

export function generateStaticParams() {
  return studentPortalPaths.map((portal) => ({ portal }));
}


export default async function StudentPortalPage() {
  await connection();

  return <StudentPortalApp />;
}
