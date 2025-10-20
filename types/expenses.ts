export type Person = 'Juan' | 'María' | 'Pedro';

export type Expense = {
  id: string;
  title: string;
  description: string;
  amount: number;
  paidBy: Person;
  participants: Person[];
  date: string; // ISO string
  photoUri: string;
  notes?: string;
  verified: boolean;
};
