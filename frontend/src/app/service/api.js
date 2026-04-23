import axios from 'axios';

/**
 * Configuration centralisée de l'API Laravel
 */
const API_URL = "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;