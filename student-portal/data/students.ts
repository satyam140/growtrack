import type {
  Activity, ActivityType, AptitudeAttempt, AptitudeSection, AttendanceRecord, Backlog, FacultyRemark,
  InterviewAttempt, Lecture, SoftSkill, Student, SubjectResult, TechSkill, VerificationStatus,
} from '@student/types'
import { CATALOG, TOPICS, subjectsOfSemester } from './catalog'
import { gradeFromTotal, isPass } from '@student/lib/scoring'

/* ------------------------------ seeded random ----------------------------- */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
type Rng = () => number
const between = (r: Rng, lo: number, hi: number) => lo + r() * (hi - lo)
const int = (r: Rng, lo: number, hi: number) => Math.round(between(r, lo, hi))
const pick = <T,>(r: Rng, xs: T[]) => xs[Math.floor(r() * xs.length)]
const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n))
const shuffle = <T,>(r: Rng, xs: T[]) => {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
const iso = (d: Date) => d.toISOString().slice(0, 10)

export const TODAY = '2026-10-09'
export const CURRENT_SEM = 5
const SEM_START = new Date('2026-07-27T00:00:00Z')
const SEM_DATES: Record<number, [string, string]> = {
  1: ['2024-08-05', '2024-12-20'], 2: ['2025-01-06', '2025-05-30'], 3: ['2025-07-28', '2025-12-19'],
  4: ['2026-01-05', '2026-05-29'], 5: ['2026-07-27', '2026-12-18'],
}

/* --------------------------------- results -------------------------------- */
function mkResult(code: string, semester: number, total: number, r: Rng): SubjectResult {
  let external = clamp(Math.round(total * 0.6 + between(r, -4, 4)), 0, 60)
  if (total >= 40) external = Math.max(external, 24)
  let internal = total - external
  if (internal > 40) { internal = 40; external = total - 40 }
  if (internal < 0) { internal = 0; external = total }
  const passed = isPass(total, external)
  const { grade, gradePoint } = gradeFromTotal(total, passed)
  const credits = CATALOG.find((c) => c.code === code)!.credits
  return { code, semester, internal, external, total, grade, gradePoint, passed, creditsObtained: passed ? credits : 0 }
}

/* -------------------------------- attendance ------------------------------ */
const HOLIDAYS = new Set(['2026-09-15', '2026-10-02'])
function genAttendance(targets: number[], r: Rng): AttendanceRecord[] {
  const subs = subjectsOfSemester(CURRENT_SEM)
  return subs.map((sub, i) => {
    const dates: string[] = []
    for (let d = new Date(SEM_START); iso(d) < TODAY; d.setUTCDate(d.getUTCDate() + 1)) {
      const wd = d.getUTCDay()
      if (wd === 0 || wd === 6 || HOLIDAYS.has(iso(d))) continue
      if ((wd + i) % 5 < 3) dates.push(iso(d))
    }
    const absentCount = Math.round(dates.length * (1 - targets[i] / 100))
    const absent = new Set(shuffle(r, dates.map((_, k) => k)).slice(0, absentCount))
    const topics = TOPICS[sub.code]
    const lectures: Lecture[] = dates.map((date, k) => ({
      date, slot: `${9 + ((i + k) % 6)}:00`, topic: topics[k % topics.length], present: !absent.has(k),
    }))
    return { code: sub.code, lectures }
  })
}

/* --------------------------------- aptitude -------------------------------- */
const SECTIONS: AptitudeSection[] = ['Quantitative', 'Logical Reasoning', 'Verbal']
const PATTERNS = ['TCS NQT Pattern', 'Infosys Pattern', 'Accenture Pattern', 'General Practice']
function mkAptitude(id: string, date: string, pattern: string, pcts: number[], r: Rng): AptitudeAttempt {
  const sections = {} as AptitudeAttempt['sections']
  let sc = 0, tot = 0
  SECTIONS.forEach((s, i) => {
    const total = 10
    const score = clamp(Math.round((pcts[i] / 100) * total), 0, total)
    sections[s] = { score, total }
    sc += score; tot += total
  })
  return { id, date, pattern, sections, totalPercent: Math.round((sc / tot) * 100), timeTakenSec: int(r, 1100, 1700) }
}

/* -------------------------------- remarks ---------------------------------- */
const REMARK_POS = ['Participates actively and asks thoughtful questions.', 'Consistently disciplined and punctual.', 'Positive attitude and helps classmates.', 'Shows steady improvement this semester.']
const REMARK_MID = ['Capable, but needs to participate more in discussions.', 'Occasionally late to class; should be more regular.', 'Good potential — needs more consistent effort.']
const REMARK_LOW = ['Rarely engages in class; please speak up when in doubt.', 'Frequent absences are affecting performance.', 'Needs to improve focus and submit work on time.']

function genRemarks(level: number, r: Rng, fixed?: number[][]): FacultyRemark[] {
  return subjectsOfSemester(CURRENT_SEM).map((sub, i) => {
    const f = fixed?.[i]
    const rate = () => clamp(Math.round(1 + level * 4 + between(r, -0.8, 0.8)), 1, 5)
    const [participation, discipline, attitude] = f ?? [rate(), rate(), rate()]
    const m = (participation + discipline + attitude) / 3
    return {
      code: sub.code, teacher: sub.teacher, date: `2026-09-${String(10 + i).padStart(2, '0')}`,
      participation, discipline, attitude,
      comment: m >= 3.8 ? pick(r, REMARK_POS) : m >= 2.8 ? pick(r, REMARK_MID) : pick(r, REMARK_LOW),
    }
  })
}

/* ------------------------------- activities -------------------------------- */
const ACT_BANK: Record<ActivityType, { title: string; organizer: string; category: string; role: string }[]> = {
  event: [
    { title: 'Tech Fest "Innovate 2025"', organizer: 'College Tech Council', category: 'Technical', role: 'Volunteer' },
    { title: 'Annual Cultural Night', organizer: 'Cultural Committee', category: 'Cultural', role: 'Participant' },
    { title: 'Inter-college Quiz', organizer: 'IIT Bombay Mood Indigo', category: 'Quiz', role: 'Finalist' },
    { title: 'Blood Donation Drive', organizer: 'NSS Unit', category: 'Social', role: 'Organiser' },
  ],
  club: [
    { title: 'Coding Club', organizer: 'ACM Student Chapter', category: 'Technical', role: 'Core Member' },
    { title: 'Robotics Club', organizer: 'Dept. of ECE', category: 'Technical', role: 'Member' },
    { title: 'Photography Club', organizer: 'Student Council', category: 'Arts', role: 'Treasurer' },
  ],
  hackathon: [
    { title: 'Smart India Hackathon', organizer: 'Govt. of India (MoE)', category: 'National', role: 'Team Lead — Finalist' },
    { title: 'HackWithInfy', organizer: 'Infosys', category: 'Industry', role: 'Participant' },
    { title: 'College Codeathon 24h', organizer: 'CSE Department', category: 'Internal', role: 'Winner (2nd place)' },
  ],
  certification: [
    { title: 'AWS Cloud Practitioner', organizer: 'Amazon Web Services', category: 'Cloud', role: 'Certified' },
    { title: 'NPTEL — Database Management', organizer: 'NPTEL / IIT Madras', category: 'Academic', role: 'Elite Certificate' },
    { title: 'Python for Everybody', organizer: 'Coursera', category: 'Programming', role: 'Completed' },
    { title: 'Google Data Analytics', organizer: 'Google', category: 'Analytics', role: 'Completed' },
  ],
}
function genActivities(prefix: string, count: number, approvedRate: number, r: Rng): Activity[] {
  const types: ActivityType[] = ['event', 'club', 'hackathon', 'certification']
  return Array.from({ length: count }, (_, i) => {
    const type = pick(r, types)
    const b = pick(r, ACT_BANK[type])
    const sem = int(r, 1, CURRENT_SEM)
    const [from] = SEM_DATES[sem]
    const d = new Date(from + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + int(r, 10, 100))
    const rr = r()
    const status: VerificationStatus = rr < approvedRate ? 'Approved' : rr < approvedRate + (1 - approvedRate) * 0.6 ? 'Pending' : 'Rejected'
    return { id: `${prefix}-a${i}`, type, ...b, date: iso(d), proof: `${b.title.split(' ')[0].toLowerCase()}_proof_${i}.pdf`, status, semester: sem }
  })
}

/* ------------------------------ the main student --------------------------- */
const MAIN_TOTALS: Record<number, number[]> = {
  1: [72, 68, 75, 81, 70, 78],
  2: [44, 66, 74, 69, 77, 80], // Maths II cleared on 2nd attempt
  3: [34, 71, 62, 79, 66, 73], // Discrete Maths: ACTIVE backlog
  4: [68, 64, 72, 77, 70, 75],
  5: [74, 63, 58, 66, 79, 82], // DBMS, OS, CN, TOC, SE, AI/ML
}

function buildMain(): Student {
  const r = mulberry32(42)
  const results: SubjectResult[] = []
  for (let sem = 1; sem <= 5; sem++) subjectsOfSemester(sem).forEach((s, i) => results.push(mkResult(s.code, sem, MAIN_TOTALS[sem][i], r)))
  const backlogs: Backlog[] = [
    { code: 'MA201', semester: 3, status: 'active', attempts: [
      { attempt: 1, date: '2025-12-12', marks: 34, result: 'Fail' }, { attempt: 2, date: '2026-06-08', marks: 36, result: 'Fail' }] },
    { code: 'MA102', semester: 2, status: 'cleared', attempts: [
      { attempt: 1, date: '2025-05-20', marks: 32, result: 'Fail' }, { attempt: 2, date: '2025-12-15', marks: 44, result: 'Pass' }] },
  ]
  const att = genAttendance([92, 85, 66, 80, 91, 78], r)
  const activities: Activity[] = [
    { id: 'm1', type: 'hackathon', title: 'College Codeathon 24h', organizer: 'CSE Department', date: '2025-10-18', category: 'Internal', role: 'Winner (2nd place)', proof: 'codeathon_certificate.pdf', status: 'Approved', semester: 3 },
    { id: 'm2', type: 'certification', title: 'NPTEL — Database Management', organizer: 'NPTEL / IIT Madras', date: '2026-03-14', category: 'Academic', role: 'Elite Certificate', proof: 'nptel_dbms.pdf', status: 'Approved', semester: 4 },
    { id: 'm3', type: 'certification', title: 'Python for Everybody', organizer: 'Coursera', date: '2025-02-20', category: 'Programming', role: 'Completed', proof: 'coursera_python.pdf', status: 'Approved', semester: 2 },
    { id: 'm4', type: 'club', title: 'Coding Club', organizer: 'ACM Student Chapter', date: '2025-08-30', category: 'Technical', role: 'Core Member', proof: 'acm_letter.png', status: 'Approved', semester: 3 },
    { id: 'm5', type: 'event', title: 'Tech Fest "Innovate 2025"', organizer: 'College Tech Council', date: '2025-09-12', category: 'Technical', role: 'Volunteer', proof: 'innovate_volunteer.pdf', status: 'Approved', semester: 3 },
    { id: 'm6', type: 'event', title: 'Inter-college Quiz', organizer: 'IIT Bombay Mood Indigo', date: '2026-02-08', category: 'Quiz', role: 'Finalist', proof: 'quiz_finalist.jpg', status: 'Approved', semester: 4 },
    { id: 'm7', type: 'hackathon', title: 'Smart India Hackathon', organizer: 'Govt. of India (MoE)', date: '2026-09-20', category: 'National', role: 'Team Lead — Finalist', proof: 'sih_2026.pdf', status: 'Pending', semester: 5 },
    { id: 'm8', type: 'certification', title: 'AWS Cloud Practitioner', organizer: 'Amazon Web Services', date: '2026-08-30', category: 'Cloud', role: 'Certified', proof: 'aws_ccp.pdf', status: 'Rejected', semester: 5 },
  ]
  return {
    id: 's001', name: 'Aarav Mehta', rollNo: '22CSE042', branch: 'B.Tech CSE', semester: 5, email: 'aarav.mehta@campus.edu',
    results, backlogs, attendance: att,
    semesterAttendance: { 1: 88, 2: 84, 3: 79, 4: 81 },
    lms: { loginsLast30: 17, lastLogin: '2026-10-07', assignments: { assigned: 24, submitted: 19, late: 4, pending: 5 }, avgQuiz: 64 },
    activities,
    placement: {
      codingScore: 62,
      aptitude: [
        mkAptitude('ap1', '2026-07-10', 'General Practice', [40, 55, 60], r),
        mkAptitude('ap2', '2026-08-14', 'TCS NQT Pattern', [40, 60, 60], r),
        mkAptitude('ap3', '2026-09-18', 'Infosys Pattern', [40, 60, 70], r),
      ],
      interviews: [
        { id: 'mi1', date: '2026-08-22', type: 'HR', difficulty: 'Easy', score: 58, ratings: { communication: 62, technical: 50, confidence: 60 }, feedback: 'Clear speaker, but answers lacked concrete examples.' },
        { id: 'mi2', date: '2026-09-25', type: 'Technical', difficulty: 'Medium', score: 66, ratings: { communication: 64, technical: 68, confidence: 65 }, feedback: 'Good grasp of DBMS basics; OS concepts need revision.' },
      ],
    },
    skills: {
      technical: { DSA: 62, 'Web Dev': 74, DBMS: 71, Python: 68 },
      soft: { Communication: 58, Teamwork: 76, 'Problem Solving': 66, Leadership: 52, 'Time Management': 60 },
      technicalTests: [],
      codingAttempts: [],
    },
    feedback: {
      survey: null,
      teacherFeedback: [
        { code: 'CS401', date: '2026-09-05', clarity: 5, punctuality: 4, doubtSolving: 5, engagement: 4, comment: 'Excellent explanations with real examples.' },
        { code: 'CS402', date: '2026-09-06', clarity: 4, punctuality: 5, doubtSolving: 4, engagement: 3, comment: '' },
      ],
      remarks: genRemarks(0.62, r, [[4, 4, 4], [3, 4, 4], [3, 3, 3], [4, 4, 4], [4, 5, 4], [4, 4, 5]]),
    },
  }
}

/* -------------------------------- other students --------------------------- */
const NAMES = ['Ananya Iyer', 'Rohan Gupta', 'Priya Nair', 'Kabir Singh', 'Sneha Reddy', 'Arjun Patel', 'Diya Sharma', 'Vihaan Joshi', 'Ishita Banerjee', 'Aditya Rao', 'Meera Kulkarni', 'Rahul Verma', 'Tanvi Desai', 'Siddharth Menon', 'Kavya Pillai', 'Nikhil Bhatt', 'Riya Kapoor', 'Yash Chauhan', 'Pooja Shah', 'Harsh Agarwal', 'Neha Fernandes', 'Manav Malhotra', 'Aisha Khan', 'Dev Thakur', 'Simran Kaur', 'Varun Naidu', 'Lakshmi Krishnan', 'Omkar Patil', 'Zoya Ansari', 'Tejas Hegde']

function buildOther(idx: number): Student {
  const id = `s${String(idx + 2).padStart(3, '0')}`
  const r = mulberry32(1000 + idx * 7919)
  const a = clamp(0.16 + 0.84 * Math.pow(r(), 0.85), 0, 1) // academic ability
  const e = clamp(a * 0.5 + between(r, 0, 0.6), 0, 1) // engagement latent
  const p = clamp(a * 0.4 + between(r, 0, 0.7), 0, 1) // placement/skill latent
  const results: SubjectResult[] = []
  const backlogs: Backlog[] = []
  for (let sem = 1; sem <= 5; sem++)
    for (const s of subjectsOfSemester(sem)) {
      const total = Math.round(clamp(30 + a * 62 + between(r, -10, 9), 18, 99))
      results.push(mkResult(s.code, sem, total, r))
      if (total < 40) backlogs.push({ code: s.code, semester: sem, status: 'active', attempts: [{ attempt: 1, date: `${SEM_DATES[sem][1].slice(0, 7)}-28`, marks: total, result: 'Fail' }] })
    }
  const att = genAttendance(Array.from({ length: 6 }, () => clamp(60 + a * 20 + e * 14 + between(r, -8, 8), 40, 99)), r)
  const assigned = 24
  const submitted = clamp(Math.round(assigned * (0.55 + 0.42 * (a * 0.6 + e * 0.4))), 5, assigned)
  const late = Math.min(submitted, int(r, 0, 5))
  const tech = (): number => Math.round(clamp(35 + p * 55 + between(r, -10, 12)))
  const soft = (): number => Math.round(clamp(35 + (p * 0.5 + e * 0.5) * 52 + between(r, -10, 12)))
  const aptP = () => clamp(35 + p * 55 + between(r, -10, 10))
  const nApt = int(r, 1, 3)
  const nInt = int(r, 0, 2)
  return {
    id, name: NAMES[idx], rollNo: `22CSE${String(idx + 1).padStart(3, '0')}`.replace(/042/, '043'), branch: 'B.Tech CSE', semester: 5,
    email: `${NAMES[idx].split(' ')[0].toLowerCase()}@campus.edu`,
    results, backlogs, attendance: att,
    semesterAttendance: Object.fromEntries([1, 2, 3, 4].map((k) => [k, Math.round(clamp(60 + a * 20 + e * 14 + between(r, -6, 6), 45, 98))])),
    lms: { loginsLast30: int(r, 3 + e * 8, 12 + e * 18), lastLogin: `2026-10-0${int(r, 1, 8)}`, assignments: { assigned, submitted, late, pending: assigned - submitted }, avgQuiz: Math.round(clamp(45 + a * 45 + between(r, -8, 10))) },
    activities: genActivities(id, Math.round(1 + e * 7), 0.7, r),
    placement: {
      codingScore: Math.round(clamp(30 + p * 60 + between(r, -10, 10))),
      aptitude: Array.from({ length: nApt }, (_, i) => mkAptitude(`${id}-ap${i}`, `2026-0${7 + i}-15`, pick(r, PATTERNS), [aptP(), aptP(), aptP()], r)),
      interviews: Array.from({ length: nInt }, (_, i): InterviewAttempt => {
        const sc = Math.round(clamp(35 + p * 50 + between(r, -8, 10)))
        return { id: `${id}-mi${i}`, date: `2026-09-0${i + 3}`, type: pick(r, ['HR', 'Technical', 'Mixed']), difficulty: 'Medium', score: sc, ratings: { communication: sc, technical: sc, confidence: sc }, feedback: 'Solid attempt.' }
      }),
    },
    skills: {
      technical: { DSA: tech(), 'Web Dev': tech(), DBMS: tech(), Python: tech(), Java: tech(), C: tech(), SQL: tech() } as Record<TechSkill, number>,
      soft: { Communication: soft(), Teamwork: soft(), 'Problem Solving': soft(), Leadership: soft(), 'Time Management': soft() } as Record<SoftSkill, number>,
      technicalTests: [],
      codingAttempts: [],
    },
    feedback: { survey: null, teacherFeedback: [], remarks: genRemarks(clamp(a * 0.6 + e * 0.4), r) },
  }
}

/** All 31 students (index 0 is the default logged-in student). */
export const ALL_STUDENTS: Student[] = [buildMain(), ...NAMES.map((_, i) => buildOther(i))]
export const DEFAULT_STUDENT_ID = 's001'
