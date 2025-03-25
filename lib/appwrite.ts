import {Account, Avatars, Client, OAuthProvider} from "react-native-appwrite"
import * as Linking from 'expo-linking';
import {openAuthSessionAsync} from "expo-web-browser";
import { API_URL } from './config';


export const config = {
    platform: '.com.jsm.libya-real-estate-practice',
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,

}
export const client = new Client();
client
    .setEndpoint(config.endpoint!)
    .setProject('67d99cc9000451ed70bd')
    .setPlatform(config.platform!);


export const avatar = new Avatars(client)
export const account = new Account(client)

export async function login() {
    try {
        const redirectUri = Linking.createURL("/");

        const response = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri
        );
        if (!response) throw new Error("Create OAuth2 token failed");

        const browserResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        );
        if (browserResult.type !== "success")
            throw new Error("Create OAuth2 token failed");

        const url = new URL(browserResult.url);
        const secret = url.searchParams.get("secret")?.toString();
        const userId = url.searchParams.get("userId")?.toString();
        if (!secret || !userId) throw new Error("Create OAuth2 token failed");

        const session = await account.createSession(userId, secret);
        if (!session) throw new Error("Failed to create session");

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function logout() {
    try {
        const result = await account.deleteSession("current");
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCurrentUser() {
    try {
        const result = await account.get();
        if (result.$id) {
            const userAvatar = avatar.getInitials(result.name);
            return {
                ...result,
                avatar: userAvatar.toString(),
            };
        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export interface PropertyImage {
    id: number;
    propertyId: number;
    originalUrl: string;
    thumbnailUrl: string;
    mediumUrl: string;
    largeUrl: string;
    imageOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    areaSqMeters: number;
    dealerId: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    images: PropertyImage[];
    referenceNumber: string;
}

// @ts-ignore
export async function getAllProperties(): Promise<Property[]> {
    try {
        const response = await fetch(`${API_URL}/api/properties`);
        if (!response.ok) {
            throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        console.log('Fetched properties:', data);
        return data;
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
}




