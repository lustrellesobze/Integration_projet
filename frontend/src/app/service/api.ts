import axios, { InternalAxiosRequestConfig } from 'axios';

/**
 * LOGIQUE DE DÉTECTION DE L'ENVIRONNEMENT
 */
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// On définit l'URL de production en dur pour éviter tout problème de cache ou de .env manquant
const PROD_URL = 'https://sobze.cdwfs.net/api';
const DEV_URL = 'http://localhost:8000/api';

const FINAL_API_URL = isLocal ? DEV_URL : PROD_URL;

console.log(`%c [CONFIG] API configurée sur : ${FINAL_API_URL}`, 'color: #FF9800; font-weight: bold;');

const api = axios.create({
    baseURL: FINAL_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

/**
 * INTERCEPTEUR DE REQUÊTE
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Sécurité : On force la baseURL au cas où un service essaierait de la modifier
        config.baseURL = FINAL_API_URL;

        const fullUrl = `${config.baseURL}${config.url ?? ''}`;
        
        // Log pour confirmer l'URL appelée dans la console du navigateur
        console.log(`%c [SEND] %c ${fullUrl}`, 'color: white; background: #4CAF50; font-weight: bold;', 'color: #4CAF50;');

        // Injection automatique du token pour les requêtes authentifiées
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