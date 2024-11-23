import { defineStore } from 'pinia';
import apiClient from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    role: null,
    errorMessage: null,
  }),
  actions: {
    async login(credentials) {
      try {
        await apiClient.post('/auth/login', credentials).then((res)=>{
          this.token = res.data.token;
          this.role = res.data.tipo;
          // Almacenar el tipo de usuario
          localStorage.setItem('token', this.token);
          localStorage.setItem('role', this.role);
          this.errorMessage = null; // Limpiar mensaje de error
          console.log("ya termine")
        })
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Login failed';
        console.error('Login failed', error);
      }
    },
    logout() {
      this.token = null;
      this.role = null;
      localStorage.removeItem('token');
    },
    async fetchUserRole() {
      try {
        const response = await apiClient.get('/auth/me', {
          Authorization: `Bearer ${this.token}`,
        });
        this.role = response.data.tipo; // Asegúrate de que la API devuelva el rol
      } catch (error) {
        console.error('Failed to fetch user role', error);
      }
    },
    async register(userData) {
      try {
        const response = await apiClient.post('/auth/registro', userData);
        // Manejar la respuesta según sea necesario
      } catch (error) {
        console.error('Registration failed', error);
      }
    },
  },
});