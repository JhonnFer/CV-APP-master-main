// app/ReportScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getExpenses } from '../hooks/storage';
import { computeBalances } from '../hooks/settlement';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import dayjs from 'dayjs';
import { Expense } from '../types/expenses';
import  {Share2}  from 'lucide-react-native';
import '../global.css';

export default function ReportScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function load() {
    const e = await getExpenses();
    setExpenses(e);
    setBalances(computeBalances(e));
  }

  useEffect(() => { load(); }, []);

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

    const balancesHtml = balances
      ? Object.entries(balances).map(([k, v]) => `<div>${k}: $${Number(v).toFixed(2)}</div>`).join('')
      : '';

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
            h1 { color: #111; }
            table { border-collapse: collapse; width: 100%; margin-top: 12px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <h3>Resumen de balances</h3>
          ${balancesHtml}
          <h3 style="margin-top: 18px;">Gastos</h3>
          <table>
            <thead>
              <tr>
                <th style="padding:8px;border:1px solid #ddd">Título</th>
                <th style="padding:8px;border:1px solid #ddd">Pagó</th>
                <th style="padding:8px;border:1px solid #ddd">Monto</th>
                <th style="padding:8px;border:1px solid #ddd">Fecha</th>
              </tr>
            </thead>
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
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="text-lg font-bold">📊 Reporte</Text>

      <ScrollView className="mt-3">
        <Text className="font-semibold">Gastos registrados ({expenses.length}):</Text>

        {expenses.slice(0, 20).map(e => (
          <View
            key={e.id}
            className="p-3 bg-white rounded-xl shadow-sm mt-2"
          >
            <Text className="font-bold text-gray-900">
              {e.title} — ${e.amount.toFixed(2)}
            </Text>
            <Text className="text-gray-500">
              {e.paidBy} • {new Date(e.date).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* 🔵 Botón flotante circular para generar PDF */}
      <TouchableOpacity
        onPress={generateAndSharePdf}
        disabled={isProcessing}
        className={`absolute bottom-6 right-6 p-4 rounded-full shadow-lg ${
          isProcessing ? 'bg-slate-400' : 'bg-blue-600'
        }`}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Share2 size={28} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
}
