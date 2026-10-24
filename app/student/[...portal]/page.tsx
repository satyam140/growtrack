<<<<<<< HEAD
=======
import { connection } from "next/server";
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
import StudentPortalApp from "@/components/student-portal-app";

const studentPortalPaths = [
  ["dashboard"],
  ["dashboard", "attendance"],
  ["dashboard", "results"],
  ["dashboard", "engagement"],
  ["dashboard", "placement"],
  ["dashboard", "placement", "aptitude"],
  ["dashboard", "placement", "interview"],
<<<<<<< HEAD
  ["dashboard", "placement", "soft-skills"],
=======
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
  ["dashboard", "skills"],
  ["dashboard", "skills", "coding"],
  ["dashboard", "feedback"],
];

export function generateStaticParams() {
  return studentPortalPaths.map((portal) => ({ portal }));
}

<<<<<<< HEAD
export default function StudentPortalPage() {
=======
export default async function StudentPortalPage() {
  await connection();
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
  return <StudentPortalApp />;
}
