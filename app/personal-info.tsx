// app/personal-info.tsx
import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { useForm, Controller } from "react-hook-form";
import { PersonalInfo } from "../types/cv.types";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();

  const { control, handleSubmit, formState: { errors } } = useForm<PersonalInfo>({
    defaultValues: cvData.personalInfo,
  });

  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    alert("Información guardada correctamente");
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <Controller
          control={control}
          name="fullName"
          rules={{ required: "El nombre es obligatorio" }}
          render={({ field: { value, onChange } }) => (
            <>
              <InputField label="Nombre Completo *" placeholder="Juan Pérez" value={value} onChangeText={onChange} />
              {errors.fullName && <Text style={styles.error}>{errors.fullName.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "El email es obligatorio",
            pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
          }}
          render={({ field: { value, onChange } }) => (
            <>
              <InputField
                label="Email *"
                placeholder="juan@email.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </>
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <InputField label="Teléfono" placeholder="+593 99 999 9999" value={value} onChangeText={onChange} keyboardType="phone-pad" />
          )}
        />

        <Controller
          control={control}
          name="location"
          render={({ field: { value, onChange } }) => (
            <InputField label="Ubicación" placeholder="Quito, Ecuador" value={value} onChangeText={onChange} />
          )}
        />

        <Controller
          control={control}
          name="summary"
          render={({ field: { value, onChange } }) => (
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
  error: { color: "red", marginBottom: 8 },
});
