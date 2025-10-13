// app/education.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
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

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
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
      { text: "Eliminar", style: "destructive", onPress: () => deleteEducation(id) },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        <Text style={styles.label}>Institución *</Text>
        <Controller
          control={control}
          name="institution"
          rules={{ required: "La institución es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Nombre de la universidad/institución"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.institution && <Text style={styles.error}>{errors.institution.message}</Text>}

        <Text style={styles.label}>Título/Grado *</Text>
        <Controller
          control={control}
          name="degree"
          rules={{ required: "El título es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ej: Licenciatura, Maestría"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.degree && <Text style={styles.error}>{errors.degree.message}</Text>}

        <Text style={styles.label}>Área de Estudio</Text>
        <Controller
          control={control}
          name="field"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ej: Ingeniería en Sistemas"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={styles.label}>Año de Graduación</Text>
        <Controller
          control={control}
          name="graduationYear"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Ej: 2023"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <View style={{ marginVertical: 12 }}>
          <Button title="Agregar Educación" onPress={handleSubmit(onSubmit)} color="#3498db" />
        </View>

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(edu.id)}>
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <View style={{ marginTop: 16 }}>
          <Button title="Volver" onPress={() => router.back()} color="#7f8c8d" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#2c3e50" },
  label: { fontSize: 14, color: "#34495e", marginBottom: 4 },
  listTitle: { fontSize: 18, fontWeight: "600", marginTop: 24, marginBottom: 12, color: "#2c3e50" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4, color: "#2c3e50" },
  cardSubtitle: { fontSize: 14, marginBottom: 4, color: "#7f8c8d" },
  cardInstitution: { fontSize: 14, marginBottom: 2, color: "#95a5a6" },
  cardDate: { fontSize: 12, color: "#95a5a6" },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderColor: "#dcdcdc",
    fontSize: 14,
  },
  error: { color: "red", marginBottom: 8 },
});
