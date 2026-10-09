export type StudentProfile = {
  id: string;
  name: string;
  department: string;
  year: string;
  attendance: number;
  academicScore: number;
  assignmentCompletion: number;
  skillsScore: number;
  placementScore: number;
  engagementScore: number;
  successScore: number;
  risk: "High" | "Medium" | "Low";
  riskReasons: string[];
};

export const studentProfiles: StudentProfile[] = [
  {
    id: "STU-1024",
    name: "Aarav Sharma",
    department: "Computer Science",
    year: "3rd year",
    attendance: 62,
    academicScore: 48,
    assignmentCompletion: 54,
    skillsScore: 52,
    placementScore: 46,
    engagementScore: 58,
    successScore: 48,
    risk: "High",
    riskReasons: [
      "Attendance is below the 75% target.",
      "Academic performance needs improvement.",
      "Placement readiness score is low.",
    ],
  },
  {
    id: "STU-1087",
    name: "Priya Patel",
    department: "Information Technology",
    year: "4th year",
    attendance: 71,
    academicScore: 59,
    assignmentCompletion: 68,
    skillsScore: 64,
    placementScore: 52,
    engagementScore: 72,
    successScore: 56,
    risk: "Medium",
    riskReasons: [
      "Attendance is below the 75% target.",
      "Additional placement preparation may help.",
    ],
  },
  {
    id: "STU-1132",
    name: "Rohan Verma",
    department: "Electronics",
    year: "2nd year",
    attendance: 58,
    academicScore: 42,
    assignmentCompletion: 46,
    skillsScore: 43,
    placementScore: 40,
    engagementScore: 48,
    successScore: 42,
    risk: "High",
    riskReasons: [
      "Attendance is significantly below the target.",
      "Academic and practical scores need review.",
      "A faculty mentoring session is recommended.",
    ],
  },
  {
    id: "STU-1169",
    name: "Ananya Singh",
    department: "Computer Science",
    year: "4th year",
    attendance: 76,
    academicScore: 65,
    assignmentCompletion: 70,
    skillsScore: 62,
    placementScore: 58,
    engagementScore: 75,
    successScore: 61,
    risk: "Medium",
    riskReasons: [
      "Placement readiness could be improved.",
      "Technical skills practice is recommended.",
    ],
  },
  {
    id: "STU-1201",
    name: "Ishaan Mehta",
    department: "Information Technology",
    year: "3rd year",
    attendance: 91,
    academicScore: 86,
    assignmentCompletion: 92,
    skillsScore: 84,
    placementScore: 82,
    engagementScore: 88,
    successScore: 86,
    risk: "Low",
    riskReasons: [],
  },
  {
    id: "STU-1215",
    name: "Kavya Reddy",
    department: "Mechanical Engineering",
    year: "2nd year",
    attendance: 82,
    academicScore: 73,
    assignmentCompletion: 78,
    skillsScore: 75,
    placementScore: 68,
    engagementScore: 80,
    successScore: 74,
    risk: "Low",
    riskReasons: [],
  },
  {
    id: "STU-1240",
    name: "Neha Joshi",
    department: "Electronics",
    year: "3rd year",
    attendance: 68,
    academicScore: 64,
    assignmentCompletion: 72,
    skillsScore: 66,
    placementScore: 60,
    engagementScore: 62,
    successScore: 65,
    risk: "Medium",
    riskReasons: [
      "Attendance is below the 75% target.",
      "Check-in with the assigned faculty mentor is suggested.",
    ],
  },
  {
    id: "STU-1258",
    name: "Dev Malhotra",
    department: "Computer Science",
    year: "4th year",
    attendance: 94,
    academicScore: 91,
    assignmentCompletion: 88,
    skillsScore: 93,
    placementScore: 95,
    engagementScore: 89,
    successScore: 91,
    risk: "Low",
    riskReasons: [],
  },
];
