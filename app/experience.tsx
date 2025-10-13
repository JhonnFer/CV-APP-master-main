// app/experience.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <Text>Empresa *</Text>
        <Controller
          control={control}
          name="company"
          rules={{ required: "La empresa es obligatoria" }}
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} placeholder="Nombre de la empresa" value={value} onChangeText={onChange} />
          )}
        />
        {errors.company && <Text style={styles.error}>{errors.company.message}</Text>}

        <Text>Cargo *</Text>
        <Controller
          control={control}
          name="position"
          rules={{ required: "El cargo es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} placeholder="Tu posición" value={value} onChangeText={onChange} />
          )}
        />
        {errors.position && <Text style={styles.error}>{errors.position.message}</Text>}

        <Text>Fecha de Inicio *</Text>
        <Controller
          control={control}
          name="startDate"
          rules={{ required: "La fecha de inicio es obligatoria" }}
          render={({ field: { value } }) => (
            <TouchableOpacity style={styles.dateInput} onPress={() => showDatePicker("startDate")}>
              <Text style={{ flex: 1 }}>{value || "Selecciona fecha"}</Text>
              <Feather name="calendar" size={20} color="#3498db" />
            </TouchableOpacity>
          )}
        />
        {errors.startDate && <Text style={styles.error}>{errors.startDate.message}</Text>}

        <Text>Fecha de Fin</Text>
        <Controller
          control={control}
          name="endDate"
          render={({ field: { value } }) => (
            <TouchableOpacity style={styles.dateInput} onPress={() => showDatePicker("endDate")}>
              <Text style={{ flex: 1 }}>{value || "Selecciona fecha"}</Text>
              <Feather name="calendar" size={20} color="#3498db" />
            </TouchableOpacity>
          )}
        />

        <Text>Descripción</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              placeholder="Describe tus responsabilidades..."
              multiline
              numberOfLines={4}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Button title="Agregar Experiencia" onPress={handleSubmit(onSubmit)} color="#3498db" />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(exp.id)}>
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <Button title="Volver" onPress={() => router.back()} color="#7f8c8d" />

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#2c3e50" },
  listTitle: { fontSize: 18, fontWeight: "600", marginTop: 24, marginBottom: 12, color: "#2c3e50" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 16, marginBottom: 12, flexDirection: "row", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardSubtitle: { fontSize: 14, marginBottom: 4 },
  cardDate: { fontSize: 12, color: "#95a5a6" },
  deleteButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e74c3c", justifyContent: "center", alignItems: "center" },
  deleteButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12, borderColor: "#ccc", backgroundColor: "#fff" },
  dateInput: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12, borderColor: "#ccc", backgroundColor: "#fff" },
  error: { color: "red", marginBottom: 8 },
});
