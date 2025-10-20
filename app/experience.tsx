import React, { useState } from "react";
import {
  View,
  Text,
  // ❌ ELIMINADO: StyleSheet
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  // ❌ ELIMINADO: Button
} from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";
import { useForm, Controller } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Feather } from "@expo/vector-icons";
import moment from "moment";

type FormData = Omit<Experience, "id">;

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [dateField, setDateField] = useState<"startDate" | "endDate">("startDate");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const showDatePicker = (field: "startDate" | "endDate") => {
    setDateField(field);
    setDatePickerVisible(true);
  };

  const handleConfirm = (date: Date) => {
    const formatted = moment(date).format("YYYY-MM-DD");
    setValue(dateField, formatted);
    setDatePickerVisible(false);
  };

  const onSubmit = (data: FormData) => {
    const newExperience: Experience = { id: Date.now().toString(), ...data };
    addExperience(newExperience);
    reset();
    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteExperience(id) },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5">
        <Text className="text-xl font-bold mb-4 text-gray-800">
          Agregar Nueva Experiencia
        </Text>

        <Text className="text-base mb-1 text-gray-700">Empresa *</Text>
        <Controller
          control={control}
          name="company"
          rules={{ required: "La empresa es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
              placeholder="Nombre de la empresa"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.company && <Text className="text-red-500 mb-2">{errors.company.message}</Text>}

        <Text className="text-base mb-1 text-gray-700">Cargo *</Text>
        <Controller
          control={control}
          name="position"
          rules={{ required: "El cargo es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3 bg-white"
              placeholder="Tu posición"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.position && <Text className="text-red-500 mb-2">{errors.position.message}</Text>}

        <Text className="text-base mb-1 text-gray-700">Fecha de Inicio *</Text>
        <Controller
          control={control}
          name="startDate"
          rules={{ required: "La fecha de inicio es obligatoria" }}
          render={({ field: { value } }) => (
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3 bg-white"
              onPress={() => showDatePicker("startDate")}
            >
              {/* Se usa un objeto de estilo simple solo para flex: 1 en el texto, ya que Text no soporta flex-1 directamente sin className */}
              <Text style={{ flex: 1 }}>{value || "Selecciona fecha"}</Text>
              <Feather name="calendar" size={20} color="#3498db" />
            </TouchableOpacity>
          )}
        />
        {errors.startDate && <Text className="text-red-500 mb-2">{errors.startDate.message}</Text>}

        <Text className="text-base mb-1 text-gray-700">Fecha de Fin</Text>
        <Controller
          control={control}
          name="endDate"
          render={({ field: { value } }) => (
            <TouchableOpacity
              className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3 bg-white"
              onPress={() => showDatePicker("endDate")}
            >
              <Text style={{ flex: 1 }}>{value || "Selecciona fecha"}</Text>
              <Feather name="calendar" size={20} color="#3498db" />
            </TouchableOpacity>
          )}
        />

        <Text className="text-base mb-1 text-gray-700">Descripción</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              // Se combina NativeWind (borde, padding, etc.) con estilos para multiline
              className="border border-gray-300 rounded-lg p-3 mb-3 bg-white h-24"
              style={{ textAlignVertical: "top" }} 
              placeholder="Describe tus responsabilidades..."
              multiline
              numberOfLines={4}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {/* ⬅️ BOTÓN AGREGAR MIGRADO: De Button a TouchableOpacity */}
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg mt-3 mb-3"
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-bold text-center">
            Agregar Experiencia
          </Text>
        </TouchableOpacity>

        {cvData.experiences.length > 0 && (
          <>
            <Text className="text-lg font-semibold mt-6 mb-3 text-gray-800">
              Experiencias Agregadas
            </Text>
            {cvData.experiences.map((exp) => (
              <View
                key={exp.id}
                className="bg-white rounded-xl p-4 mb-3 flex-row shadow-md"
              >
                <View className="flex-1">
                  <Text className="text-base font-semibold mb-1">
                    {exp.position}
                  </Text>
                  <Text className="text-sm mb-1">{exp.company}</Text>
                  <Text className="text-xs text-gray-400">
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-red-600 justify-center items-center"
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text className="text-white text-lg font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* ⬅️ BOTÓN VOLVER MIGRADO: De Button a TouchableOpacity */}
        <TouchableOpacity
          className="bg-gray-500 p-3 rounded-lg mt-4"
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-bold text-center">
            Volver
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisible(false)}
        />
      </View>
    </ScrollView>
  );
}

// ❌ ELIMINADO EL OBJETO StyleSheet POR COMPLETO