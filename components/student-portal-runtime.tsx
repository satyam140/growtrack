"use client";

import { BrowserRouter } from "react-router-dom";
import App from "@student/App";
<<<<<<< HEAD
import { migrateDemoData } from "@/lib/dataset/migrate";

// Clear saved data from an older dataset before any portal code reads it.
migrateDemoData();
=======
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd

export default function StudentPortalRuntime() {
  return (
    <div id="growthtrack-portal">
      <BrowserRouter
        basename="/student"
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </div>
  );
}
