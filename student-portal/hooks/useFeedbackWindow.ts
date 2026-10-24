import { useEffect, useState } from 'react'
import { useData } from '@/lib/data/hooks'
import { fetchFeedbackWindow, isWindowOpen } from '@/lib/data/feedback-window'
import { useStudent } from '@student/hooks/useStudent'

/** Whether the Head of Department has opened feedback for this student's department. Unknown (loading or failed) is treated as locked. */
export function useFeedbackWindow() {
  const { student } = useStudent()
  const branch = student?.branchCode
  const q = useData(branch ? ['feedback-window', branch] : null, (db) => fetchFeedbackWindow(db, branch!))
  const window = q.data ?? null
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => setNow(Date.now()), [])
  return { loading: !student || (q.loading && q.data === undefined), error: q.error, window, open: now !== null && isWindowOpen(window, now), retry: q.retry }
}
