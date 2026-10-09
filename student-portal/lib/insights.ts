import type { Student } from '@student/types'
import { subjectsOfSemester } from '@student/data/catalog'

/** Feedback forms still to fill: satisfaction survey + one teacher form per current-semester subject. */
export function pendingForms(s: Student) {
  const done = new Set(s.feedback.teacherFeedback.map((f) => f.code))
  const teacherPending = subjectsOfSemester(s.semester).filter((x) => !done.has(x.code))
  return { survey: !s.feedback.survey, teacherPending, count: (s.feedback.survey ? 0 : 1) + teacherPending.length }
}
