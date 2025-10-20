import React from "react";
import {
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
  // ❌ ELIMINADO: StyleSheet y Button
} from "react-native";
import { useCVContext } from "../context/CVContext";
import { CVPreview } from "../components/CVPreview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function PreviewScreen() {
  const { cvData } = useCVContext();

  const makeHtml = () => {
    const skillsHtml = cvData.skills
      .map((s) => `<li>${s.name} — ${s.level}</li>`)
      .join("");

    const experiencesHtml = cvData.experiences
      .map(
        (e) =>
          `<li><b>${e.position}</b> en ${e.company} (${e.startDate} - ${e.endDate || "Actual"})<br/>${e.description || ""}</li>`
      )
      .join("");

    const educationHtml = cvData.education
      .map(
        (e) =>
          `<li><b>${e.degree}</b> en ${e.institution} (${e.graduationYear})<br/>Campo: ${e.field || ""}</li>`
      )
      .join("");

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
            body { font-family: Arial; padding: 20px; color: #111; }
            h1, h2 { color: #3498db; }
            ul { padding-left: 18px; }
            li { margin-bottom: 6px; }
            .section { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${cvData.personalInfo.fullName || "Nombre Apellido"}</h1>
          <div class="section">
            <h2>Contacto</h2>
            <p>Email: ${cvData.personalInfo.email || "-"}</p>
            <p>Teléfono: ${cvData.personalInfo.phone || "-"}</p>
            <p>Ubicación: ${cvData.personalInfo.location || "-"}</p>
          </div>
          <div class="section">
            <h2>Perfil</h2>
            <p>${cvData.personalInfo.summary || "-"}</p>
          </div>
          <div class="section">
            <h2>Habilidades</h2>
            <ul>${skillsHtml || "<li>No hay habilidades</li>"}</ul>
          </div>
          <div class="section">
            <h2>Experiencia</h2>
            <ul>${experiencesHtml || "<li>No hay experiencia</li>"}</ul>
          </div>
          <div class="section">
            <h2>Educación</h2>
            <ul>${educationHtml || "<li>No hay educación</li>"}</ul>
          </div>
        </body>
      </html>
    `;
  };

  const exportToPdf = async () => {
    try {
      const html = makeHtml();
      const { uri } = await Print.printToFileAsync({ html });
      Alert.alert("PDF generado", "El PDF se generó correctamente.");
      return uri;
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

  const sharePdf = async () => {
    try {
      const uri = await exportToPdf();
      if (!uri) return;

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert(
          "Compartir no disponible",
          "El dispositivo no permite compartir archivos."
        );
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartir CV (PDF)",
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo compartir el PDF.");
    }
  };

  return (
    // MIGRACIÓN: styles.container
    <ScrollView className="flex-1 bg-white">
      <CVPreview cvData={cvData} />
      {/* MIGRACIÓN: styles.buttons */}
      <View className="p-4">
        {/* MIGRACIÓN: Button Generar PDF */}
        <TouchableOpacity
          onPress={exportToPdf}
          className="bg-blue-500 p-3 rounded-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-bold text-center">
            Generar PDF
          </Text>
        </TouchableOpacity>
        
        {/* MIGRACIÓN: View style={{ height: 12 }} */}
        <View className="h-3" />
        
        {/* MIGRACIÓN: Button Compartir PDF */}
        <TouchableOpacity
          onPress={sharePdf}
          className="bg-blue-500 p-3 rounded-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-bold text-center">
            Compartir PDF
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ❌ ELIMINADO EL OBJETO StyleSheet POR COMPLETO