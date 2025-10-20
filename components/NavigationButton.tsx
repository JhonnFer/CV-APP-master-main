import React from "react";
import { TouchableOpacity, Text, ViewStyle } from "react-native";
// ❌ ELIMINADO: StyleSheet

interface NavigationButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
}

export const NavigationButton = ({
  title,
  onPress,
  variant = "primary",
  style, // Mantenemos 'style' por si se requiere un estilo en línea de RN, aunque lo ideal es usar className
}: NavigationButtonProps) => {
  // Clases base compartidas por todos los botones
  const baseClasses =
    "p-4 rounded-lg items-center justify-center my-2";
  const baseTextClasses = "text-base font-semibold text-center";

  // Mapeo de variantes a clases de NativeWind
  const variantClasses = {
    primary: "bg-blue-600",
    secondary: "bg-transparent border-2 border-blue-600",
    danger: "bg-red-600",
  };

  // Mapeo de colores de texto basado en la variante
  const textVariantClasses = {
    primary: "text-white",
    secondary: "text-blue-600",
    danger: "text-white",
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]}`}
      onPress={onPress}
      activeOpacity={0.8}
      // Se pasa 'style' como un prop de estilo tradicional, manteniendo la compatibilidad si es necesaria
      style={style}
    >
      <Text className={`${baseTextClasses} ${textVariantClasses[variant]}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};