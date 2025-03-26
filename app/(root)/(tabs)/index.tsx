import {ActivityIndicator, Button, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {Link, router, useLocalSearchParams} from "expo-router";
import images from "@/constants/defaultImages";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card, FeaturedCard } from "@/components/Cards";
import { Filters } from "@/components/Filters";
import {useGlobalContext} from "@/lib/global-provider";
import {getAllProperties, getLatestProperties, Property} from "@/lib/propertyService";
import { useState, useEffect } from "react";
import NoResults from "@/components/noResults";
import {useFetch} from "@/lib/useFetch";

export default function Index() {
    const {user} = useGlobalContext();
    const params = useLocalSearchParams<{ query?: string; filter?: string }>();

    const { data: featuredProperties, loading: featuredPropertiesLoading } =
        useFetch({
            fn: getLatestProperties,
        });

    const {
        data: properties,
        refetch,
        loading,
    } = useFetch({
        fn: getAllProperties,
        params: {
            filter: params.filter!,
            query: params.query!,
            limit: 6,
        },
        skip: true,
    });

    useEffect(() => {
        refetch({
            filter: params.filter!,
            query: params.query!,
            limit: 6,
        });
    }, [params.filter, params.query]);

    const handleCardPress = (id: number) => router.push(`/properties/${id}`);

    return (
        <SafeAreaView className="bg-white h-full" style={{ flex: 1 }}>
            <FlatList
                style={{ flex: 1 }}
                data={properties}
                renderItem={({ item }) => (
                    <Card
                        item={item}
                        onPress={() => handleCardPress(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerClassName='pb-32'
                showsVerticalScrollIndicator={false}
                columnWrapperClassName='flex gap-5 px-5'
                ListEmptyComponent={
                        loading ? (
                        <ActivityIndicator size='large' className='text-primary-300'/>
                        ) : (<NoResults/>)
            }
                ListHeaderComponent={
                    <View className="px-5">
                        <View className="flex flex-row items-center justify-between mt-5">
                            <View className="flex flex-row items-center">
                                <Image source={{uri: user?.avatar}} className="size-12 rounded-full" />
                                <View className="flex flex-col items-start ml-2 justify-center">
                                    <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                                    <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                                </View>
                            </View>
                            <Image source={icons.bell} className="size-6" />
                        </View>
                        <Search />
                        <View className="my-5">
                            <View className="flex flex-row items-center justify-between">
                                <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                                <TouchableOpacity>
                                    <Text className="text-base text-primary-300">See all</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={featuredProperties}
                                renderItem={({item}) => (
                                    <FeaturedCard
                                        item= {item}
                                        onPress={() => handleCardPress(item.id)}
                                    />
                                )}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                bounces={false}
                                contentContainerClassName='flex gap-5 mt-5'
                            />
                        </View>
                        <View className="flex flex-row items-center justify-between">
                            <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
                            <TouchableOpacity>
                                <Text className="text-base text-primary-300">See all</Text>
                            </TouchableOpacity>
                        </View>
                        <Filters />
                    </View>
                }
            />
        </SafeAreaView>
    );
}