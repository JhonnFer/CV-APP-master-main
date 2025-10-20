// app/ReportScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { getExpenses } from '../hooks/storage';
import { computeBalances } from '../hooks/settlement';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import dayjs from 'dayjs';
import { Expense } from '../types/expenses';
import '../global.css';
import { Share2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2;

// Componente de barra de categoría
const CategoryBar = ({ name, amount, totalMax, color, isMain }: { name: string, amount: number, totalMax: number, color: string, isMain?: boolean }) => {
  const percentage = (amount / totalMax) * 100;
  return (
    <View className="mb-3">
      <View className="flex-row justify-between items-center mb-1">
        <Text className={`text-base ${isMain ? 'font-semibold' : 'font-normal'} text-gray-800`}>{name}</Text>
        <Text className={`text-base ${isMain ? 'font-semibold' : 'font-normal'} text-gray-800`}>${amount.toFixed(0)}</Text>
      </View>
      <View className="h-2 bg-gray-200 rounded-full">
        <View style={{ width: `${percentage > 100 ? 100 : percentage}%`, backgroundColor: color }} className="h-full rounded-full" />
      </View>
    </View>
  );
};

export default function ReportScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [startDate] = useState(dayjs('2025-10-01'));
  const [endDate] = useState(dayjs('2025-10-17'));

  async function load() {
    const e = await getExpenses();
    setExpenses(e);
  }

  useEffect(() => { load(); }, []);

  // Totales y promedios
  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const daysInPeriod = endDate.diff(startDate, 'day') + 1;
  const averagePerDay = daysInPeriod > 0 ? totalSpent / daysInPeriod : 0;

  // Categorías de ejemplo
  const categories = useMemo(() => ({
    Comida: 280,
    Restaurantes: 150,
    Transporte: 45,
    TotalMax: Math.max(280, 150, 45)
  }), []);

  function buildHtml(): string {
    const title = `Reporte de Gastos - ${dayjs().format('YYYY-MM-DD')}`;
    const rows = expenses.map(ex => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd">${ex.title}</td>
        <td style="padding:8px;border:1px solid #ddd">${ex.paidBy}</td>
        <td style="padding:8px;border:1px solid #ddd">$${ex.amount.toFixed(2)}</td>
        <td style="padding:8px;border:1px solid #ddd">${new Date(ex.date).toLocaleString()}</td>
      </tr>
    `).join('');

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>body { font-family: Arial; padding: 20px; } table { border-collapse: collapse; width: 100%; } td, th { border:1px solid #ddd; padding:8px; }</style>
        </head>
        <body>
          <h1>${title}</h1>
          <table>
            <thead><tr><th>Título</th><th>Pagó</th><th>Monto</th><th>Fecha</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;
  }

  async function generateAndSharePdf() {
    if (isProcessing) return;
    if (expenses.length === 0) return Alert.alert('Reporte', 'No hay gastos para generar reporte.');

    setIsProcessing(true);
    try {
      const html = buildHtml();
      const { uri } = await Print.printToFileAsync({ html });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Compartir', `PDF generado en: ${uri}`);
        return;
      }

      await Sharing.shareAsync(uri, { dialogTitle: 'Compartir reporte de gastos' });
    } catch (e: any) {
      console.error('❌ Error al compartir PDF:', e);
      Alert.alert('Error', e.message || 'No se pudo generar el PDF');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <View className="flex-1 bg-gray-100">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#4c1d95' }}>

        {/* Header */}
        <View className="bg-violet-800 pt-8 pb-4 px-4">
          <Text className="text-white text-3xl font-bold">Reporte Mensual</Text>
          <Text className="text-violet-300 text-lg">Octubre 2025</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} className="-mt-4 bg-gray-100 rounded-t-2xl">
          {/* Tarjetas resumen */}
          <View className="flex-row justify-between mb-6">
            <View style={{ width: CARD_WIDTH }} className="bg-white p-4 rounded-xl shadow-md border-t-4 border-blue-600">
              <Text className="text-gray-500 mb-1">Total Gastos</Text>
              <Text className="text-3xl font-bold text-gray-800">${totalSpent.toFixed(0)}</Text>
            </View>
            <View style={{ width: CARD_WIDTH }} className="bg-white p-4 rounded-xl shadow-md border-t-4 border-blue-600">
              <Text className="text-gray-500 mb-1">Promedio/día</Text>
              <Text className="text-3xl font-bold text-gray-800">${averagePerDay.toFixed(2)}</Text>
            </View>
          </View>

          {/* Categorías */}
          <View className="bg-white p-4 rounded-xl mb-6 shadow-md">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Gastos por Categoría</Text>
            <CategoryBar name="Comida" amount={categories.Comida} totalMax={categories.TotalMax} color="#2563eb" isMain />
            <CategoryBar name="Restaurantes" amount={categories.Restaurantes} totalMax={categories.TotalMax} color="#9333ea" />
            <CategoryBar name="Transporte" amount={categories.Transporte} totalMax={categories.TotalMax} color="#f97316" />
          </View>

          {/* Gastos listados */}
          <Text className="font-semibold mb-2">Gastos registrados ({expenses.length}):</Text>
          {expenses.slice(0, 20).map(e => (
            <View key={e.id} className="p-3 bg-white rounded-xl shadow-sm mt-2">
              <Text className="font-bold text-gray-900">{e.title} — ${e.amount.toFixed(2)}</Text>
              <Text className="text-gray-500">{e.paidBy} • {new Date(e.date).toLocaleString()}</Text>
            </View>
          ))}

          {/* Botones */}
          <TouchableOpacity
            onPress={generateAndSharePdf}
            disabled={isProcessing}
            className={`p-4 rounded-xl items-center mb-3 shadow-lg ${isProcessing ? 'bg-violet-400' : 'bg-violet-700'}`}
          >
            {isProcessing ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold text-lg">⬇️ Generar PDF</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={generateAndSharePdf}
            className="p-4 rounded-xl items-center border-2 border-violet-700 bg-white"
            disabled={isProcessing}
          >
            <Text className="text-violet-700 font-semibold text-lg">Compartir Reporte</Text>
          </TouchableOpacity>

        </ScrollView>


        {/* Botón flotante circular */}
        <TouchableOpacity
          onPress={generateAndSharePdf}
          disabled={isProcessing}
          className={`absolute bottom-20 right-6 p-4 rounded-full shadow-lg ${isProcessing ? 'bg-slate-400' : 'bg-blue-600'}`}
        >
          {isProcessing ? <ActivityIndicator color="#fff" /> : <Share2 size={28} color="white" />}
        </TouchableOpacity>

      </SafeAreaView>
    </View>
  );
}
