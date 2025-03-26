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

interface GetPropertiesParams {
    filter?: string;    // For property type filtering
    query?: string;     // For search query
    limit?: number;     // For pagination
    offset?: number;    // For pagination
}

export async function getAllProperties(params: GetPropertiesParams = {}): Promise<Property[]> {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams();

        if (params.filter) {
            queryParams.append('propertyType', params.filter);
        }

        if (params.query) {
            queryParams.append('search', params.query);
        }

        if (params.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        if (params.offset) {
            queryParams.append('offset', params.offset.toString());
        }

        // Build URL with query parameters
        const baseUrl = 'http://192.168.1.229:8080/api/properties';
        const url = `${baseUrl}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

        console.log('Fetching properties from:', url); // Debug log

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
}

// Separate function for latest properties
export async function getLatestProperties(): Promise<Property[]> {
    try {
        const response = await fetch('http://192.168.1.229:8080/api/properties');
        if (!response.ok) {
            throw new Error('Failed to fetch latest properties');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching latest properties:', error);
        throw error;
    }
}

export async function uploadProperty(formData: any): Promise<Property[]> {
    try {
        const response = await fetch('http://192.168.1.229:8080/api/properties', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to create property');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching latest properties:', error);
        throw error;
    }
}

export async function getPropertyById(params: { id: number }): Promise<Property> {
    try {
        const response = await fetch(`http://192.168.1.229:8080/api/properties/${params.id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch property');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching property:', error);
        throw error;
    }
}

