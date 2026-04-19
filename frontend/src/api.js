const BASE = import.meta.env.VITE_API_URL ?? 'https://digital-library-k9ix.onrender.com';
export const apiUrl = (path) => `${BASE}${path}`;
export default BASE;