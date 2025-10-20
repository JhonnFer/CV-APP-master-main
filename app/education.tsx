// app/education.tsx (VERSIÓN MIGRADA FINAL)
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity, // ⬅️ Usamos este componente
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";
import { useForm, Controller } from "react-hook-form";

type FormData = Omit<Education, "id">;

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const newEducation: Education = { id: Date.now().toString(), ...data };
    addEducation(newEducation);
    reset();
    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  return (
    // Reemplazo de styles.container
    <ScrollView className="flex-1 bg-gray-100">
      {/* Reemplazo de styles.content */}
      <View className="p-5">
        {/* Reemplazo de styles.sectionTitle */}
        <Text className="text-2xl font-bold mb-4 text-gray-800">
          Agregar Nueva Educación
        </Text>

        {/* Institución */}
        {/* Reemplazo de styles.label */}
        <Text className="text-sm text-gray-700 mb-1">Institución *</Text>
        <Controller
          control={control}
          name="institution"
          rules={{ required: "La institución es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              // Reemplazo de styles.input
              className="border border-gray-300 rounded-lg p-3 mb-3 bg-white text-base"
              placeholder="Nombre de la universidad/institución"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {/* Reemplazo de styles.error */}
        {errors.institution && (
          <Text className="text-red-500 mb-2">{errors.institution.message}</Text>
        )}

        {/* Título/Grado */}
        <Text className="text-sm text-gray-700 mb-1">Título/Grado *</Text>
        <Controller
          control={control}
          name="degree"
          rules={{ required: "El título es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3 bg-white text-base"
              placeholder="Ej: Licenciatura, Maestría"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.degree && (
          <Text className="text-red-500 mb-2">{errors.degree.message}</Text>
        )}

        {/* Área de Estudio */}
        <Text className="text-sm text-gray-700 mb-1">Área de Estudio</Text>
        <Controller
          control={control}
          name="field"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3 bg-white text-base"
              placeholder="Ej: Ingeniería en Sistemas"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {/* Año de Graduación */}
        <Text className="text-sm text-gray-700 mb-1">Año de Graduación</Text>
        <Controller
          control={control}
          name="graduationYear"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3 bg-white text-base"
              placeholder="Ej: 2023"
              keyboardType="numeric"
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
            Agregar Educación
          </Text>
        </TouchableOpacity>

        {cvData.education.length > 0 && (
          <>
            {/* Reemplazo de styles.listTitle */}
            <Text className="text-xl font-semibold mt-6 mb-3 text-gray-800">
              Educación Agregada
            </Text>
            {cvData.education.map((edu) => (
              // Reemplazo de styles.card
              <View
                key={edu.id}
                className="bg-white rounded-lg p-4 mb-3 flex-row shadow-sm"
              >
                {/* Reemplazo de styles.cardContent */}
                <View className="flex-1">
                  {/* Reemplazo de styles.cardTitle */}
                  <Text className="text-base font-semibold mb-1 text-gray-800">
                    {edu.degree}
                  </Text>
                  {/* Reemplazo de styles.cardSubtitle */}
                  <Text className="text-sm mb-1 text-gray-500">{edu.field}</Text>
                  {/* Reemplazo de styles.cardInstitution */}
                  <Text className="text-sm mb-0.5 text-gray-400">
                    {edu.institution}
                  </Text>
                  {/* Reemplazo de styles.cardDate */}
                  <Text className="text-xs text-gray-400">
                    {edu.graduationYear}
                  </Text>
                </View>
                {/* Reemplazo de styles.deleteButton */}
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-red-600 justify-center items-center"
                  onPress={() => handleDelete(edu.id)}
                >
                  {/* Reemplazo de styles.deleteButtonText */}
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
      </View>
    </ScrollView>
  );
}

