import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import icons from '@/constants/icons';
import { facilities } from '@/constants/data';
import { useFetch } from '@/lib/useFetch';
import { getPropertyById, PropertyImage } from '@/lib/propertyService';

export default function PropertyDetails() {
    const { id } = useLocalSearchParams();
    const [showAllReviews, setShowAllReviews] = useState(false);

    const { data: property, loading } = useFetch({
        fn: getPropertyById,
        params: { id: Number(id) }
    });

    if (loading || !property) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerRight: () => (
                        <View className="flex-row gap-4 mr-4">
                            <TouchableOpacity>
                                <Image source={icons.heart} className="size-6 tint-white" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={icons.send} className="size-6 tint-white" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            {/* Hero Image */}
            <Image
                source={{ uri: property.images[0]?.mediumUrl }}
                style={{ width: Dimensions.get('window').width, height: 300 }}
                className="bg-gray-200"
            />

            {/* Content */}
            <View className="px-6 -mt-6 rounded-t-3xl bg-white">
                {/* Property Title & Stats */}
                <View className="pt-6">
                    <Text className="text-2xl font-rubik-bold">{property.title}</Text>
                    <View className="flex-row items-center mt-2">
                        <Image source={icons.star} className="size-4 mr-1" />
                        <Text className="font-rubik-medium">4.8</Text>
                        <Text className="text-gray-500"> (1,275 reviews)</Text>
                    </View>
                    <View className="flex-row items-center gap-4 mt-4">
                        <View className="flex-row items-center">
                            <Image source={icons.bed} className="size-5 mr-2" />
                            <Text className="font-rubik">{property.bedrooms} Beds</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Image source={icons.bath} className="size-5 mr-2" />
                            <Text className="font-rubik">{property.bathrooms} Bath</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Image source={icons.area} className="size-5 mr-2" />
                            <Text className="font-rubik">{property.areaSqMeters} m²</Text>
                        </View>
                    </View>
                </View>

                {/* Agent */}
                <View className="mt-6">
                    <Text className="text-lg font-rubik-bold mb-4">Agent</Text>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: "https://randomuser.me/api/portraits/women/1.jpg" }}
                                className="size-12 rounded-full mr-3"
                            />
                            <View>
                                <Text className="font-rubik-bold">Agent Name</Text>
                                <Text className="text-gray-500">Property Agent</Text>
                            </View>
                        </View>
                        <View className="flex-row gap-3">
                            <TouchableOpacity className="bg-primary-100 p-2 rounded-full">
                                <Image source={icons.chat} className="size-6" />
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-primary-100 p-2 rounded-full">
                                <Image source={icons.phone} className="size-6" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Overview */}
                <View className="mt-6">
                    <Text className="text-lg font-rubik-bold mb-2">Overview</Text>
                    <Text className="text-gray-600 leading-5">{property.description}</Text>
                </View>

                {/* Facilities */}
                <View className="mt-6">
                    <Text className="text-lg font-rubik-bold mb-4">Facilities</Text>
                    <View className="flex-row flex-wrap gap-4">
                        {facilities.map((facility, index) => (
                            <View key={index} className="items-center w-16">
                                <View className="bg-primary-100 p-3 rounded-full mb-1">
                                    <Image source={facility.icon} className="size-6" />
                                </View>
                                <Text className="text-xs text-center">{facility.title}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Gallery */}
                <View className="mt-6">
                    <Text className="text-lg font-rubik-bold mb-4">Gallery</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-3">
                            {property.images.map((image: PropertyImage, index: number) => (
                                <Image
                                    key={index}
                                    source={{ uri: image.mediumUrl }}
                                    className="w-32 h-32 rounded-lg"
                                />
                            ))}
                            <TouchableOpacity className="w-32 h-32 bg-gray-100 rounded-lg items-center justify-center">
                                <Text className="font-rubik-bold text-lg">
                                    {property.images.length}+
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

                {/* Location */}
                <View className="mt-6">
                    <Text className="text-lg font-rubik-bold mb-4">Location</Text>
                    <View className="flex-row items-center mb-4">
                        <Image source={icons.location} className="size-5 mr-2" />
                        <Text className="text-gray-600 flex-1">{property.location}</Text>
                    </View>
                    <View className="h-40 bg-gray-200 rounded-lg" />
                </View>

                {/* Reviews */}
                <View className="mt-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-rubik-bold">
                            4.8 (1,275 reviews)
                        </Text>
                        <TouchableOpacity onPress={() => setShowAllReviews(true)}>
                            <Text className="text-primary-300 font-rubik">See All</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Sample Review */}
                    <View className="p-4 bg-gray-50 rounded-lg">
                        <View className="flex-row items-center mb-2">
                            <Image
                                source={{ uri: "https://randomuser.me/api/portraits/women/2.jpg" }}
                                className="size-8 rounded-full mr-2"
                            />
                            <View>
                                <Text className="font-rubik-medium">Charlotte Hanlin</Text>
                                <Text className="text-xs text-gray-500">4 days ago</Text>
                            </View>
                        </View>
                        <Text className="text-gray-600">
                            The apartment is very clean and modern. I really like the interior design, but it felt a bit small 😊
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
} 