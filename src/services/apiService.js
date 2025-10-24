// src/services/apiService.js

const apiService = async (endpoint, options = {}) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api${endpoint}`;
    const token = localStorage.getItem('authToken');

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Key': import.meta.env.VITE_FRONTEND_API_KEY,
        ...options.headers,
    };
    
    // Adaugă automat token-ul de autorizare dacă există
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }
    
    return response.json();
};

export default apiService;