const API_BASE_URL = 'http://localhost/backend/api';

export const API_ENDPOINTS = {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    profile: `${API_BASE_URL}/user/profile`,
};

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchApi = async (endpoint, options = {}) => {
    let retries = 0;

    const handleNetworkError = async (error) => {
        if (retries < MAX_RETRIES) {
            retries++;
            await wait(RETRY_DELAY * retries);
            return fetchApi(endpoint, options);
        }
        throw error;
    };

    try {
        if (!navigator.onLine) {
            window.dispatchEvent(new CustomEvent('api-error', { 
                detail: { message: 'No internet connection. Please check your network and try again.' }
            }));
            throw new Error('No internet connection. Please check your network and try again.');
        }

        const token = localStorage.getItem('token');
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

        const response = await fetch(endpoint, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));

        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error('Unable to parse server response. Please try again later.');
        }

        if (!response.ok) {
            const errorMessage = data.error || `Server error (${response.status}). Please try again later.`;
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }
            
            if (response.status >= 500) {
                return handleNetworkError(new Error(errorMessage));
            }
            
            window.dispatchEvent(new CustomEvent('api-error', { 
                detail: { message: errorMessage }
            }));
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        
        const errorMessage = error.name === 'AbortError'
            ? 'Request timeout. Please check your connection and try again.'
            : error.message === 'Failed to fetch'
            ? 'Unable to connect to the server. Please try again later.'
            : error.message;

        window.dispatchEvent(new CustomEvent('api-error', { 
            detail: { message: errorMessage }
        }));

        if (error.name === 'AbortError' || error.message === 'Failed to fetch') {
            return handleNetworkError(new Error(errorMessage));
        }
        
        throw error;
    }
};