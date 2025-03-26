import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import ImageUploader from './ImageUploader';
import icons from "@/constants/icons";
import {uploadProperty} from "@/lib/propertyService";
import { categories } from '@/constants/data';

interface PropertyForm {
    title: string;
    description: string;
    price: string;
    location: string;
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    areaSqMeters: string;
    referenceNumber: string;
    dealerId: string;
    isActive: boolean;
}

export default function PropertyUploader() {
    const [form, setForm] = useState<PropertyForm>({
        title: '',
        description: '',
        price: '',
        location: '',
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        areaSqMeters: '',
        referenceNumber: '',
        dealerId: '1', // You might want to get this from user context or auth
        isActive: true
    });
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageSelected = (uri: string) => {
        setImages([...images, uri]);
    };

    const handleImagePress = (uri: string) => {
        setSelectedImage(uri);
        setIsImageViewerVisible(true);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Check total size of images before uploading
            const totalSize = images.reduce((acc, uri) => {
                // Get file size from URI (this is a rough estimate)
                const size = uri.length * 2; // Approximate size in bytes
                return acc + size;
            }, 0);

            // If total size is greater than 10MB (10 * 1024 * 1024 bytes)
            if (totalSize > 10 * 1024 * 1024) {
                alert('Total image size exceeds 10MB. Please reduce the size of your images.');
                return;
            }

            const formData = new FormData();

            // Add property details
            Object.keys(form).forEach(key => {
                const value = form[key as keyof PropertyForm];
                if (typeof value === 'boolean') {
                    formData.append(key, value.toString());
                } else {
                    formData.append(key, value);
                }
            });

            // Add images
            images.forEach((uri, index) => {
                formData.append('images', {
                    uri,
                    type: 'image/jpeg',
                    name: `image-${index}.jpg`,
                } as any);
            });

            const result = await uploadProperty(formData);
            router.back();
        } catch (error: any) {
            console.error('Upload error:', error);
            if (error.message?.includes('Maximum upload size exceeded')) {
                alert('The total size of your images is too large. Please reduce the size of your images or upload fewer images.');
            } else {
                alert('Failed to create property. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTypeSelect = (type: string) => {
        setForm({ ...form, propertyType: type });
        setShowTypeSelector(false);
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="p-6 mt-6 pt-12">
                <Text className="text-2xl font-rubik-bold mb-6">Create New Property</Text>

                {/* Basic Details */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Reference Number</Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3 font-rubik"
                            value={form.referenceNumber}
                            onChangeText={(text) => setForm({ ...form, referenceNumber: text })}
                            placeholder="Enter reference number"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Title</Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3 font-rubik"
                            value={form.title}
                            onChangeText={(text) => setForm({ ...form, title: text })}
                            placeholder="Enter property title"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Description</Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3 font-rubik"
                            value={form.description}
                            onChangeText={(text) => setForm({ ...form, description: text })}
                            placeholder="Enter property description"
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Price</Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3 font-rubik"
                            value={form.price}
                            onChangeText={(text) => setForm({ ...form, price: text })}
                            placeholder="Enter price"
                            keyboardType="numeric"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Location</Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3 font-rubik"
                            value={form.location}
                            onChangeText={(text) => setForm({ ...form, location: text })}
                            placeholder="Enter location"
                        />
                    </View>

                    {/* Property Type Selection */}
                    <View className="flex-1">
                        <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Type</Text>
                        <TouchableOpacity
                            onPress={() => setShowTypeSelector(true)}
                            className="border border-gray-200 rounded-lg p-3 font-rubik flex-row justify-between items-center"
                        >
                            <Text className={form.propertyType ? "text-black" : "text-gray-400"}>
                                {form.propertyType || "Select property type"}
                            </Text>
                            <Image 
                                source={icons.backArrow} 
                                className="size-4 rotate-90"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Property Details */}
                    <View className="flex-row ">
                        <View className="flex-1">
                            <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Area (m²)</Text>
                            <TextInput
                                className="border border-gray-200 rounded-lg p-3 font-rubik"
                                value={form.areaSqMeters}
                                onChangeText={(text) => setForm({ ...form, areaSqMeters: text })}
                                placeholder="Area"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View className="flex-row space-x-4">
                        <View className="flex-1">
                            <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Bedrooms</Text>
                            <TextInput
                                className="border border-gray-200 rounded-lg p-3 font-rubik"
                                value={form.bedrooms}
                                onChangeText={(text) => setForm({ ...form, bedrooms: text })}
                                placeholder="Bedrooms"
                                keyboardType="numeric"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Bathrooms</Text>
                            <TextInput
                                className="border border-gray-200 rounded-lg p-3 font-rubik"
                                value={form.bathrooms}
                                onChangeText={(text) => setForm({ ...form, bathrooms: text })}
                                placeholder="Bathrooms"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                {/* Image Upload Section */}
                <View className="mt-6">
                    <Text className="text-sm font-rubik-medium text-gray-600 mb-1">Property Images</Text>
                    <ImageUploader onImageSelected={handleImageSelected} />

                    {/* Display uploaded images */}
                    {images.length > 0 && (
                        <View className="flex-row flex-wrap gap-2 mt-4">
                            {images.map((uri, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleImagePress(uri)}
                                >
                                    <Image
                                        source={{ uri }}
                                        className="w-20 h-20 rounded-lg"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    className={`bg-primary-300 rounded-lg py-4 mt-8 ${isSubmitting ? 'opacity-50' : ''}`}
                >
                    {isSubmitting ? (
                        <View className="flex-row items-center justify-center">
                            <ActivityIndicator color="white" className="mr-2" />
                            <Text className="text-white text-center font-rubik-bold">
                                Creating Property...
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-white  text-center font-rubik-bold">
                            Create Property
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Property Type Selector Modal */}
            <Modal
                visible={showTypeSelector}
                transparent={true}
                animationType="slide"
            >
                <View className="flex-1 bg-white">
                    <View className="flex-row items-center p-4 border-b border-gray-200">
                        <TouchableOpacity 
                            onPress={() => setShowTypeSelector(false)}
                            className="mr-4"
                        >
                            <Image 
                                source={icons.backArrow} 
                                className="size-6"
                            />
                        </TouchableOpacity>
                        <Text className="text-lg font-rubik-bold">Select Property Type</Text>
                    </View>
                    
                    <ScrollView className="flex-1">
                        {categories.map((item) => (
                            <TouchableOpacity
                                key={item.category}
                                onPress={() => handleTypeSelect(item.category)}
                                className={`p-4 border-b border-gray-100 ${
                                    form.propertyType === item.category ? 'bg-primary-50' : ''
                                }`}
                            >
                                <Text className={`font-rubik ${
                                    form.propertyType === item.category ? 'text-primary-300' : 'text-gray-800'
                                }`}>
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            <Modal
                visible={isImageViewerVisible}
                transparent={true}
                animationType="fade"
            >
                <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={() => setIsImageViewerVisible(false)}
                    className="flex-1 bg-black/90 justify-center items-center"
                >
                    <TouchableOpacity 
                        onPress={(e) => e.stopPropagation()}
                        className="relative"
                    >
                        <TouchableOpacity 
                            onPress={() => setIsImageViewerVisible(false)}
                            className="absolute -top-12 -right-12 z-10"
                        >
                            <Image 
                                source={icons.backArrow} 
                                className="size-6 tint-white"
                            />
                        </TouchableOpacity>
                        
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={{ 
                                    width: Dimensions.get('window').width, 
                                    height: Dimensions.get('window').height * 0.7 
                                }}
                                resizeMode="contain"
                            />
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
}