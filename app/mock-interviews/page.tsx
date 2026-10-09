
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Play,
  Square,
  CheckCircle2,
  Clock,
  Search,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Award,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Camera,
  Brain,
  Target,
  TrendingUp,
} from "lucide-react";
import { studentProfiles } from "@/lib/students";
import {
  getDefaultDemoStudentId,
  readSelectedDemoStudentId,
  saveSelectedDemoStudentId,
  saveMockInterviewResult,
  subscribeToSelectedDemoStudentId,
} from "@/lib/student-portal";

type Question = {
  category: string;
  question: string;
  keywords: string[];
  idealPoints: string[];
};

type AnswerResult = {
  question: string;
  category: string;
  answer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
};

const QUESTIONS: Question[] = [
  {
    category: "Introduction",
    question:
      "Tell me about yourself, your education, and the kind of role you are looking for.",
    keywords: ["education", "project", "skill", "experience", "goal", "role"],
    idealPoints: [
      "A clear educational background",
      "Relevant technical or professional skills",
      "A project, achievement, or experience",
      "A career goal connected to the role",
    ],
  },
  {
    category: "Technical Knowledge",
    question:
      "Explain the difference between an array and a linked list. When would you use each?",
    keywords: [
      "array",
      "linked list",
      "memory",
      "index",
      "insertion",
      "deletion",
      "access",
    ],
    idealPoints: [
      "Arrays store elements in indexed, contiguous storage in typical implementations",
      "Linked lists connect nodes using references or pointers",
      "Arrays generally provide fast indexed access",
      "Linked lists can support efficient insertion or deletion when the node position is known",
    ],
  },
  {
    category: "Problem Solving",
    question:
      "Describe a challenging problem you faced in a project. How did you solve it?",
    keywords: [
      "problem",
      "challenge",
      "solution",
      "debug",
      "analyze",
      "result",
      "tested",
      "team",
    ],
    idealPoints: [
      "A specific problem and its context",
      "The steps taken to investigate it",
      "The reasoning behind the chosen solution",
      "The outcome and lesson learned",
    ],
  },
  {
    category: "Communication",
    question:
      "How would you explain a complex technical concept to a non-technical team member?",
    keywords: [
      "simple",
      "example",
      "analogy",
      "understand",
      "audience",
      "feedback",
      "explain",
    ],
    idealPoints: [
      "Use plain, accessible language",
      "Give a relevant example or analogy",
      "Avoid unnecessary jargon",
      "Check understanding and invite questions",
    ],
  },
  {
    category: "Behavioral",
    question:
      "Tell me about a time you worked in a team. What was your contribution, and what did you learn?",
    keywords: [
      "team",
      "collaborate",
      "responsibility",
      "contribution",
      "communication",
      "result",
      "learned",
      "helped",
    ],
    idealPoints: [
      "Explain the team goal and situation",
      "Describe your individual contribution",
      "Show communication and collaboration",
      "Explain the outcome and what you learned",
    ],
  },
];

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function subscribeToBrowserCapabilities() {
  return () => {};
}

function getSpeechRecognitionSupport() {
  if (typeof window === "undefined") return false;
  const browser = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition);
}

function getServerSpeechRecognitionSupport() {
  return false;
}

function evaluateAnswer(
  question: Question,
  answer: string
): AnswerResult {
  const cleanAnswer = answer.trim();
  const normalized = cleanAnswer.toLowerCase();
  const words = normalized.match(/\b[\w'-]+\b/g) ?? [];

  const matchedKeywords = question.keywords.filter((keyword) =>
    normalized.includes(keyword.toLowerCase())
  );

  const keywordRatio = matchedKeywords.length / question.keywords.length;

  const hasStructure =
    /\b(first|second|finally|because|therefore|for example|such as|as a result|step|then|however)\b/i.test(
      cleanAnswer
    );

  const hasExample =
    /\b(example|for instance|project|when i|in my|such as)\b/i.test(
      cleanAnswer
    );

  const lengthScore = Math.min(words.length / 70, 1);
  const relevanceScore = Math.min(keywordRatio * 1.5, 1);

  let score = Math.round(
    15 +
      relevanceScore * 45 +
      lengthScore * 20 +
      (hasStructure ? 10 : 0) +
      (hasExample ? 10 : 0)
  );

  if (words.length < 8) score = Math.min(score, 25);
  if (words.length >= 25 && matchedKeywords.length >= 2) {
    score = Math.max(score, 55);
  }

  score = Math.max(0, Math.min(100, score));

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (words.length >= 25) {
    strengths.push("You provided a reasonably developed response.");
  } else {
    improvements.push("Expand your answer with more specific details.");
  }

  if (matchedKeywords.length >= 2) {
    strengths.push("Your answer includes relevant concepts for this question.");
  } else {
    improvements.push(
      "Address the key concepts directly instead of giving a general response."
    );
  }

  if (hasExample) {
    strengths.push("You included an example or practical context.");
  } else {
    improvements.push(
      "Include a real example from a project, class, or experience."
    );
  }

  if (hasStructure) {
    strengths.push("Your wording suggests an attempt to organize the explanation.");
  } else {
    improvements.push(
      "Structure your response into situation, action, and result where appropriate."
    );
  }

  let feedback = "Keep practicing clear, relevant, and specific answers.";

  if (score >= 80) {
    feedback =
      "Strong response according to the practice scoring rules. Keep your answer specific and support your points with evidence.";
  } else if (score >= 60) {
    feedback =
      "Good starting point. Add more precise details and explain your reasoning to make the answer stronger.";
  } else if (score >= 35) {
    feedback =
      "Your answer addresses part of the question. Focus on the main concepts and develop your explanation.";
  } else {
    feedback =
      "Try again with a more complete answer. Explain your approach and include at least one relevant detail or example.";
  }

  return {
    question: question.question,
    category: question.category,
    answer: cleanAnswer || "No answer submitted.",
    score,
    feedback,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  };
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export default function MockInterviewsPage() {
  const [phase, setPhase] = useState<"setup" | "interview" | "results">(
    "setup"
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(QUESTIONS.length).fill("")
  );
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [micError, setMicError] = useState("");
  const speechSupported = useSyncExternalStore(
    subscribeToBrowserCapabilities,
    getSpeechRecognitionSupport,
    getServerSpeechRecognitionSupport,
  );
  const [elapsed, setElapsed] = useState(0);
  const studentId = useSyncExternalStore(
    subscribeToSelectedDemoStudentId,
    readSelectedDemoStudentId,
    getDefaultDemoStudentId,
  );
  const studentName =
    studentProfiles.find((student) => student.id === studentId)?.name ?? "";
  const [role, setRole] = useState("Software Developer");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [resultStorageError, setResultStorageError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recordingRef = useRef(false);
  const elapsedRef = useRef(0);
  const answersRef = useRef<string[]>(Array(QUESTIONS.length).fill(""));

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((total, item) => total + item.score, 0) /
            results.length
        )
      : 0;

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (phase !== "interview") return;

    const timer = window.setInterval(() => {
      setElapsed((value) => {
        elapsedRef.current = value + 1;
        return value + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play().catch(() => undefined);
    }
  }, [cameraOn, phase]);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  async function toggleCamera() {
    if (cameraOn) {
      stopCamera();
      return;
    }

    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;
      setCameraOn(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch {
      setCameraError(
        "Camera access was denied or is unavailable. Check your browser permissions and try again."
      );
    }
  }

  async function toggleMicrophone() {
    if (micOn) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
      setMicOn(false);
      setRecording(false);
      recordingRef.current = false;
      return;
    }

    setMicError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      audioStreamRef.current = stream;
      setMicOn(true);
    } catch {
      setMicError(
        "Microphone access was denied or is unavailable. You can still type your answers."
      );
    }
  }

  function startVoiceAnswer() {
    if (!micOn) {
      setMicError("Enable microphone access before using voice answers.");
      return;
    }

    const w = window as Window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };

    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!Recognition) {
      setMicError(
        "Speech-to-text is not supported in this browser. You can type your answer instead."
      );
      return;
    }

    if (recordingRef.current) {
      recognitionRef.current?.stop();
      setRecording(false);
      recordingRef.current = false;
      return;
    }

    setMicError("");

    try {
      const recognition = new Recognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let transcript = "";

        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }

        const updated = [...answersRef.current];
        updated[currentQuestion] = transcript.trim();

        answersRef.current = updated;
        setAnswers(updated);
      };

      recognition.onerror = (event) => {
        if (event.error !== "no-speech") {
          setMicError(
            "Voice recognition stopped. You can continue by typing your answer."
          );
        }
        setRecording(false);
        recordingRef.current = false;
      };

      recognition.onend = () => {
        setRecording(false);
        recordingRef.current = false;
      };

      recognitionRef.current = recognition;
      recognition.start();
      recordingRef.current = true;
      setRecording(true);
    } catch {
      setMicError(
        "Could not start voice recognition. Please type your answer instead."
      );
    }
  }

  async function startInterview() {
    if (!studentId || !studentName.trim()) {
      window.alert("Please select a student profile before starting.");
      return;
    }

    setAnswers(Array(QUESTIONS.length).fill(""));
    answersRef.current = Array(QUESTIONS.length).fill("");
    setResults([]);
    setCurrentQuestion(0);
    setElapsed(0);
    elapsedRef.current = 0;
    setMicError("");
    setCameraError("");
    setResultStorageError("");

    // Request camera permission for the live interview.
    if (!cameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        setCameraOn(true);
      } catch {
        setCameraError(
          "Camera is unavailable. You may continue without a camera preview."
        );
      }
    }

    setPhase("interview");
  }

  function updateAnswer(value: string) {
    const updated = [...answersRef.current];
    updated[currentQuestion] = value;
    answersRef.current = updated;
    setAnswers(updated);
  }

  function goToQuestion(index: number) {
    recognitionRef.current?.stop();
    setRecording(false);
    recordingRef.current = false;
    setCurrentQuestion(index);
  }

  function finishInterview() {
    recognitionRef.current?.stop();
    setRecording(false);
    recordingRef.current = false;
    setIsEvaluating(true);

    const evaluated = QUESTIONS.map((question, index) =>
      evaluateAnswer(question, answersRef.current[index] ?? "")
    );

    setResults(evaluated);
    try {
      saveMockInterviewResult({
        id: `MOCK-${Date.now()}`,
        studentId,
        role,
        averageScore: Math.round(
          evaluated.reduce((total, item) => total + item.score, 0) /
            evaluated.length,
        ),
        completedAt: new Date().toISOString(),
      });
      setResultStorageError("");
    } catch (error) {
      setResultStorageError(
        error instanceof Error
          ? `Interview results could not be saved: ${error.message}`
          : "Interview results could not be saved.",
      );
    }
    stopCamera();
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioStreamRef.current = null;
    setMicOn(false);

    setPhase("results");
    setIsEvaluating(false);
  }

  function restartInterview() {
    recognitionRef.current?.abort();
    stopCamera();
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioStreamRef.current = null;

    setMicOn(false);
    setRecording(false);
    recordingRef.current = false;
    setAnswers(Array(QUESTIONS.length).fill(""));
    answersRef.current = Array(QUESTIONS.length).fill("");
    setResults([]);
    setCurrentQuestion(0);
    setElapsed(0);
    elapsedRef.current = 0;
    setCameraError("");
    setMicError("");
    setPhase("setup");
  }

  const question = QUESTIONS[currentQuestion];
  const answeredCount = answers.filter((answer) => answer.trim()).length;

  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Sparkles size={17} />
              GROWTHTRACK CAREER PREPARATION
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Mock Interviews
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Practice real interview questions, answer with your voice or
              keyboard, and review personalized practice feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Brain size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                AI-style practice
              </p>
              <p className="text-xs text-slate-500">
                5 questions · Instant report
              </p>
            </div>
          </div>
        </header>

        {phase === "setup" && (
          <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Set up your interview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Tell us a little about yourself before you begin.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="studentId"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Demo student profile
                  </label>
                  <select
                    id="studentId"
                    value={studentId}
                    onChange={(event) => {
                      try {
                        saveSelectedDemoStudentId(event.target.value);
                        setResultStorageError("");
                      } catch (error) {
                        setResultStorageError(
                          error instanceof Error
                            ? error.message
                            : "The selected student could not be saved.",
                        );
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >
                    {studentProfiles.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} · {student.id}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-500">
                    Result will be linked to the selected demo student ID and
                    saved in this browser only.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Target job role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >
                    <option>Software Developer</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Data Analyst</option>
                    <option>Full Stack Developer</option>
                    <option>QA Engineer</option>
                    <option>General Graduate Role</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <Camera className="mt-0.5 shrink-0 text-indigo-600" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Camera and microphone
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Your browser may ask for camera access when the
                        interview begins. Enable your microphone separately to
                        use voice answers. Typing is always available.
                      </p>
                    </div>
                  </div>
                </div>

                {cameraError && (
                  <p className="flex items-start gap-2 text-sm text-amber-700">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    {cameraError}
                  </p>
                )}

                <button
                  onClick={() => void startInterview()}
                  disabled={!studentName.trim() || isEvaluating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Play size={18} />
                  Start mock interview
                  <ChevronRight size={18} />
                </button>
              </div>
            </section>

            <div className="space-y-5">
              <section className="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                    INTERVIEW PREVIEW
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Ready to practice
                  </span>
                </div>

                <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-800/80 p-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                    <Video size={30} />
                  </div>
                  <p className="font-semibold">Your interview room</p>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                    The live camera preview will appear here once you start the
                    interview and allow access.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-3">
                    <Video size={18} className="mb-2 text-indigo-300" />
                    <p className="text-sm font-medium">Live camera</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Browser permission
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <Mic size={18} className="mb-2 text-indigo-300" />
                    <p className="text-sm font-medium">Voice answers</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Speech recognition support
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-slate-900">Your 5 questions</h3>
                <div className="mt-4 space-y-3">
                  {QUESTIONS.map((item, index) => (
                    <div key={item.category} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.category}
                        </p>
                        <p className="text-xs text-slate-500">
                          One question · Individual feedback
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {phase === "interview" && (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Interview in progress
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {studentName} · {role}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold tabular-nums text-slate-700">
                  <Clock size={16} />
                  {formatTime(elapsed)}
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                    Question {currentQuestion + 1} of {QUESTIONS.length}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {answeredCount} answered
                  </span>
                </div>

                <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{
                      width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="mb-6 rounded-2xl bg-slate-50 p-5 sm:p-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    {question.category}
                  </p>
                  <h2 className="text-xl font-bold leading-8 text-slate-900 sm:text-2xl">
                    {question.question}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Take a moment to think. Explain your reasoning and use an
                    example where appropriate.
                  </p>
                </div>

                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <label
                    htmlFor="answer"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Your answer
                  </label>
                  {speechSupported && (
                    <span className="text-xs text-emerald-700">
                      Voice transcription supported
                    </span>
                  )}
                </div>

                <textarea
                  id="answer"
                  value={answers[currentQuestion]}
                  onChange={(event) => updateAnswer(event.target.value)}
                  rows={7}
                  placeholder="Type your answer here, or use the voice-answer button below..."
                  className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => void toggleMicrophone()}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      micOn
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {micOn ? <Mic size={17} /> : <MicOff size={17} />}
                    {micOn ? "Microphone enabled" : "Enable microphone"}
                  </button>

                  <button
                    onClick={startVoiceAnswer}
                    disabled={!micOn}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      recording
                        ? "bg-rose-600 text-white hover:bg-rose-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {recording ? <Square size={15} /> : <Mic size={17} />}
                    {recording ? "Stop voice input" : "Answer by voice"}
                  </button>

                  <button
                    onClick={() => {
                      updateAnswer("");
                      setMicError("");
                    }}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <RotateCcw size={15} />
                    Clear
                  </button>
                </div>

                {recording && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-rose-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                    Listening… speak clearly. Click Stop voice input when done.
                  </p>
                )}

                {micError && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-amber-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {micError}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <button
                    onClick={() =>
                      goToQuestion(Math.max(0, currentQuestion - 1))
                    }
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                    Previous
                  </button>

                  {currentQuestion < QUESTIONS.length - 1 ? (
                    <button
                      onClick={() => goToQuestion(currentQuestion + 1)}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Next question
                      <ChevronRight size={17} />
                    </button>
                  ) : (
                    <button
                      onClick={finishInterview}
                      disabled={isEvaluating}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <CheckCircle2 size={17} />
                      Finish and view report
                    </button>
                  )}
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <section className="overflow-hidden rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Camera preview</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      cameraOn
                        ? "bg-emerald-400/15 text-emerald-300"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {cameraOn ? "Live" : "Off"}
                  </span>
                </div>

                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`h-full w-full object-cover ${
                      cameraOn ? "" : "hidden"
                    }`}
                  />
                  {!cameraOn && (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <VideoOff size={32} />
                      <span className="text-sm">Camera is off</span>
                    </div>
                  )}
                </div>

                {cameraError && (
                  <p className="mt-3 text-xs leading-5 text-amber-300">
                    {cameraError}
                  </p>
                )}

                <button
                  onClick={() => void toggleCamera()}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15"
                >
                  {cameraOn ? <VideoOff size={17} /> : <Video size={17} />}
                  {cameraOn ? "Turn camera off" : "Turn camera on"}
                </button>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">
                  Interview progress
                </h3>
                <div className="space-y-3">
                  {QUESTIONS.map((item, index) => {
                    const isCurrent = index === currentQuestion;
                    const isAnswered = Boolean(answers[index]?.trim());

                    return (
                      <button
                        key={item.category}
                        onClick={() => goToQuestion(index)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          isCurrent
                            ? "border-indigo-200 bg-indigo-50"
                            : "border-transparent bg-slate-50 hover:border-slate-200"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isAnswered
                              ? "bg-emerald-100 text-emerald-700"
                              : isCurrent
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-500"
                          }`}
                        >
                          {isAnswered ? <CheckCircle2 size={17} /> : index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800">
                            {item.category}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {isAnswered ? "Answer added" : "Not answered yet"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                  <AlertCircle size={17} />
                  Practice scoring notice
                </p>
                <p className="mt-2 text-xs leading-5 text-amber-800">
                  This demo scores answer relevance, detail, and basic
                  structure. It is not a real AI model and does not assess
                  facial expressions or vocal tone.
                </p>
              </div>
            </aside>
          </div>
        )}

        {phase === "results" && (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-9">
              <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                    <CheckCircle2 size={18} />
                    INTERVIEW COMPLETED
                  </div>
                  <h2 className="text-3xl font-bold sm:text-4xl">
                    Your practice report
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                    {studentName}, here is your practice feedback for the{" "}
                    {role} role. Review each answer to decide what to improve
                    next.
                  </p>
                  {resultStorageError ? (
                    <p
                      role="alert"
                      className="mt-3 text-sm font-medium text-amber-300"
                    >
                      {resultStorageError}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-slate-300">
                      Result saved to this browser for student ID {studentId}.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-400/40">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{averageScore}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-300">
                        out of 100
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {averageScore >= 80
                        ? "Great practice!"
                        : averageScore >= 60
                          ? "Good progress"
                          : averageScore >= 35
                            ? "Keep improving"
                            : "More practice needed"}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      Average answer score
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Time: {formatTime(elapsed)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MessageSquare size={20} />
                </div>
                <p className="text-sm text-slate-500">Questions completed</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {results.length}/5
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Award size={20} />
                </div>
                <p className="text-sm text-slate-500">Average score</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {averageScore}%
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock size={20} />
                </div>
                <p className="text-sm text-slate-500">Duration</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {formatTime(elapsed)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Target size={20} />
                </div>
                <p className="text-sm text-slate-500">Answers attempted</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {results.filter(
                    (result) => result.answer !== "No answer submitted."
                  ).length}
                  /5
                </p>
              </div>
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Question-by-question feedback
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review your answer, score, strengths, and areas to improve.
                </p>
              </div>

              <div className="space-y-5">
                {results.map((result, index) => (
                  <article
                    key={result.category}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            {result.category}
                          </p>
                          <h4 className="mt-1 font-semibold leading-6 text-slate-900">
                            {result.question}
                          </h4>
                        </div>
                      </div>

                      <div className="min-w-24 rounded-xl bg-slate-50 px-4 py-3 text-center">
                        <p className="text-2xl font-bold text-slate-900">
                          {result.score}
                        </p>
                        <p className="text-xs text-slate-500">/ 100</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Your answer
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {result.answer}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-800">
                        Feedback
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {result.feedback}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                          <CheckCircle2 size={17} />
                          Strengths
                        </p>
                        <ul className="space-y-2">
                          {result.strengths.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-sm leading-5 text-emerald-900"
                            >
                              <span>•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
                          <TrendingUp size={17} />
                          Improve next time
                        </p>
                        <ul className="space-y-2">
                          {result.improvements.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-sm leading-5 text-amber-900"
                            >
                              <span>•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                  <Sparkles size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    Your next steps
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Practice answering each question using a clear structure:
                    introduce the main point, explain your reasoning, give a
                    concrete example, and conclude with the result or lesson.
                    For technical questions, explain the concept accurately
                    and mention trade-offs when relevant.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={restartInterview}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <RotateCcw size={17} />
                      Try another interview
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                    >
                      <Search size={17} />
                      Print / save report
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <p className="text-center text-xs leading-5 text-slate-500">
              This report uses local practice-scoring rules, not a validated
              hiring assessment. Results are not saved to a database and will
              be lost if you leave or refresh this page.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}