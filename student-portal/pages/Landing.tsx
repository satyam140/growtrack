import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Award, BarChart3, Briefcase, CalendarCheck, ClipboardList, GraduationCap, Lightbulb, Menu, MessageSquare, ShieldAlert, Target, X, Zap } from 'lucide-react'
import { FadeUp } from '@student/components/motion/FadeUp'
import { Logo } from '@student/components/Logo'
import { COMPONENT_LABELS, WEIGHTS, type ComponentKey } from '@student/lib/scoring'
import { usePageTitle } from '@student/hooks/usePageTitle'

const HEADING = 'TRACK EVERY STUDENT. PREDICT RISK. ACT EARLY.'.split(' ')
const HIGHLIGHT = new Set(['PREDICT', 'RISK.'])

const FEATURES = [
  { icon: CalendarCheck, title: 'Attendance', text: 'Subject-wise attendance with the lectures needed to stay above 75%.' },
  { icon: GraduationCap, title: 'Results', text: 'SGPA, CGPA, credits and backlogs, compared with the class.' },
  { icon: Award, title: 'Engagement', text: 'Clubs, events, hackathons and certifications, verified before they count.' },
  { icon: Briefcase, title: 'Placement', text: 'Readiness score, eligibility checklist and practice tests.' },
  { icon: Zap, title: 'Skills', text: 'Technical, coding and soft-skill tests with a skills radar.' },
  { icon: MessageSquare, title: 'Feedback', text: 'Satisfaction surveys, anonymous teacher ratings and faculty remarks.' },
]
const CHIPS = [{ icon: BarChart3, label: 'Success Score' }, { icon: ShieldAlert, label: 'Risk Flags' }, { icon: Lightbulb, label: 'Explainable Insights' }, { icon: Target, label: 'Placement Readiness' }]
const STEPS = [
  { icon: ClipboardList, title: 'Collect data', text: 'Attendance, results, LMS activity, skills, engagement, placement tests and faculty feedback in one place.' },
  { icon: BarChart3, title: 'Calculate the Success Score', text: 'Each area is scaled 0–100 and combined with the weights below into one score and a band.' },
  { icon: ShieldAlert, title: 'Flag risk and suggest actions', text: 'Academic and placement risk flags show the exact reasons, with the top actions for the week.' },
]

const scrollTo = (id: string, reduce: boolean | null) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })

export default function Landing() {
  usePageTitle('Track growth. Predict risk. Act early.')
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    document.title = 'GrowthTrack · Track growth. Predict risk. Act early.'
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const weights = (Object.keys(WEIGHTS) as ComponentKey[]).map((k) => ({ k, label: COMPONENT_LABELS[k], pct: Math.round(WEIGHTS[k] * 100) })).sort((a, b) => b.pct - a.pct)

  return (
    <div className="relative bg-brand-950 text-white">
      {/* fixed background: navy fallback, video (unless reduced motion), blue overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" aria-hidden />
      {!reduce && <video className="fixed inset-0 z-0 h-screen w-full object-cover" autoPlay muted loop playsInline preload="auto" aria-hidden><source src="/hero.mp4" type="video/mp4" /></video>}
      <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(110deg, rgba(10,26,63,0.92) 0%, rgba(15,42,95,0.75) 45%, rgba(29,78,216,0.35) 100%)' }} aria-hidden />

      {/* navbar */}
      <header className={`fixed inset-x-0 top-0 z-10 transition-colors ${scrolled || menu ? 'bg-brand-950/70 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="flex h-[70px] items-center justify-between px-5 sm:px-8">
          <Link to="/" aria-label="GrowthTrack home"><Logo size={32} wordClassName="font-bold text-white" /></Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            <button onClick={() => scrollTo('features', reduce)} className="text-sm text-white/85 hover:text-white">Features</button>
            <button onClick={() => scrollTo('how-it-works', reduce)} className="text-sm text-white/85 hover:text-white">How it works</button>
            <Link to="/dashboard" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Open Dashboard</Link>
          </nav>
          <button className="rounded-lg p-2 hover:bg-white/10 md:hidden" onClick={() => setMenu((m) => !m)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}>{menu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
        </div>
        {menu && (
          <motion.div initial={reduce ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 border-t border-white/10 px-5 pb-4 pt-2 md:hidden">
            <button onClick={() => { setMenu(false); scrollTo('features', reduce) }} className="rounded-lg px-3 py-3 text-left text-sm hover:bg-white/10">Features</button>
            <button onClick={() => { setMenu(false); scrollTo('how-it-works', reduce) }} className="rounded-lg px-3 py-3 text-left text-sm hover:bg-white/10">How it works</button>
            <Link to="/dashboard" className="mt-1 rounded-lg bg-brand-600 px-4 py-3 text-center text-sm font-semibold">Open Dashboard</Link>
          </motion.div>
        )}
      </header>

      {/* hero */}
      <section className="relative z-[1] flex h-screen min-h-[640px] flex-col justify-center px-[18px] pb-8 pt-[90px] sm:px-8 sm:pt-[70px]">
        <div className="flex max-w-[760px] flex-col items-start">
          <FadeUp delay={0.05} className="mb-5 flex items-center gap-3">
            <span className="h-0.5 w-6 bg-accent" aria-hidden />
            <span className="text-xs font-semibold text-brand-300" style={{ letterSpacing: '0.14em' }}>STUDENT SUCCESS PLATFORM</span>
          </FadeUp>
          <h2 className="m-0 flex flex-wrap gap-x-[0.25em] gap-y-1 font-extrabold uppercase text-white" style={{ fontSize: 'clamp(30px, 4vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            {HEADING.map((w, i) => (
              <FadeUp as="span" key={i} delay={0.15 + i * 0.08} className={HIGHLIGHT.has(w) ? 'bg-gradient-to-r from-brand-300 to-accent bg-clip-text text-transparent' : ''}>{w}</FadeUp>
            ))}
          </h2>
          <FadeUp as="p" delay={0.9} className="mt-6 max-w-[480px] text-base leading-[1.65] text-white/85">
            GrowthTrack brings attendance, results, skills, engagement and placement data into one Success Score — with clear reasons and next steps for every student.
          </FadeUp>
          <FadeUp delay={1.05} className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to="/dashboard" className="rounded-lg bg-brand-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700">Open Dashboard</Link>
            <button onClick={() => scrollTo('how-it-works', reduce)} className="rounded-lg border border-white/70 bg-transparent px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10">How the score works</button>
          </FadeUp>
          <FadeUp delay={1.2} className="mt-10 flex flex-wrap gap-2.5">
            {CHIPS.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.08] px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur"><c.icon className="h-4 w-4 text-brand-300" />{c.label}</span>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* features */}
      <section id="features" className="relative z-[1] bg-background px-5 py-20 text-foreground sm:px-8">
        <div className="mx-auto max-w-[1100px]">
          <FadeUp><h2 className="text-[28px] font-bold tracking-tight">Everything that shapes a student's success</h2><p className="mt-2 max-w-xl text-muted-foreground">Six areas, one consistent set of numbers from the same scoring engine.</p></FadeUp>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.06} className="rounded-xl border border-border bg-card p-6 shadow-soft">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-brand-100 text-brand-700"><f.icon className="h-5 w-5" /></div>
                <h3 className="text-lg font-semibold">{f.title}</h3><p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how-it-works" className="relative z-[1] bg-brand-50 px-5 py-20 text-slate-900 sm:px-8">
        <div className="mx-auto max-w-[1100px]">
          <FadeUp><h2 className="text-[28px] font-bold tracking-tight">How it works</h2></FadeUp>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.08} className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="mb-4 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">{i + 1}</span><s.icon className="h-5 w-5 text-brand-600" /></div>
                <h3 className="text-lg font-semibold">{s.title}</h3><p className="mt-1 text-sm text-slate-600">{s.text}</p>
              </FadeUp>
            ))}
          </div>
          <FadeUp className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold">Success Score weights</h3>
            <p className="mt-1 text-sm text-slate-600">Bands: 75–100 On Track, 50–74 Needs Attention, below 50 At Risk. The weights below are read live from the scoring configuration.</p>
            <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {weights.map((w) => (
                <li key={w.k}><div className="mb-1 flex justify-between text-sm"><span>{w.label}</span><span className="font-semibold tabular-nums">{w.pct}%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-600" style={{ width: `${w.pct * 4}%` }} /></div></li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      <footer className="relative z-[1] border-t border-white/10 bg-brand-950 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 text-sm text-white/80">
          <Logo size={28} wordClassName="text-white" />
          <span>Built for KPMG Smart Campus Analytics · {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
