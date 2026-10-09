"use client";

import { BrowserRouter } from "react-router-dom";
import App from "@student/App";

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
