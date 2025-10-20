import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  // ❌ ELIMINADO: Button
  FlatList,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useCVContext } from "../context/CVContext";

type FormData = {
  name: string;
  level: "Básico" | "Intermedio" | "Avanzado" | "Experto";
};

const LEVELS = ["Básico", "Intermedio", "Avanzado", "Experto"] as const;

export default function SkillsScreen() {
  const { cvData, addSkill, removeSkill } = useCVContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "", level: "Básico" },
  });

  const onSubmit = (data: FormData) => {
    addSkill({ name: data.name.trim(), level: data.level });
    reset();
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-xl font-semibold mb-3 text-gray-800">Agregar Habilidad</Text>

      <Text className="text-base mb-1 text-gray-700">Nombre de la habilidad</Text>
      <Controller
        control={control}
        name="name"
        rules={{
          required: "El nombre es obligatorio",
          minLength: { value: 2, message: "Mínimo 2 caracteres" },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Ej: JavaScript, React Native"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            className="border border-gray-300 rounded-lg p-2 mb-1 bg-white"
          />
        )}
      />
      {errors.name && <Text className="text-red-500 mb-2">{errors.name.message}</Text>}

      <Text className="text-base mt-2 mb-1 text-gray-700">Nivel</Text>
      <Controller
        control={control}
        name="level"
        render={({ field: { onChange, value } }) => (
          <View className="flex-row flex-wrap gap-2 my-2">
            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl}
                onPress={() => onChange(lvl)}
                className={`p-2 border rounded-lg ${
                  value === lvl ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300"
                }`}
              >
                <Text className={`${value === lvl ? "text-blue-700 font-semibold" : "text-gray-700"}`}>{lvl}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      {/* MIGRACIÓN: Button Agregar */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-blue-500 p-3 rounded-lg mt-3 mb-4"
        activeOpacity={0.8}
      >
        <Text className="text-white text-base font-bold text-center">
          Agregar Habilidad
        </Text>
      </TouchableOpacity>

      <Text className="text-lg font-semibold my-3 text-gray-800">Habilidades agregadas</Text>
      <FlatList
        data={cvData.skills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-3 border-b border-gray-200 bg-white mb-1 rounded-sm">
            <View>
              <Text className="font-semibold text-base text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-600">{item.level}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Eliminar", `¿Eliminar ${item.name}?`, [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => removeSkill(item.id),
                  },
                ]);
              }}
            >
              <Text className="text-red-600 font-medium">Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text className="text-gray-500 text-center mt-4">No hay habilidades aún.</Text>}
      />
    </View>
  );
}