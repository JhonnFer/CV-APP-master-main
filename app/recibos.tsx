import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseDetailModal from "../components/ExpenseDetailModal";
import { getExpenses } from "../hooks/storage";
import { Expense } from "../types/expenses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import "../global.css";

// --- Configuración del grid ---
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 12 * 2 - 12) / 2;

// --- Tarjeta individual de recibo ---
const ReceiptCard = ({
  e,
  onPress,
  isTotalCard = false,
  totalCount = 0,
}: {
  e?: Expense;
  onPress: () => void;
  isTotalCard?: boolean;
  totalCount?: number;
}) => {
  if (isTotalCard) {
    return (
      <View
        style={{ width: CARD_WIDTH, marginBottom: 12, height: CARD_WIDTH * 1.35 }}
        className="bg-white p-4 rounded-xl items-center justify-center border-2 border-gray-100/50"
      >
        <Text className="text-4xl font-bold text-gray-800">{totalCount}</Text>
        <Text className="text-sm text-gray-500 mt-1">Total Recibos</Text>
      </View>
    );
  }

  if (!e) return <View style={{ width: CARD_WIDTH, marginBottom: 12 }} />;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width: CARD_WIDTH, marginBottom: 12 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm"
    >
      {/* Imagen/Icono */}
      <View className="h-28 bg-gray-50 items-center justify-center relative">
        <View className="absolute top-2 right-2 bg-white/70 p-1 rounded-full">
          <Text className="text-gray-600 text-xs">🔍</Text>
        </View>
        <Text className="text-purple-300 text-6xl">🧾</Text>
      </View>

      {/* Descripción y monto */}
      <View className="p-3">
        <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
          {e.description || "Gasto sin nombre"}
        </Text>

        <View className="flex-row justify-between items-end mt-1">
          <Text className="text-sm text-gray-500">
            {new Date(e.date)
              .toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
              .replace(".", "")}
          </Text>
          <Text className="text-lg font-bold text-blue-600">
            ${e.amount.toFixed(0)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ReceiptsScreen() {
  const [items, setItems] = useState<Expense[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Expense | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const totalRecibos = items.length;

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const e = await getExpenses();
      const storedUser = await AsyncStorage.getItem("userName");
      setUserName(storedUser);

      const userExpenses = storedUser
        ? e.filter((g) => g.paidBy === storedUser)
        : e;

      const ordered = userExpenses.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setItems(ordered);
    } catch (err) {
      console.error("Error al cargar gastos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleCardPress = (i: Expense) => {
    setSelected(i);
    setDetailVisible(true);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-orange-600 pt-16 pb-6 px-4">
        <Text className="text-white text-3xl font-bold">Mis Recibos</Text>
        <Text className="text-orange-200 text-lg">
          {totalRecibos} recibos de {userName || "usuario"}
        </Text>
      </View>

      {/* Contenido */}
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 100 }}>
        <View className="bg-white p-4 rounded-xl mb-4 border border-blue-100 shadow-sm">
          <View className="flex-row items-center mb-1">
            <Text className="text-blue-600 text-lg mr-2">📷</Text>
            <Text className="text-lg font-semibold text-gray-800">
              Recibos Verificados
            </Text>
          </View>
          <Text className="text-sm text-gray-500">
            Cada gasto incluye su recibo registrado.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#f97316" className="mt-8" />
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {items.map((i) => (
              <ReceiptCard
                key={i.id}
                e={i}
                onPress={() => handleCardPress(i)}
              />
            ))}

            <ReceiptCard
              onPress={() => {}}
              isTotalCard
              totalCount={totalRecibos}
            />

            {(totalRecibos + 1) % 2 !== 0 && (
              <View style={{ width: CARD_WIDTH }}></View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Botón flotante */}
      <TouchableOpacity
        onPress={() => setShowAdd(true)}
        className="bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg absolute bottom-20 right-6"
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>



      {/* Modales */}
      <AddExpenseModal
        visible={showAdd}
        onClose={() => {
          setShowAdd(false);
          refresh();
        }}
        onSaved={refresh}
      />
      <ExpenseDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        expense={selected ?? undefined}
      />
    </View>
  );
}
