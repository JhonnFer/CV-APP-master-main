import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Expense } from "../types/expenses";
import { computeBalances, settleBalances } from "../hooks/settlement";
import { getExpenses } from "../hooks/storage";
import AddExpenseModal from "../components/AddExpenseModal";

export default function HomeExpensesScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

  useEffect(() => { loadExpenses(); }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balances = computeBalances(expenses);
  const transactions = settleBalances(balances);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} className="bg-gray-100">

      {/* Resumen Total */}
      <View className="bg-blue-600 p-4 rounded-xl mb-4 shadow">
        <Text className="text-2xl font-bold text-white mb-1">Gastos Compartidos</Text>
        <Text className="text-gray-200">Total Gastado: ${totalSpent.toFixed(2)}</Text>
      </View>

      {/* Últimos Gastos */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-gray-800"> Gastos</Text>
          {/* Botón + para agregar gasto */}

        </View>

        {expenses.length === 0 && (
          <Text className="text-gray-500 text-sm">No hay gastos aún.</Text>
        )}

        {expenses.map(e => (
          <View key={e.id} className="bg-gray-50 p-3 rounded-lg mb-2">
            <Text className="text-gray-800 font-medium">{e.description}</Text>
            <Text className="text-gray-600 text-sm">Monto: ${e.amount.toFixed(2)}</Text>
            <Text className="text-gray-600 text-sm">Pagó por: {e.paidBy}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg absolute bottom-8 right-8"
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>


      {/* Modal para agregar gasto */}
      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSaved={async () => {
          await loadExpenses();   // recarga los datos
          setModalVisible(false);
        }}
      />
    </ScrollView>
  );
}
