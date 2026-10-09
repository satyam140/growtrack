"use client";

import dynamic from "next/dynamic";

const StudentPortalRuntime = dynamic(
  () => import("./student-portal-runtime"),
  {
    ssr: false,
    loading: () => (
      <div
        id="growthtrack-portal"
        className="grid min-h-screen place-items-center bg-brand-950 text-sm text-white"
        aria-label="Loading student dashboard"
      >
        Loading student dashboard…
      </div>
    ),
  },
);

export default function StudentPortalApp() {
  return <StudentPortalRuntime />;
}
