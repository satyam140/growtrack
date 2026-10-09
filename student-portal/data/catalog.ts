import type { CatalogSubject } from '@student/types'

const t = (code: string, name: string, short: string, credits: number, semester: number, teacher: string): CatalogSubject => ({
  code, name, short, credits, semester, teacher,
})

export const CATALOG: CatalogSubject[] = [
  t('MA101', 'Engineering Mathematics I', 'Maths I', 4, 1, 'Dr. R. Iyer'),
  t('PH101', 'Engineering Physics', 'Physics', 3, 1, 'Dr. S. Kulkarni'),
  t('EE101', 'Basic Electrical Engineering', 'BEE', 3, 1, 'Prof. A. Nair'),
  t('CS101', 'Programming in C', 'C Prog.', 4, 1, 'Prof. M. Desai'),
  t('ME101', 'Engineering Graphics', 'Graphics', 2, 1, 'Prof. P. Joshi'),
  t('HS101', 'Communication Skills', 'Comm.', 2, 1, 'Dr. L. Fernandes'),

  t('MA102', 'Engineering Mathematics II', 'Maths II', 4, 2, 'Dr. R. Iyer'),
  t('CH102', 'Engineering Chemistry', 'Chemistry', 3, 2, 'Dr. V. Menon'),
  t('CS102', 'Data Structures', 'DS', 4, 2, 'Prof. K. Reddy'),
  t('EC102', 'Digital Logic Design', 'DLD', 3, 2, 'Prof. N. Bhatt'),
  t('CS103', 'Object Oriented Programming', 'OOP', 4, 2, 'Prof. M. Desai'),
  t('EV102', 'Environmental Science', 'EVS', 2, 2, 'Dr. T. George'),

  t('MA201', 'Discrete Mathematics', 'Discrete', 4, 3, 'Dr. S. Banerjee'),
  t('CS201', 'Computer Organization', 'COA', 3, 3, 'Prof. N. Bhatt'),
  t('CS202', 'Design & Analysis of Algorithms', 'DAA', 4, 3, 'Prof. K. Reddy'),
  t('CS203', 'Python Programming', 'Python', 3, 3, 'Prof. D. Kapoor'),
  t('MA202', 'Probability & Statistics', 'Prob&Stat', 3, 3, 'Dr. S. Banerjee'),
  t('CS204', 'Web Technologies', 'Web Tech', 3, 3, 'Prof. D. Kapoor'),

  t('CS301', 'Microprocessors', 'MPI', 3, 4, 'Prof. N. Bhatt'),
  t('CS302', 'Advanced Data Structures', 'Adv. DS', 4, 4, 'Prof. K. Reddy'),
  t('CS303', 'Computer Graphics', 'CG', 3, 4, 'Prof. P. Joshi'),
  t('CS304', 'Java Enterprise Development', 'Java EE', 3, 4, 'Prof. M. Desai'),
  t('MG301', 'Engineering Economics', 'Economics', 2, 4, 'Dr. A. Shah'),
  t('CS305', 'Data Analytics Lab', 'DA Lab', 2, 4, 'Prof. D. Kapoor'),

  t('CS401', 'Database Management Systems', 'DBMS', 4, 5, 'Dr. Meera Pillai'),
  t('CS402', 'Operating Systems', 'OS', 4, 5, 'Prof. Rohit Verma'),
  t('CS403', 'Computer Networks', 'CN', 4, 5, 'Prof. Anita Rao'),
  t('CS404', 'Theory of Computation', 'TOC', 3, 5, 'Dr. S. Banerjee'),
  t('CS405', 'Software Engineering', 'SE', 3, 5, 'Prof. Kavita Singh'),
  t('CS406', 'AI & Machine Learning (Elective)', 'AI/ML', 3, 5, 'Dr. Arvind Nambiar'),
]

export const subjectsOfSemester = (sem: number) => CATALOG.filter((s) => s.semester === sem)
export const subjectByCode = (code: string) => CATALOG.find((s) => s.code === code)!

export const TOPICS: Record<string, string[]> = {
  CS401: ['ER Modelling', 'Relational Algebra', 'SQL Basics', 'Joins & Subqueries', 'Normalization (1NF–3NF)', 'BCNF', 'Transactions & ACID', 'Concurrency Control', 'Indexing & B+ Trees', 'Query Optimization', 'Recovery Techniques', 'NoSQL Overview'],
  CS402: ['Process Concepts', 'Threads', 'CPU Scheduling', 'Synchronization', 'Semaphores & Monitors', 'Deadlocks', 'Memory Management', 'Paging', 'Segmentation', 'Virtual Memory', 'File Systems', 'Disk Scheduling'],
  CS403: ['OSI & TCP/IP Models', 'Physical Layer', 'Data Link Layer', 'Error Detection', 'MAC Protocols', 'IP Addressing', 'Subnetting', 'Routing Algorithms', 'TCP Congestion Control', 'UDP & Sockets', 'DNS & HTTP', 'Network Security'],
  CS404: ['Finite Automata', 'NFA to DFA', 'Regular Expressions', 'Pumping Lemma', 'Context-Free Grammars', 'Pushdown Automata', 'Turing Machines', 'Decidability', 'Halting Problem', 'P vs NP', 'NP-Completeness', 'Reductions'],
  CS405: ['SDLC Models', 'Agile & Scrum', 'Requirements Engineering', 'UML Diagrams', 'Design Patterns', 'Software Testing', 'Black/White Box Testing', 'Project Estimation', 'Risk Management', 'Version Control', 'CI/CD', 'Maintenance'],
  CS406: ['Intro to AI', 'Search Strategies', 'Linear Regression', 'Logistic Regression', 'Decision Trees', 'KNN & SVM', 'Neural Networks', 'Backpropagation', 'Clustering', 'Model Evaluation', 'CNN Basics', 'Ethics in AI'],
}
