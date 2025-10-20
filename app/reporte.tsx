import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getExpenses } from '../hooks/storage';
import { computeBalances } from '../hooks/settlement';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import dayjs from 'dayjs';
import { Expense } from '../types/expenses';
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
    if (isProcessing) return; // Evita doble click
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
    <View style={{ flex: 1, padding: 12, backgroundColor: '#f8fafc' }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>📊 Reporte</Text>
      <ScrollView style={{ marginTop: 12 }}>
        

        <View style={{ height: 12 }} />

        <Text style={{ fontWeight: '600' }}>Gastos registrados ({expenses.length}):</Text>
        {expenses.slice(0, 20).map(e => (
          <View key={e.id} style={{ padding: 8, backgroundColor: '#fff', borderRadius: 8, marginTop: 8 }}>
            <Text style={{ fontWeight: '700' }}>{e.title} — ${e.amount.toFixed(2)}</Text>
            <Text style={{ color: '#6b7280' }}>{e.paidBy} • {new Date(e.date).toLocaleString()}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ marginTop: 16 }}>
        <TouchableOpacity
          onPress={generateAndSharePdf}
          disabled={isProcessing}
          style={{
            backgroundColor: isProcessing ? '#94a3b8' : '#2563eb',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: '700' }}>Generar y compartir PDF</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
