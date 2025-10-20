import React from "react";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useCVContext } from "../context/CVContext";

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasPhoto = !!cvData.personalInfo.profileImage;
  const hasSkills = cvData.skills.length > 0;

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator
    >
      <Text className="text-2xl font-bold mb-5 text-center text-gray-800">
        Crea tu CV Profesional
      </Text>

      {/* Foto de Perfil */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800 mb-1">
              Foto de Perfil
            </Text>
            <Text className="text-green-600 text-sm">
              {hasPhoto ? "✓ Agregada" : "Opcional"}
            </Text>
          </View>
          {hasPhoto && cvData.personalInfo.profileImage && (
            <Image
              source={{ uri: cvData.personalInfo.profileImage }}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
          )}
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/photo")}
        >
          <Text className="text-white text-center font-semibold text-base">
            {hasPhoto ? "Cambiar Foto" : "Subir Foto"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Información Personal */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          1. Información Personal
        </Text>
        <Text className="text-green-600 text-sm mb-3">
          {isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/personal-info")}
        >
          <Text className="text-white text-center font-semibold text-base">
            Editar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Experiencia */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          2. Experiencia
        </Text>
        <Text className="text-green-600 text-sm mb-3">
          {hasExperience
            ? `✓ ${cvData.experiences.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/experience")}
        >
          <Text className="text-white text-center font-semibold text-base">
            Agregar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Educación */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          3. Educación
        </Text>
        <Text className="text-green-600 text-sm mb-3">
          {hasEducation
            ? `✓ ${cvData.education.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/education")}
        >
          <Text className="text-white text-center font-semibold text-base">
            Agregar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Habilidades */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          4. Habilidades
        </Text>
        <Text className="text-green-600 text-sm mb-3">
          {hasSkills ? `✓ ${cvData.skills.length} agregada(s)` : "Pendiente"}
        </Text>

        {hasSkills && (
          <View className="mt-2">
            {cvData.skills.map((skill) => (
              <Text key={skill.id} className="text-sm mb-1 text-gray-700">
                • {skill.name} — {skill.level}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mt-2"
          onPress={() => router.push("/skills")}
        >
          <Text className="text-white text-center font-semibold text-base">
            {hasSkills ? "Editar Habilidades" : "Agregar Habilidades"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vista Previa */}
      <View className="mt-6 mb-6">
        <TouchableOpacity
          className="bg-green-500 p-5 rounded-2xl items-center shadow-lg"
          onPress={() => router.push("/preview")}
          activeOpacity={0.8}
        >
          <Text className="text-3xl mb-2">👁️</Text>
          <Text className="text-white text-lg font-bold text-center">
            Ver Vista Previa del CV
          </Text>
        </TouchableOpacity>
      </View>

      <View className="h-5" />
    </ScrollView>
  );
}
