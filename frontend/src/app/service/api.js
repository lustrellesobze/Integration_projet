import axios from 'axios';

/**
 * Configuration centralisée de l'API Laravel
 * Récupère l'URL depuis le fichier .env via le builder (Vite ou Webpack)
 */
const API_URL = import.meta.env?.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;