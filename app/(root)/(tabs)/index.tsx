import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card, FeaturedCard } from "@/components/Cards";
import { Filters } from "@/components/Filters";

export default function Index() {
    return (
        <SafeAreaView className="bg-white h-full" style={{ flex: 1 }}>
            <FlatList
                style={{ flex: 1 }}
                data={[1, 2, 3]}
                renderItem={({ item }) => <Card />}
                keyExtractor={(item) => item.toString()}
                numColumns={2}
                contentContainerClassName='pb-32'
                showsVerticalScrollIndicator={false}
                columnWrapperClassName='flex gap-5 px-5'
                ListHeaderComponent={             <View className="px-5">
                    <View className="flex flex-row items-center justify-between mt-5">
                        <View className="flex flex-row items-center">
                            <Image source={images.avatar} className="size-12 rounded-full" />
                            <View className="flex flex-col items-start ml-2 justify-center">
                                <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                                <Text className="text-base font-rubik-medium text-black-300">Maliek Borwin</Text>
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
                            data={[1,2,3]}
                            renderItem={({item}) => {
                                return <FeaturedCard />
                            }}
                            keyExtractor={(item) => item.toString()}
                            horizontal
                            />
                        <View className="flex flex-row gap-5 mt-5">
                        </View>
                    </View>
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
                        <TouchableOpacity>
                            <Text className="text-base text-primary-300">See all</Text>
                        </TouchableOpacity>
                    </View>
                    <Filters />
                    <View className="flex flex-row gap-5 mt-5">
                    </View>
                </View>}
            />

        </SafeAreaView>
    );
}