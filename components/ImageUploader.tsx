import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import icons from "@/constants/icons";
// ... previous imports

interface ImageUploaderProps {
    onImageSelected: (uri: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            onImageSelected(result.assets[0].uri);
        }
    };

    return (
        <TouchableOpacity
            onPress={pickImage}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center"
        >
            <View className="items-center py-4">
                <Image
                    source={icons.search}
                    className="size-8 mb-2 tint-gray-400"
                />
                <Text className="text-gray-500 font-rubik">
                    Tap to add images
                </Text>
            </View>
        </TouchableOpacity>
    );
}