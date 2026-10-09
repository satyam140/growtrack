# GrowTrack — Student & Admin Dashboard

GrowTrack is a web-based campus management platform built with Next.js. It provides separate dashboards for administrators and students to help manage academic performance, attendance, student development, and placement readiness.

## Features

### Admin Dashboard

- **Overview:** View key student and academic statistics.
- **Student Management:** View and manage student information.
- **Academic Performance:** Monitor student scores, performance trends, and academic progress.
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
- `/student/dashboard` — Student dashboard.

Additional student pages are available beneath the student dashboard routes.

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
