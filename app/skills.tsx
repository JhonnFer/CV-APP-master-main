// app/skills.tsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Agregar Habilidad</Text>

      <Text>Nombre de la habilidad</Text>
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
            style={{
              borderWidth: 1,
              borderRadius: 6,
              padding: 8,
              marginBottom: 4,
            }}
          />
        )}
      />
      {errors.name && <Text style={{ color: "red" }}>{errors.name.message}</Text>}

      <Text style={{ marginTop: 8 }}>Nivel</Text>
      <Controller
        control={control}
        name="level"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: "row", gap: 8, marginVertical: 8 }}>
            {LEVELS.map((lvl) => (
              <TouchableOpacity
                key={lvl}
                onPress={() => onChange(lvl)}
                style={{
                  padding: 8,
                  borderWidth: 1,
                  borderRadius: 6,
                  backgroundColor: value === lvl ? "#ddd" : "transparent",
                }}
              >
                <Text>{lvl}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      <Button title="Agregar" onPress={handleSubmit(onSubmit)} />

      <Text style={{ fontSize: 18, marginVertical: 12 }}>Habilidades agregadas</Text>
      <FlatList
        data={cvData.skills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 8,
              borderBottomWidth: 1,
            }}
          >
            <View>
              <Text style={{ fontWeight: "600" }}>{item.name}</Text>
              <Text>{item.level}</Text>
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
              <Text style={{ color: "red" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No hay habilidades aún.</Text>}
      />
    </View>
  );
}
