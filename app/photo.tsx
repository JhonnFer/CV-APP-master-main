import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  // ❌ ELIMINADO: StyleSheet
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";

export default function PhotoScreen() {
  const router = useRouter();
  const { cvData, setPersonalInfo } = useCVContext();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    cvData.personalInfo.profileImage
  );

  const takePhoto = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!cameraPermission.granted) {
        Alert.alert(
          "Permiso Denegado",
          "Necesitamos acceso a tu cámara para tomar fotos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la cámara");
    }
  };

  const pickImage = async () => {
    try {
      const galleryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!galleryPermission.granted) {
        Alert.alert(
          "Permiso Denegado",
          "Necesitamos acceso a tu galería para seleccionar fotos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir la galería");
    }
  };

  const handleSave = () => {
    setPersonalInfo({
      ...cvData.personalInfo,
      profileImage: selectedImage,
    });
    Alert.alert("Éxito", "Foto guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleRemove = () => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar la foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setSelectedImage(undefined);
          setPersonalInfo({
            ...cvData.personalInfo,
            profileImage: undefined,
          });
        },
      },
    ]);
  };

  return (
    // Reemplazo de styles.container
    <View className="flex-1 p-5 bg-gray-100">
      {/* Reemplazo de styles.title */}
      <Text className="text-2xl font-bold text-gray-800 mb-5 text-center">
        Foto de Perfil
      </Text>

      {/* Reemplazo de styles.imageContainer */}
      <View className="items-center mb-8">
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            // Reemplazo de styles.image
            className="w-52 h-52 rounded-full border-[3px] border-blue-500"
          />
        ) : (
          // Reemplazo de styles.placeholder
          <View className="w-52 h-52 rounded-full bg-gray-300 justify-center items-center border-[3px] border-gray-400">
            {/* Reemplazo de styles.placeholderText */}
            <Text className="text-gray-500 text-base">Sin foto</Text>
          </View>
        )}
      </View>

      {/* Reemplazo de styles.buttonContainer */}
      <View className="mb-5">
        {/* Reemplazo de styles.actionButton */}
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-3 items-center" onPress={takePhoto}>
          {/* Reemplazo de styles.actionButtonText */}
          <Text className="text-white text-base font-semibold">
            📷 Tomar Foto
          </Text>
        </TouchableOpacity>

        {/* Reemplazo de styles.actionButton */}
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-3 items-center" onPress={pickImage}>
          {/* Reemplazo de styles.actionButtonText */}
          <Text className="text-white text-base font-semibold">
            🖼️ Seleccionar de Galería
          </Text>
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity
            // Reemplazo de [styles.actionButton, styles.removeButton]
            className="bg-red-600 p-4 rounded-lg mb-3 items-center"
            onPress={handleRemove}
          >
            {/* Reemplazo de styles.actionButtonText */}
            <Text className="text-white text-base font-semibold">
              🗑️ Eliminar Foto
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <NavigationButton title="Guardar" onPress={handleSave} />

      <NavigationButton
        title="Cancelar"
        onPress={() => router.back()}
        variant="secondary"
      />
    </View>
  );
}

// ❌ ELIMINADO EL OBJETO StyleSheet POR COMPLETO