// components/ExpenseCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Expense } from '../types/expenses';

export default function ExpenseCard({ e, onPress }: { e: Expense; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.06 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontWeight: '700' }}>{e.title}</Text>
          <Text style={{ color: '#6b7280', marginTop: 4 }}>{e.paidBy} • {new Date(e.date).toLocaleDateString()}</Text>
        </View>
        <Text style={{ fontWeight: '700' }}>${e.amount.toFixed(2)}</Text>
      </View>
      {e.photoUri ? (
        <Image source={{ uri: e.photoUri }} style={{ width: '100%', height: 140, marginTop: 8, borderRadius: 8 }} />
      ) : null}
    </TouchableOpacity>
  );
}
