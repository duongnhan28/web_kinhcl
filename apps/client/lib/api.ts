import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000' : '');

export const apiClient = axios.create({
    baseURL: baseURL ? `${baseURL}/api` : '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 && 
            !originalRequest._retry && 
            originalRequest.url !== '/auth/login' && 
            originalRequest.url !== '/auth/refresh'
        ) {
            originalRequest._retry = true;
            try {
                const currentBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 
                    (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000' : '');
                const response = await axios.post(`${currentBaseURL}/api/auth/refresh`, {}, { withCredentials: true });
                const newAccessToken = response.data.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                if (typeof window !== 'undefined') {
                    window.location.href = '/admin/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export async function fetchPublicProducts(query = '') {
    const url = baseURL ? `${baseURL}/api/products${query}` : `/api/products${query}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
}

export async function fetchProductBySlug(slug: string) {
    const url = baseURL ? `${baseURL}/api/products/${slug}` : `/api/products/${slug}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
}

export async function fetchCategories() {
    const url = baseURL ? `${baseURL}/api/categories` : `/api/categories`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
}

export async function loginAdmin(username: string, password: string) {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data.data;
}

export async function refreshAccessToken() {
    const response = await apiClient.post('/auth/refresh');
    return response.data.data;
}

export function setApiToken(token: string | null) {
    if (token) {
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.Authorization;
    }
}