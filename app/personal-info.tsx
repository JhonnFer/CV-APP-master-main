// app/personal-info.tsx (VERSIÓN MIGRADA)
import React from "react";
import { 
    View, 
    ScrollView, 
    Text, 
    // ❌ ELIMINADO: StyleSheet 
} from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";
// NOTA: Se asume que InputField y NavigationButton serán migrados en pasos posteriores.
import { InputField } from "../components/InputField"; 
import { NavigationButton } from "../components/NavigationButton";
import { useForm, Controller } from "react-hook-form";
import { PersonalInfo } from "../types/cv.types";

export default function PersonalInfoScreen() {
  const router = useRouter();

  const { cvData, setPersonalInfo } = useCVContext();

  const { control, handleSubmit } = useForm<PersonalInfo>({
    defaultValues: cvData.personalInfo,
    mode: "onChange",
  });

  const onSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data);
    alert("Información guardada correctamente");
    router.back();
  };

  return (
    // ⬅️ MIGRACIÓN: styles.container
    <ScrollView className="flex-1 bg-gray-100"> 
      {/* ⬅️ MIGRACIÓN: styles.content */}
      <View className="p-5">
        {/* ⬅️ MIGRACIÓN: styles.sectionTitle */}
        <Text className="text-2xl font-bold mb-4 text-gray-800">
          Información Personal
        </Text>

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
              // ⚠️ ESTILO INLINE ACEPTADO TEMPORALMENTE hasta migrar InputField.tsx
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

// ❌ ELIMINADO: const styles = StyleSheet.create({...});