// app/balance.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getExpenses } from '../hooks/storage';
import { computeBalances, settleBalances } from '../hooks/settlement';
import type { Balance, Transaction } from '../hooks/settlement';
import type { Expense } from '../types/expenses';

export default function BalanceScreen() {
  const [balances, setBalances] = useState<Balance | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesByPerson, setExpensesByPerson] = useState<Record<string, number>>({});
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  const load = async () => {
    const data: Expense[] = await getExpenses();

    // Guardar lista completa de gastos
    setExpenses(data);

    // Calcular gastos por persona y total
    const byPerson: Record<string, number> = {};
    let total = 0;
    data.forEach(e => {
      byPerson[e.paidBy] = (byPerson[e.paidBy] || 0) + e.amount;
      total += e.amount;
    });
    setExpensesByPerson(byPerson);
    setTotalExpenses(total);

    // Calcular balances y transacciones
    const b = computeBalances(data);
    const s = settleBalances(b);
    setBalances(b);
    setTxs(s);
  };

  // Promedio por persona
  const averagePerPerson = useMemo(() => {
    if (!balances || Object.keys(balances).length === 0) return 0;
    return totalExpenses / Object.keys(balances).length;
  }, [balances, totalExpenses]);

  // Recargar cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-purple-700 pt-16 pb-6 px-4">
        <Text className="text-white text-3xl font-bold">Balance de Cuentas</Text>
        <Text className="text-purple-200 text-lg">¿Quién debe a quién?</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Lista de Gastos Recientes */}
        <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow">
          <Text className="text-lg font-bold mb-2">Gastos Recientes</Text>
          {expenses.length === 0 ? (
            <Text className="text-gray-500">No hay gastos aún.</Text>
          ) : (
            expenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(exp => (
                <View key={exp.id} className="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                  <Text className="font-semibold text-gray-800">{exp.description}</Text>
                  <Text className="text-gray-600">Pagó: {exp.paidBy}</Text>
                  <Text className="text-gray-600">Monto: ${exp.amount.toFixed(2)}</Text>
                  {exp.photoUri && (
                    <Image
                      source={{ uri: exp.photoUri }}
                      className="w-full h-32 rounded-lg mt-2"
                      resizeMode="cover"
                    />
                  )}
                </View>
              ))
          )}
        </View>

        {/* Resumen de Deudas */}
        <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow">
          <Text className="text-lg font-bold mb-2">Transacciones Sugeridas</Text>
          {txs.length === 0 ? (
            <Text className="text-gray-500">No se requieren pagos.</Text>
          ) : (
            txs.map((t, i) => (
              <View key={i} className="flex-row justify-between py-2 border-b border-gray-100 last:border-b-0">
                <Text className="text-gray-700">{t.from} → {t.to}</Text>
                <Text className="font-semibold text-gray-800">${t.amount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Algoritmo de División */}
        <View className="bg-green-50 p-4 mx-4 my-4 rounded-xl border border-green-200">
          <Text className="text-lg font-bold text-green-700 mb-2">Algoritmo de División</Text>
          {Object.entries(expensesByPerson).map(([person, amount]) => (
            <Text key={person} className="text-gray-700 mb-1">
              <Text className="font-semibold">{person}</Text> gastó: ${amount.toFixed(2)}
            </Text>
          ))}
          <Text className="font-bold text-green-800 mt-2">
            Promedio por persona: ${averagePerPerson.toFixed(2)}
          </Text>
        </View>

        {/* Botón refrescar */}
        <TouchableOpacity
          className="bg-purple-500 p-3 rounded-lg items-center mx-4 mt-4"
          onPress={load}
        >
          <Text className="text-white font-semibold">Refrescar Datos</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
