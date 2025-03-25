const DEV_API_URL = 'http://192.168.1.229:8080'; // Your local IP
const PROD_API_URL = 'https://your-production-api.com'; // Your production API

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL; 