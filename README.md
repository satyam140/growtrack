# GrowTrack — Student & Admin Dashboard

GrowTrack is a web-based campus management platform built with Next.js. It provides separate dashboards for administrators and students to help manage academic performance, attendance, student development, and placement readiness.

## Features

### Adaptive Mock Interviews

- Configure a role, interview focus, difficulty, and 3–10 questions.
- Generate interview questions with OpenAI; if generation is unavailable, the app uses a varied local question bank and clearly identifies that fallback.
- Evaluate submitted answers with a rubric for relevance, correctness, completeness, reasoning, and clarity. Blank answers receive zero without being sent for model scoring. Nonblank answers require the server-side OpenAI API key; the app never invents scores when evaluation is unavailable.
- Review per-answer evidence, strengths, missing concepts, recommendations, reference answers, and follow-up practice questions.
- See score and topic trends, weak areas, and personalized next-attempt guidance. History is stored in browser `localStorage`, separated by the selected demo student ID.
- Camera and microphone are optional and are not used to score facial expressions or vocal tone. Practice scores are not verified placement-readiness or hiring assessments.

To enable question generation and answer evaluation, copy `.env.example` to `.env.local` and set `OPENAI_API_KEY` on the server. `OPENAI_MODEL` is optional; it defaults to `gpt-4o-mini`. Never expose or commit the API key. Submitted answer text is sent to OpenAI for evaluation. Without the key, question generation falls back to the local bank, but nonblank answers cannot be evaluated.

This is a demo implementation: it has no authentication, server-side history, or account isolation. Browser-local history can be modified or cleared by the user and is not suitable for storing sensitive student data.

### Admin Dashboard

- **Overview:** View key student and academic statistics.
- **AI Analytics Copilot:** Open the floating bottom-right chat to ask natural-language questions about at-risk students, placement-readiness signals, academic/placement mismatches, department priorities, and officially recorded CGPA/SGPA. Answers show supporting sample-profile evidence and suggested next steps. GPA values are not inferred when they are missing. The current copilot uses transparent, rule-based analysis of illustrative local profiles; it is not a live external AI service or institutional data source.
- **Student Management:** View and manage student information.
- **Academic Performance:** Monitor student scores, performance trends, and academic progress.
- **Results:** Enter and declare semester subject marks for students in the sample directory. Result declarations are stored in browser `localStorage` only.
- **Attendance Management:** Manage attendance sessions and track student attendance.
- **Interventions:** Create and track academic support plans for students.
- **Placement Readiness:** Monitor student placement preparation and readiness.
- **Settings:** Manage administrator preferences and dashboard settings.
- **Help & Documentation:** Access usage guides, FAQs, and troubleshooting information.

### Student Dashboard

- **Overview:** View a personalized student dashboard.
- **Academic Performance:** Review academic scores and performance progress.
- **Attendance:** View attendance records and attendance percentage.
- **Engagement:** Access available student engagement information.
- **Placement Readiness:** Track placement preparation and readiness information.
- **Skills:** Review available skill development information.
- **Feedback:** Submit general feedback, review local submission history, and evaluate faculty. Feedback submissions are stored per student in browser `localStorage` and are not sent to a server.

## Navigation

- `/` — Landing page with links to the Admin and Student dashboards.
- `/admin/dashboard` — Administrator dashboard.
- `/students` — 35-profile illustrative student directory.
- `/academic-performance` — Admin academic monitoring and reports.
- `/results` — Admin semester result declaration register.
- `/student/dashboard` — Student dashboard.

Additional student pages are available beneath the student dashboard routes.

The administrator student directory contains 35 illustrative sample profiles. Results use a demo grading scale and are not official institutional records.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React icons

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/satyam140/growtrack.git
```
2. Navigate to the project
cd growtrack

3. Install dependencies
 npm install

4. Configure environment variables
If required, create a .env.local file using the environment variable names expected by the project.
Never commit database credentials, API keys, or other secrets to GitHub.

5. Start the development server
   npm run dev
Open http://localhost:3000 in your browser.

Project Structure
growtrack/
├── app/
│   ├── page.tsx
│   ├── admin/
│   │   └── dashboard/
│   └── student/
│       └── dashboard/
├── components/
├── lib/
├── public/
├── package.json
└── README.md

Build and Validation
Run the production build:
npm run build

Start the production server after building:
npm run start

Deployment
GrowTrack can be deployed using Vercel.
1.Push the project to GitHub.
2.Import the repository into Vercel.
3.Configure the required environment variables.
4.Deploy the application.
5.Test the Admin and Student dashboards after deployment.

Future Improvements
Secure authentication and role-based access control.
Real-time synchronization between administrator and student records.
Enhanced academic analytics and reporting.
Additional placement preparation and student development tools.


License
Add a license if you intend to distribute this project publicly.
```
