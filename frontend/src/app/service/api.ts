import axios, { InternalAxiosRequestConfig } from 'axios';

/**
 * DETECTION DYNAMIQUE DE L'URL
 * On vérifie si l'application tourne sur 'localhost' ou sur le domaine de production.
 */
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Cette URL sera utilisée si aucune variable d'environnement n'est trouvée
const FALLBACK_URL = isLocalhost 
    ? 'http://localhost:8000/api' 
    : 'https://sobze.cdwfs.net/api';

// On tente de récupérer la variable Vite, sinon on utilise le FALLBACK
const API_URL = (import.meta as any).env?.VITE_API_URL || FALLBACK_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

/**
 * Intercepteur de requête
 * Utile pour le debug et pour injecter le token d'authentification si nécessaire
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const base = config.baseURL ?? '';
        const path = config.url ?? '';
        
        // Affichage stylisé dans la console pour faciliter le debug en production
        console.log(`%c [API CALL] %c ${base}${path}`, 'color: white; background: #2196F3; font-weight: bold;', 'color: #2196F3;');

        // Si tu as un token dans le localStorage, tu peux l'ajouter ici automatiquement
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;