const BASE_URL = "https://cafe-fausse-p7er.onrender.com"
// "http://localhost:5000";

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