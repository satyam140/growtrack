import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { DASH, Shell } from '@student/components/Shell'
import { ALL_STUDENTS, DEFAULT_STUDENT_ID } from '@student/data/students'
const Landing = lazy(() => import('@student/pages/Landing'))
import NotFound from '@student/pages/NotFound'
import { PageSkeleton } from '@student/components/common'
const Home = lazy(() => import('@student/pages/Home'))
const Attendance = lazy(() => import('@student/pages/Attendance'))
const Results = lazy(() => import('@student/pages/Results'))
const Engagement = lazy(() => import('@student/pages/Engagement'))
const Placement = lazy(() => import('@student/pages/Placement'))
const AptitudeTest = lazy(() => import('@student/pages/AptitudeTest'))
const MockInterview = lazy(() => import('@student/pages/MockInterview'))
const Skills = lazy(() => import('@student/pages/Skills'))
const CodingTest = lazy(() => import('@student/pages/CodingTest'))
const Feedback = lazy(() => import('@student/pages/Feedback'))

/** Same page tree is mounted twice: "/dashboard" (logged-in student) and "/dashboard/student/:studentId" (faculty/admin view). */
const pages = (
  <>
    <Route index element={<Home />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="results" element={<Results />} />
    <Route path="engagement" element={<Engagement />} />
    <Route path="placement" element={<Placement />} />
    <Route path="placement/aptitude" element={<AptitudeTest />} />
    <Route path="placement/interview" element={<MockInterview />} />
    <Route path="skills" element={<Skills />} />
    <Route path="skills/coding" element={<CodingTest />} />
    <Route path="feedback" element={<Feedback />} />
    <Route path="*" element={<NotFound />} />
  </>
)

function StudentShell() {
  const { studentId } = useParams()
  if (!ALL_STUDENTS.some((s) => s.id === studentId)) return <NotFound message="That student does not exist." />
  return <Shell studentId={studentId ?? DEFAULT_STUDENT_ID} base={`${DASH}/student/${studentId}`} />
}

/** Old (pre-redesign) URLs such as /attendance or /student/s007/results keep working. */
const LEGACY = ['attendance', 'results', 'engagement', 'placement', 'skills', 'feedback', 'student']
function Legacy() {
  const { pathname, search } = useLocation()
  return LEGACY.includes(pathname.split('/')[1]) ? <Navigate to={`${DASH}${pathname}${search}`} replace /> : <NotFound />
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-8"><PageSkeleton /></div>}>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path={DASH} element={<Shell studentId={DEFAULT_STUDENT_ID} base={DASH} />}>{pages}</Route>
      <Route path={`${DASH}/student/:studentId`} element={<StudentShell />}>{pages}</Route>
      <Route path="*" element={<Legacy />} />
    </Routes>
    </Suspense>
  )
}
