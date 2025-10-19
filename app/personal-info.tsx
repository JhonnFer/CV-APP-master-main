// app/personal-info.tsx
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useForm, Controller } from "react-hook-form";
import { PersonalInfo } from "../types/cv.types";

export default function PersonalInfoScreen() {
  const router = useRouter();
  
  // ✅ CAMBIO: De "updatePersonalInfo" a "setPersonalInfo"
  const { cvData, setPersonalInfo } = useCVContext();

  const { control, handleSubmit } = useForm<PersonalInfo>({
    defaultValues: cvData.personalInfo,
    mode: "onChange", // validación en tiempo real
  });

  // ✅ CAMBIO: Usar setPersonalInfo en lugar de updatePersonalInfo
  const onSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data);
    alert("Información guardada correctamente");
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        {/* Nombre Completo */}
        <Controller
          control={control}
          name="fullName"
          rules={{
            required: "El nombre es obligatorio",
            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label="Nombre Completo *"
              placeholder="Juan Pérez"
              value={value}
              onChangeText={onChange}
              error={error?.message}
            />
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: "El email es obligatorio",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Email inválido",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label="Email *"
              placeholder="juan@email.com"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error?.message}
            />
          )}
        />

        {/* Teléfono */}
        <Controller
          control={control}
          name="phone"
          rules={{
            pattern: {
              value: /^[0-9]*$/,
              message: "Solo se permiten números",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label="Teléfono"
              placeholder="+593 99 999 9999"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
              error={error?.message}
            />
          )}
        />

        {/* Ubicación */}
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Ubicación"
              placeholder="Quito, Ecuador"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {/* Resumen Profesional */}
        <Controller
          control={control}
          name="summary"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Resumen Profesional"
              placeholder="Describe brevemente tu perfil profesional..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
            />
          )}
        />

        <NavigationButton title="Guardar Información" onPress={handleSubmit(onSubmit)} />
        <NavigationButton title="Cancelar" onPress={() => router.back()} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#2c3e50" },
});