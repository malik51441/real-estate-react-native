import {composeNode} from "yaml/dist/compose/compose-node";

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

export async function getAllProperties(): Promise<Property[]> {
    try {
        const response = await fetch('http://192.168.1.229:8080/api/properties');
        if (!response.ok) {
            throw new Error('Failed to fetch properties');
        }
        const data: Property[] = await response.json();
        console.log('Fetched properties:', data);

        // Iterate over each property and log the mediumUrl of each image
        data.forEach((property) => {
            if (property.images && Array.isArray(property.images)) {
                const mediumUrls = property.images.map((image) => image.mediumUrl);
                console.log(`Property ${property.id} medium URLs:`, mediumUrls);
            } else {
                console.log(`Property ${property.id} has no images or images is not an array`);
            }
        });

        return data;
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
}
