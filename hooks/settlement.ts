import type { Expense, Person } from '../types/expenses';

export type Balance = Record<Person, number>;
export type Transaction = { from: Person; to: Person; amount: number };

export function computeBalances(expenses: Expense[]): Balance {
  const persons: Person[] = ['Juan', 'María', 'Pedro'];
  const bal: Balance = { Juan: 0, María: 0, Pedro: 0 };

  for (const e of expenses) {
    const share = e.amount / e.participants.length;
    bal[e.paidBy] += e.amount;
    for (const p of e.participants) {
      bal[p] -= share;
    }
  }

  // Redondear a 2 decimales
  for (const p of persons) bal[p] = Math.round(bal[p] * 100) / 100;

  return bal;
}

export function settleBalances(bal: Balance): Transaction[] {
  const people: Person[] = ['Juan', 'María', 'Pedro'];
  const list = people.map(p => ({ person: p, amt: Math.round(bal[p] * 100) / 100 }));
  const txs: Transaction[] = [];

  while (true) {
    list.sort((a, b) => b.amt - a.amt);
    const creditor = list.find(x => x.amt > 0);
    const debtor = list.slice().reverse().find(x => x.amt < 0);
    if (!creditor || !debtor) break;

    const amount = Math.min(creditor.amt, -debtor.amt);
    const rounded = Math.round(amount * 100) / 100;
    if (rounded <= 0) break;

    txs.push({ from: debtor.person, to: creditor.person, amount: rounded });

    creditor.amt = Math.round((creditor.amt - rounded) * 100) / 100;
    debtor.amt = Math.round((debtor.amt + rounded) * 100) / 100;
  }

  return txs;
}
