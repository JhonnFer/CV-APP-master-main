// types/cv.types.ts

export interface Skill {
  id: string;
  name: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto';
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  profileImage?: string; //url de imagen
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // who paid
  participants: string[]; // other participants
  receiptImage: string; // uri of the receipt photo (required)
  date: string;
}

export interface CVData {
  skills: Skill[];
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  expenses?: Expense[];
}
