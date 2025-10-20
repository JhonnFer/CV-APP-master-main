import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
// ❌ ELIMINADO: StyleSheet

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const InputField = ({ label, error, ...props }: InputFieldProps) => {
  // Las clases base para el TextInput
  const baseInputClasses =
    "border border-gray-300 rounded-lg p-3 text-base bg-white";

  // Las clases para el estado de error
  const errorInputClasses = "border-red-600";
  const finalInputClasses = error
    ? `${baseInputClasses} ${errorInputClasses}`
    : baseInputClasses;

  return (
    // MIGRACIÓN: styles.container
    <View className="mb-4">
      {/* MIGRACIÓN: styles.label */}
      <Text className="text-base font-semibold text-gray-800 mb-2">
        {label}
      </Text>
      <TextInput
        className={finalInputClasses}
        placeholderTextColor="#999"
        // Aseguramos que la prop 'style' (si se usa para multiline) se aplique DE ÚLTIMAS
        // permitiendo que NativeWind maneje la mayoría del estilo.
        {...props}
      />
      {error && (
        // MIGRACIÓN: styles.errorText
        <Text className="text-red-600 text-xs mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};