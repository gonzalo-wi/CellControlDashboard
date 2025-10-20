// Centralized API configuration. Allows overriding via Vite env.
// Create a .env.local with VITE_API_HOST=http://<ip>:<port> to change it.

export const API_HOST = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_HOST)
  ? import.meta.env.VITE_API_HOST
  : 'http://192.168.0.55:8082';

export function joinUrl(base, path) {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}
