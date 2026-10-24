"use client";

import dynamic from "next/dynamic";
<<<<<<< HEAD
import { Suspense } from "react";

const Loading = () => (
  <div
    id="growthtrack-portal"
    className="grid min-h-screen place-items-center bg-brand-950 text-sm text-white"
    aria-label="Loading student dashboard"
  >
    Loading student dashboard…
  </div>
);

const StudentPortalRuntime = dynamic(() => import("./student-portal-runtime"), { ssr: false, loading: Loading });

// The portal renders only in the browser; the Suspense boundary is what lets Next prerender this route's shell.
export default function StudentPortalApp() {
  return (
    <Suspense fallback={<Loading />}>
      <StudentPortalRuntime />
    </Suspense>
  );
=======

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
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
}
