// Token lives in module memory — cleared on page refresh (intentional for staff portal).
let _token = null;

export function setToken(t)   { _token = t; }
export function getToken()    { return _token; }
export function clearToken()  { _token = null; }
export function isLoggedIn()  { return !!_token; }

const BASE = 'http://localhost:5000';

async function apiFetch(endpoint, options = {}) {
    return fetch(`${BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });
}

function authFetch(endpoint, options = {}) {
    return apiFetch(endpoint, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${_token}` },
    });
}

async function handleResponse(res) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Something went wrong');
    return data;
}

// Auth
export async function login(username, password) {
    const res = await apiFetch('/staff/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(res);
    setToken(data.access_token);
    return data;
}
export function logout() { clearToken(); }

// Dashboard
export async function getDashboard() {
    return handleResponse(await authFetch('/admin/dashboard'));
}

// Reservations — params: { date, status, checked_in, upcoming, search, page, per_page }
export async function getReservations(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.append(k, v);
    });
    return handleResponse(await authFetch(`/staff/reservations?${qs}`));
}

export async function checkIn(id) {
    return handleResponse(await authFetch(`/staff/reservations/${id}/check-in`, { method: 'POST' }));
}
export async function completeReservation(id) {
    return handleResponse(await authFetch(`/admin/reservations/${id}/complete`, { method: 'PATCH' }));
}
export async function forceCancel(id) {
    return handleResponse(await authFetch(`/staff/reservations/${id}/force-cancel`, { method: 'POST' }));
}
export async function markNoShow(id) {
    return handleResponse(await authFetch(`/staff/reservations/${id}/mark-no-show`, { method: 'POST' }));
}

// Customers
export async function getCustomers(filter = '') {
    const qs = filter ? `?filter=${filter}` : '';
    return handleResponse(await authFetch(`/admin/customers${qs}`));
}