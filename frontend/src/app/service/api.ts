import axios, { InternalAxiosRequestConfig } from 'axios';

/**
 * Configuration de l'API avec fallback de sécurité
 */
const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://sobze.cdwfs.net/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Intercepteur pour le débogage
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Utilisation de l'opérateur de coalescence nulle (??) pour garantir une valeur texte
    const base = config.baseURL ?? '';
    const path = config.url ?? '';
    
    console.log('Appel API vers :', base + path);
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;