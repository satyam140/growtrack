import { studentProfiles } from "@/lib/students";

export type DemoFaculty = {
  id: string;
  name: string;
  department: string;
  designation: string;
  subjects: string[];
};

export const demoFaculty: DemoFaculty[] = [
  {
    id: "FAC-1001",
    name: "Dr. Meera Nair",
    department: "Computer Science",
    designation: "Associate Professor",
    subjects: ["Data Structures", "Operating Systems"],
  },
  {
    id: "FAC-1002",
    name: "Prof. Arjun Rao",
    department: "Computer Science",
    designation: "Assistant Professor",
    subjects: ["Database Management Systems", "Computer Networks"],
  },
  {
    id: "FAC-1003",
    name: "Dr. Kavita Shah",
    department: "Information Technology",
    designation: "Professor",
    subjects: ["Web Development", "Software Engineering"],
  },
  {
    id: "FAC-1004",
    name: "Prof. Rakesh Menon",
    department: "Electronics",
    designation: "Assistant Professor",
    subjects: ["Digital Electronics", "Signals and Systems"],
  },
];

export function getDemoFacultyStudents(faculty: DemoFaculty) {
  return studentProfiles.filter((student) => student.department === faculty.department);
}

