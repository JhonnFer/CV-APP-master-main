// app/preview.tsx
import React from "react";
import { View, ScrollView, StyleSheet, Button, Alert } from "react-native";
import { useCVContext } from "../context/CVContext";
import { CVPreview } from "../components/CVPreview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function PreviewScreen() {
  const { cvData } = useCVContext();

  // Generar HTML para PDF
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
      console.error(error);
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
      console.error(error);
      Alert.alert("Error", "No se pudo compartir el PDF.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CVPreview cvData={cvData} />
      <View style={styles.buttons}>
        <Button title="Generar PDF" onPress={exportToPdf} />
        <View style={{ height: 12 }} />
        <Button title="Compartir PDF" onPress={sharePdf} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  buttons: { padding: 16 },
});
