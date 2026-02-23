import { apiFetch } from "./api";

function handleResponse(response, data) {
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export async function checkCustomer(email) {
  const response = await apiFetch("/customers/check", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  return handleResponse(response, data);
}

export async function getCustomerReservations(customerId) {
  const response = await apiFetch(`/customers/${customerId}/reservations`);
  const data = await response.json();
  return handleResponse(response, data);
}

export async function createCustomer(name, email, phone) {
  const response = await apiFetch("/customers/create", {
    method: "POST",
    body: JSON.stringify({ name, email, phone }),
  });

  const data = await response.json();
  return handleResponse(response, data);
}

export async function updateCustomer(id, name, phone) {
  const response = await apiFetch(`/customers/${id}/update`, {
    method: "PUT",
    body: JSON.stringify({ name, phone }),
  });

  const data = await response.json();
  return handleResponse(response, data);
}

export async function createReservation(customerId, date, time, guestCount) {
  const response = await apiFetch("/reservations/create", {
    method: "POST",
    body: JSON.stringify({
      customer_id: customerId,
      date,
      time,
      guest_count: guestCount,
    }),
  });

  const data = await response.json();
  return handleResponse(response, data);
}

export async function getAvailability(date) {
  const response = await apiFetch(`/availability?date=${date}`);
  const data = await response.json();
  return handleResponse(response, data);
}

export async function getReservationById(id) {
  const response = await apiFetch(`/reservations/${id}`);
  const data = await response.json();
  return handleResponse(response, data);
}

export async function cancelReservationById(id) {
  const response = await apiFetch(`/reservations/${id}/cancel`, {
    method: "DELETE",
  });

  const data = await response.json();
  return handleResponse(response, data);
}

export async function updateReservation(id, date, time, guestCount) {
    const response = await apiFetch(`/reservations/${id}/update`, {
        method: "PUT",
        body: JSON.stringify({
            date,
            time,
            guest_count: guestCount
        })
    });

    const data = await response.json();
    return handleResponse(response, data);
}