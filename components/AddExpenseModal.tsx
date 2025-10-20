import React, { useState } from "react";
import { Modal, ScrollView, View, Text, TextInput, TouchableOpacity, Button, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import { Expense, Person } from "../types/expenses";
import { addExpense } from "../hooks/storage";
import 'react-native-get-random-values';
const PEOPLE: Person[] = ["Juan", "María", "Pedro"];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export default function AddExpenseModal({ visible, onClose, onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState<Person>("Juan");
  const [participants, setParticipants] = useState<Person[]>(PEOPLE);
  const [photoUri, setPhotoUri] = useState<string | undefined>();

  function toggleParticipant(p: Person) {
    setParticipants(prev => (prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]));
  }

  // === Imagen ===
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  // === Guardar gasto ===
  async function saveExpense() {
    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (!title.trim()) return Alert.alert("Validación", "La descripción es obligatoria.");
    if (isNaN(parsedAmount) || parsedAmount <= 0) return Alert.alert("Validación", "Monto inválido.");
    if (participants.length === 0) return Alert.alert("Validación", "Selecciona al menos un participante.");
    if (!photoUri) return Alert.alert("Validación", "Agrega una foto del recibo.");

    const expense: Expense = {
      id: uuidv4(),
      title: title.trim(),
      description: title.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      paidBy,
      participants,
      date: new Date().toISOString(),
      photoUri,
      notes: "",
      verified: true,
    };

    await addExpense(expense);

    // Limpiar campos
    setTitle("");
    setAmount("");
    setPaidBy("Juan");
    setParticipants(PEOPLE);
    setPhotoUri(undefined);

    onSaved?.();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} className="bg-gray-100">
        <Text className="text-2xl font-bold mb-4">Agregar Nuevo Gasto</Text>

        {/* Descripción */}
        <Text className="text-gray-700 mb-1">Descripción</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ej. Cena en restaurante"
          className="bg-white p-3 rounded-lg mb-4"
        />

        {/* Monto */}
        <Text className="text-gray-700 mb-1">Monto</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          className="bg-white p-3 rounded-lg mb-4"
        />

        {/* Pagado por */}
        <Text className="text-gray-700 mb-1">Pagado por</Text>
        <View className="flex-row gap-2 mb-4">
          {PEOPLE.map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setPaidBy(p)}
              className={`px-4 py-2 rounded-lg ${paidBy === p ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <Text className={`font-semibold ${paidBy === p ? "text-white" : "text-black"}`}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Participantes */}
        <Text className="text-gray-700 mb-1">Participantes</Text>
        <View className="flex-row gap-2 mb-4">
          {PEOPLE.map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => toggleParticipant(p)}
              className={`px-4 py-2 rounded-lg ${participants.includes(p) ? "bg-green-500" : "bg-gray-300"}`}
            >
              <Text className={`font-semibold ${participants.includes(p) ? "text-white" : "text-black"}`}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Foto del recibo */}
        <Text className="text-gray-700 mb-1">Foto del recibo</Text>
        <View className="items-center mb-4">
          {photoUri && <Image source={{ uri: photoUri }} className="w-32 h-32 rounded-lg mb-2" />}
          <Button title="Seleccionar Foto" onPress={pickImage} />
        </View>

        {/* Botones */}
        <View className="mb-4">
          <Button title="Guardar Gasto" onPress={saveExpense} />
          <View className="h-2" />
          <Button title="Cancelar" color="#9CA3AF" onPress={onClose} />
        </View>
      </ScrollView>
    </Modal>
  );
}
