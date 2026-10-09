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

const initialStudentProfiles: StudentProfile[] = [
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

const additionalStudentDetails = [
  ["Meera Kapoor", "Computer Science"],
  ["Arjun Nair", "Information Technology"],
  ["Sana Khan", "Electronics"],
  ["Vikram Desai", "Mechanical Engineering"],
  ["Diya Iyer", "Computer Science"],
  ["Rahul Bose", "Information Technology"],
  ["Nisha Kulkarni", "Electronics"],
  ["Aditya Rao", "Mechanical Engineering"],
  ["Tara Choudhary", "Computer Science"],
  ["Karan Shah", "Information Technology"],
  ["Pooja Menon", "Electronics"],
  ["Siddharth Jain", "Mechanical Engineering"],
  ["Ira Banerjee", "Computer Science"],
  ["Manav Sethi", "Information Technology"],
  ["Zoya Ali", "Electronics"],
  ["Harsh Vardhan", "Mechanical Engineering"],
  ["Riya Das", "Computer Science"],
  ["Nikhil Bhat", "Information Technology"],
  ["Aisha Thomas", "Electronics"],
  ["Yash Agarwal", "Mechanical Engineering"],
  ["Anika Sen", "Computer Science"],
  ["Varun Pillai", "Information Technology"],
  ["Simran Kaur", "Electronics"],
  ["Omkar Patil", "Mechanical Engineering"],
  ["Maya Krishnan", "Computer Science"],
  ["Devika Rao", "Information Technology"],
  ["Kabir Anand", "Electronics"],
] as const;

const additionalStudentProfiles: StudentProfile[] = additionalStudentDetails.map(
  ([name, department], index) => {
    const academicScore = 55 + ((index * 7) % 41);
    const attendance = 62 + ((index * 11) % 38);
    const assignmentCompletion = 60 + ((index * 9) % 39);
    const skillsScore = 54 + ((index * 13) % 46);
    const placementScore = 48 + ((index * 17) % 52);
    const engagementScore = 60 + ((index * 5) % 40);
    const successScore = Math.round(
      (academicScore +
        attendance +
        assignmentCompletion +
        skillsScore +
        placementScore +
        engagementScore) /
        6,
    );
    const risk =
      academicScore < 50 || attendance < 65
        ? "High"
        : academicScore < 70 || attendance < 75
          ? "Medium"
          : "Low";
    const riskReasons = [
      ...(attendance < 75
        ? ["Attendance is below the 75% target."]
        : []),
      ...(academicScore < 60
        ? ["Academic performance may need additional support."]
        : []),
      ...(placementScore < 60
        ? ["Additional placement preparation may help."]
        : []),
    ];

    return {
      id: `STU-${String(1260 + index).padStart(4, "0")}`,
      name,
      department,
      year: ["2nd year", "3rd year", "4th year"][index % 3],
      attendance,
      academicScore,
      assignmentCompletion,
      skillsScore,
      placementScore,
      engagementScore,
      successScore,
      risk,
      riskReasons,
    };
  },
);

export const studentProfiles: StudentProfile[] = [
  ...initialStudentProfiles,
  ...additionalStudentProfiles,
];
