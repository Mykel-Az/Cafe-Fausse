const BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    return response;
}