// components/ExpenseDetailModal.tsx
import React from 'react';
import { Modal, View, Text, Image, Button, ScrollView } from 'react-native';
import { Expense } from '../types/expenses';

export default function ExpenseDetailModal({ visible, onClose, expense }: { visible: boolean; onClose: () => void; expense?: Expense | null }) {
  if (!expense) return null;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{expense.title}</Text>
        <Text style={{ color: '#6b7280', marginTop: 4 }}>{expense.paidBy} • {new Date(expense.date).toLocaleString()}</Text>
        <Text style={{ fontWeight: '700', fontSize: 18, marginTop: 8 }}>${expense.amount.toFixed(2)}</Text>

        <Text style={{ marginTop: 12, fontWeight: '600' }}>Participantes:</Text>
        <Text>{expense.participants.join(', ')}</Text>

        {expense.notes ? (
          <>
            <Text style={{ marginTop: 12, fontWeight: '600' }}>Notas:</Text>
            <Text>{expense.notes}</Text>
          </>
        ) : null}

        <Text style={{ marginTop: 12, fontWeight: '600' }}>Recibo:</Text>
        <Image source={{ uri: expense.photoUri }} style={{ width: '100%', height: 420, marginTop: 8, borderRadius: 8 }} resizeMode="contain" />

        <View style={{ marginTop: 16 }}>
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </ScrollView>
    </Modal>
  );
}
