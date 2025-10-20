// components/PhotoPicker.tsx
import React from 'react';
import { View, Button, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = { uri?: string; onChange: (uri?: string) => void };

export default function PhotoPicker({ uri, onChange }: Props) {
  async function pick() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });
    if (!res.canceled) {
      const asset = res.assets?.[0];
      if (asset) onChange(asset.uri);
    }
  }

  async function take() {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!res.canceled) {
      const asset = res.assets?.[0];
      if (asset) onChange(asset.uri);
    }
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {uri ? (
        <TouchableOpacity onPress={() => onChange(undefined)}>
          <Image source={{ uri }} style={{ width: 84, height: 84, borderRadius: 8 }} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 84, height: 84, borderRadius: 8, backgroundColor: '#f3f4f6' }} />
      )}
      <View style={{ width: 8 }} />
      <View style={{ justifyContent: 'space-between', height: 84 }}>
        <Button title="Elegir" onPress={pick} />
        <Button title="Tomar" onPress={take} />
      </View>
    </View>
  );
}
