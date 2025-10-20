import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
// ❌ ELIMINADO: StyleSheet
import { CVData } from "../types/cv.types";

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview = ({ cvData }: CVPreviewProps) => {
  const { personalInfo, experiences, education, skills } = cvData;

  return (
    // MIGRACIÓN: styles.container
    <ScrollView className="flex-1 bg-white">
      {/* MIGRACIÓN: styles.content */}
      <View className="p-5">
        {/* MIGRACIÓN: styles.header */}
        <View className="flex-row mb-6 items-center border-b border-gray-200 pb-4">
          {personalInfo.profileImage && (
            <Image
              source={{ uri: personalInfo.profileImage }}
              // MIGRACIÓN: styles.profileImage
              className="w-24 h-24 rounded-full mr-4 border-2 border-blue-500"
            />
          )}
          {/* MIGRACIÓN: styles.headerText */}
          <View className="flex-1">
            {/* MIGRACIÓN: styles.name */}
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              {personalInfo.fullName || "Nombre"}
            </Text>
            {personalInfo.email && (
              // MIGRACIÓN: styles.contact
              <Text className="text-sm text-gray-600 mb-0.5">📧 {personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text className="text-sm text-gray-600 mb-0.5">📱 {personalInfo.phone}</Text>
            )}
            {personalInfo.location && (
              <Text className="text-sm text-gray-600 mb-0.5">📍 {personalInfo.location}</Text>
            )}
          </View>
        </View>

        {/* Resumen */}
        {personalInfo.summary && (
          // MIGRACIÓN: styles.section
          <View className="mb-6">
            {/* MIGRACIÓN: styles.sectionTitle */}
            <Text className="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">
              Resumen Profesional
            </Text>
            {/* MIGRACIÓN: styles.text */}
            <Text className="text-base text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </Text>
          </View>
        )}

        {/* Habilidades */}
        {skills.length > 0 && (
          // MIGRACIÓN: styles.section
          <View className="mb-6">
            {/* MIGRACIÓN: styles.sectionTitle */}
            <Text className="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">
              Habilidades
            </Text>
            <View className="flex-row flex-wrap">
              {skills.map((skill) => (
                // MIGRACIÓN: styles.skillItem
                <Text key={skill.id} className="text-sm text-gray-700 mr-4 mb-1">
                  • {skill.name} — **{skill.level}**
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Experiencia */}
        {experiences.length > 0 && (
          // MIGRACIÓN: styles.section
          <View className="mb-6">
            {/* MIGRACIÓN: styles.sectionTitle */}
            <Text className="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">
              Experiencia Laboral
            </Text>
            {experiences.map((exp) => (
              // MIGRACIÓN: styles.item
              <View key={exp.id} className="mb-4">
                {/* MIGRACIÓN: styles.itemTitle */}
                <Text className="text-lg font-semibold text-gray-800 mb-1">
                  {exp.position}
                </Text>
                {/* MIGRACIÓN: styles.itemSubtitle */}
                <Text className="text-base text-gray-600 mb-0.5">{exp.company}</Text>
                {/* MIGRACIÓN: styles.itemDate */}
                <Text className="text-xs text-gray-500 mb-1">
                  {exp.startDate} - {exp.endDate || "Actual"}
                </Text>
                {exp.description && (
                  // MIGRACIÓN: styles.itemDescription
                  <Text className="text-sm text-gray-700 leading-relaxed mt-1">
                    {exp.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Educación */}
        {education.length > 0 && (
          // MIGRACIÓN: styles.section
          <View className="mb-6">
            {/* MIGRACIÓN: styles.sectionTitle */}
            <Text className="text-xl font-bold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">
              Educación
            </Text>
            {education.map((edu) => (
              // MIGRACIÓN: styles.item
              <View key={edu.id} className="mb-4">
                {/* MIGRACIÓN: styles.itemTitle */}
                <Text className="text-lg font-semibold text-gray-800 mb-1">
                  {edu.degree}
                </Text>
                {edu.field && (
                  // MIGRACIÓN: styles.itemSubtitle
                  <Text className="text-base text-gray-600 mb-0.5">{edu.field}</Text>
                )}
                <Text className="text-base text-gray-600 mb-0.5">{edu.institution}</Text>
                {/* MIGRACIÓN: styles.itemDate */}
                <Text className="text-xs text-gray-500 mb-1">
                  {edu.graduationYear}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};