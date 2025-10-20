// app/receipts.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import ExpenseCard from '../components/ExpenseCard';
import AddExpenseModal from '../components/AddExpenseModal';
import ExpenseDetailModal from '../components/ExpenseDetailModal';
import { getExpenses  } from '../hooks/storage';
import { Expense } from '../types/expenses';
import '../global.css';

export default function ReceiptsScreen() {
  const [items, setItems] = useState<Expense[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Expense | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  async function refresh() {
    const e = await getExpenses ();
    setItems(e);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: '#f8fafc' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>🧾 Recibos / Gastos</Text>
        <Button title="+ Nuevo" onPress={() => setShowAdd(true)} />
      </View>

      <ScrollView>
        {items.length === 0 ? (
          <Text style={{ color: '#6b7280' }}>No hay gastos aún. Pulsa + Nuevo para agregar.</Text>
        ) : (
          items.map(i => (
            <ExpenseCard key={i.id} e={i} onPress={() => { setSelected(i); setDetailVisible(true);} } />
          ))
        )}
      </ScrollView>

      <AddExpenseModal visible={showAdd} onClose={() => { setShowAdd(false); refresh(); }} onSaved={refresh} />
      <ExpenseDetailModal visible={detailVisible} onClose={() => setDetailVisible(false)} expense={selected ?? undefined} />
    </View>
  );
}
