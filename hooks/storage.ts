// hooks/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Expense } from "../types/expenses";

const STORAGE_KEY = "@expenses";

export async function getExpenses(): Promise<Expense[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json) as Expense[];
  } catch {
    return [];
  }
}

export async function addExpense(expense: Expense) {
  const current = await getExpenses();
  current.push(expense);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}
