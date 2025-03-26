import { Modal, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import icons from "@/constants/icons";

interface ImageViewerProps {
    visible: boolean;
    imageUri: string;
    onClose: () => void;
}

export default function ImageViewer({ visible, imageUri, onClose }: ImageViewerProps) {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
        >
            <View className="flex-1 bg-black/90 justify-center items-center">
                <TouchableOpacity
                    onPress={onClose}
                    className="absolute top-12 right-4 z-10"
                >
                    <Image
                        source={icons.carPark}
                        className="size-6 tint-white"
                    />
                </TouchableOpacity>

                <Image
                    source={{ uri: imageUri }}
                    style={{ width: screenWidth, height: screenHeight * 0.7 }}
                    resizeMode="contain"
                />
            </View>
        </Modal>
    );
}