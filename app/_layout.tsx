// app/_layout.tsx
import "../global.css";

import { Stack } from "expo-router";
import { CVProvider } from "../context/CVContext";

export default function RootLayout() {
  return (
    <CVProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3498db",
          },
          headerTintColor: "#f8e4e4ff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        
        <Stack.Screen
          name="index"
          options={{
            title: "Crear CV",
            headerShown: true,
          }}
        />
        
        <Stack.Screen
          name="photo"
          options={{
            title: "Foto de Perfil",
          }}
        />
        
        <Stack.Screen
          name="personal-info"
          options={{
            title: "Información Personal",
          }}
        />
        <Stack.Screen
          name="experience"
          options={{
            title: "Experiencia Laboral",
          }}
        />
        <Stack.Screen
          name="education"
          options={{
            title: "Educación",
          }}
        />
        <Stack.Screen
          name="preview"
          options={{
            title: "Vista Previa",
            presentation: "modal",
          }}
        />
      </Stack>
    </CVProvider>
  );
}