"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Bot,
  Check,
  CornerDownLeft,
  MessageCircle,
  Minimize2,
  Sparkles,
} from "lucide-react";
import {
  getAdminAnalyticsAnswer,
  type AdminAnalyticsAnswer,
} from "@/lib/admin-analytics";
import { studentProfiles } from "@/lib/students";

const suggestedQuestions = [
  "Which students are most at risk this semester?",
  "What factors are driving poor placement readiness?",
  "Show me students who have good CGPA but low employability scores.",
  "What intervention should we prioritize for the CSE department?",
];

const adminWorkspacePaths = [
  "/admin",
  "/students",
  "/academic-performance",
  "/results",
  "/placement-readiness",
  "/interventions",
  "/settings",
  "/help",
  "/skill-gap",
  "/mock-interviews",
];

const COPILOT_DISCOVERY_KEY = "growthtrack-copilot-discovery-seen";

export function AnalyticsCopilot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AdminAnalyticsAnswer | null>(null);

  const isAdminWorkspace = adminWorkspacePaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  useEffect(() => {
    if (!isAdminWorkspace || isOpen) return;

    try {
      if (window.localStorage.getItem(COPILOT_DISCOVERY_KEY)) return;
    } catch (error) {
      console.error("Could not read Copilot discovery preference.", error);
    }

    const showTimeoutId = window.setTimeout(() => setShowDiscovery(true), 0);
    const dismissTimeoutId = window.setTimeout(() => {
      setShowDiscovery(false);
      try {
        window.localStorage.setItem(COPILOT_DISCOVERY_KEY, "true");
      } catch (error) {
        console.error("Could not save Copilot discovery preference.", error);
      }
    }, 6000);

    return () => {
      window.clearTimeout(showTimeoutId);
      window.clearTimeout(dismissTimeoutId);
    };
  }, [isAdminWorkspace, isOpen]);

  function openCopilot() {
    setShowDiscovery(false);
    setIsOpen(true);
    try {
      window.localStorage.setItem(COPILOT_DISCOVERY_KEY, "true");
    } catch (error) {
      console.error("Could not save Copilot discovery preference.", error);
    }
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    setResult(getAdminAnalyticsAnswer(trimmedQuestion, studentProfiles));
  }

  if (!isAdminWorkspace) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section
          id="analytics-copilot-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="analytics-copilot-heading"
          aria-describedby="analytics-copilot-description"
          className="flex max-h-[min(82vh,760px)] w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl border border-[#dce8df] bg-white shadow-[0_16px_60px_rgba(25,63,49,0.22)] sm:w-[420px]"
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[#e9eee8] bg-gradient-to-r from-[#f3f8f4] to-white px-4 py-4">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#28684e] text-white">
                <Bot size={20} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="analytics-copilot-heading"
                    className="text-[13px] font-semibold text-[#26382c]"
                  >
                    Analytics Copilot
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[8px] font-medium text-[#55715e] ring-1 ring-[#dce8df]">
                    <Sparkles size={10} />
                    Evidence-backed
                  </span>
                </div>
                <p
                  id="analytics-copilot-description"
                  className="mt-1 text-[10px] leading-4 text-[#718075]"
                >
                  Ask about student performance and get grounded insights.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close analytics copilot"
              className="shrink-0 rounded-md p-1.5 text-[#718075] transition hover:bg-[#edf3ee] hover:text-[#26382c]"
            >
              <Minimize2 size={17} />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
            <p className="mb-3 text-[9px] text-[#899289]">
              Using {studentProfiles.length} illustrative student profiles
            </p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {suggestedQuestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuestion(suggestion);
                    setResult(
                      getAdminAnalyticsAnswer(suggestion, studentProfiles),
                    );
                  }}
                  className="rounded-md border border-[#e2e7df] bg-white px-2 py-1.5 text-left text-[9px] leading-4 text-[#536056] transition hover:border-[#b6cebd] hover:bg-[#f7faf7]"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {result && (
              <div
                aria-live="polite"
                className="rounded-md border border-[#e2e9e2] bg-[#fbfcfa]"
              >
                <div className="flex justify-end p-3 pb-0">
                  <p className="max-w-[90%] rounded-lg rounded-br-sm bg-[#28684e] px-3 py-2 text-[9px] leading-4 text-white">
                    {question}
                  </p>
                </div>
                <div className="border-b border-[#e9eee8] px-3 py-3">
                  <p className="flex items-center gap-2 text-[12px] font-semibold text-[#344037]">
                    <Check size={15} className="shrink-0 text-[#28684e]" />
                    {result.title}
                  </p>
                  <p className="mt-2 text-[10px] leading-5 text-[#5f6c61]">
                    {result.summary}
                  </p>
                </div>

                <div className="space-y-4 p-3">
                  <div>
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.7px] text-[#55715e]">
                      Evidence
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      {result.evidence.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-[9px] leading-4 text-[#657167]"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7da188]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 rounded-md border border-[#dce9df] bg-[#f5faf6] p-2.5">
                      <p className="text-[8px] font-bold uppercase tracking-[0.6px] text-[#28654d]">
                        Suggested next step
                      </p>
                      <p className="mt-1.5 text-[9px] leading-4 text-[#536056]">
                        {result.recommendation}
                      </p>
                      <Link
                        href="/interventions"
                        className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-[#28684e] hover:underline"
                      >
                        Review interventions <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[9px] font-bold uppercase tracking-[0.7px] text-[#55715e]">
                        Matching students
                      </h3>
                      {result.students.length > 0 && (
                        <Link
                          href="/students"
                          className="text-[9px] font-semibold text-[#28684e] hover:underline"
                        >
                          Student directory
                        </Link>
                      )}
                    </div>
                    {result.students.length > 0 ? (
                      <ul className="mt-2 max-h-52 space-y-2 overflow-y-auto">
                        {result.students.map((student) => (
                          <li
                            key={student.id}
                            className="rounded-md border border-[#e5e9e3] bg-white p-2.5"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-[10px] font-semibold text-[#344037]">
                                  {student.name}
                                </p>
                                <p className="mt-1 text-[8px] text-[#899289]">
                                  {student.id} · {student.department}
                                </p>
                              </div>
                              <span className="rounded bg-[#f0f2ee] px-1.5 py-0.5 text-[8px] text-[#637066]">
                                {student.risk} risk
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[8px] text-[#667168]">
                              <span>Academic {student.academicScore}</span>
                              <span>Placement {student.placementScore}</span>
                              <span>Attendance {student.attendance}%</span>
                              {result.includeGpaDetails && (
                                <>
                                  <span>
                                    CGPA{" "}
                                    {student.cgpa !== undefined
                                      ? student.cgpa.toFixed(2)
                                      : "Not recorded"}
                                  </span>
                                  <span>
                                    SGPA{" "}
                                    {student.sgpa !== undefined
                                      ? student.sgpa.toFixed(2)
                                      : "Not recorded"}
                                  </span>
                                </>
                              )}
                            </div>
                            {student.riskReasons.length > 0 && (
                              <p className="mt-2 text-[8px] leading-4 text-[#7b857c]">
                                {student.riskReasons.join(" ")}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 rounded-md border border-dashed border-[#dfe5dc] bg-white p-3 text-[9px] leading-4 text-[#7b857c]">
                        No matching student records to list for this answer.
                      </p>
                    )}
                  </div>
                </div>

                <p className="border-t border-[#e9eee8] px-3 py-2 text-[8px] leading-4 text-[#899289]">
                  Source: illustrative student profiles. Rule-based analysis,
                  not an external AI service. Validate records before acting.
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={submitQuestion}
            className="flex shrink-0 items-center gap-2 border-t border-[#e9eee8] bg-white p-3"
          >
            <label htmlFor="analytics-copilot-question" className="sr-only">
              Ask the student success data
            </label>
            <input
              id="analytics-copilot-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about student performance..."
              className="h-10 min-w-0 flex-1 rounded-md border border-[#dfe5dc] bg-white px-3 text-[11px] text-[#303b32] placeholder:text-[#929a92]"
              maxLength={300}
            />
            <button
              type="submit"
              disabled={!question.trim()}
              aria-label="Analyze question"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#28684e] text-white transition hover:bg-[#1f583f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CornerDownLeft size={16} />
            </button>
          </form>
        </section>
      ) : (
        <div className="copilot-launcher-wrap group relative">
          <div
            id="analytics-copilot-tooltip"
            role="tooltip"
            className={`copilot-launcher-tooltip ${
              showDiscovery ? "copilot-launcher-tooltip-discover" : ""
            }`}
          >
            <span className="copilot-tooltip-accent" />
            <span>
              <strong>AI Copilot</strong>
              <small>Your personal campus assistant</small>
            </span>
          </div>
          <button
            type="button"
            onClick={openCopilot}
            aria-label="Open AI Copilot"
            aria-describedby="analytics-copilot-tooltip"
            aria-expanded={isOpen}
            aria-controls="analytics-copilot-panel"
            className="copilot-launcher-button flex h-14 w-14 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d9d7d] focus-visible:ring-offset-4"
          >
            <MessageCircle size={24} strokeWidth={2.1} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
