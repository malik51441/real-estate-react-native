import ImageUploader from '@/components/ImageUploader';
import {Image, View} from "react-native";
import icons from "@/constants/icons";
import PropertyUploader from "@/components/PropertyUploader";

// In your existing dashboard component
export default function Dashboard() {
    const handleImageSelected = async (uri: string) => {
        try {
            // Create form data
            const formData = new FormData();
            formData.append('image', {
                uri,
                type: 'image/jpeg',
                name: 'upload.jpg',
            } as any);

            const response = await fetch('http://192.168.1.229:8080/api/properties/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            console.log('Upload successful:', data);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        }
    };

    return (
        <View className=" flex-1 justify-center align-middle">
            <PropertyUploader></PropertyUploader>
            <Image className={'size-5 right-3 color-black'} source={icons.bin}/>
        </View>
    );
}