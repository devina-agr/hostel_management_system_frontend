const rawApiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const API_BASE_URL = rawApiBase.replace(/\/$/, '');

export function buildApiUrl(path = '') {
  if (!path) {
    return API_BASE_URL;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function apiFetch(path, options = {}) {
  return fetch(buildApiUrl(path), options);
}