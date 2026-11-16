import axios from 'axios';

// Cliente HTTP único da aplicação, apontando para o endereço da API definido no .env
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
