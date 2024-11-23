import { defineStore } from 'pinia';
import apiClient from '../api/axios';

export const useParticipantesStore = defineStore('participantes', {
  state: () => ({
    torneosDisponibles: [],
    misTorneos: [],
    errorMessage: null,
    successMessage: null,
  }),
  actions: {
    async fetchTorneosDisponibles() {
      try {
        const response = await apiClient.get('/participacion/ver-disponibles', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.torneosDisponibles = response.data;
        this.errorMessage = null; // Limpiar mensaje de error
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Error al obtener torneos disponibles';
        console.error('Error fetching torneos disponibles:', this.errorMessage);
      }
    },
    
    async unirseATorneo(torneoId) {
      try {
        const response = await apiClient.post('/participacion/unirse', { torneoId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.successMessage = response.data.message; // Mensaje de éxito
        this.errorMessage = null; // Limpiar mensaje de error
        await this.fetchTorneosDisponibles(); // Actualizar la lista de torneos disponibles
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Error al unirse al torneo';
        console.error('Error joining torneo:', this.errorMessage);
      }
    },
    
    async salirDeTorneo(torneoId) {
      try {
        const response = await apiClient.delete('/participacion/salir', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          data: { torneoId },
        });
        this.successMessage = response.data.message; // Mensaje de éxito
        this.errorMessage = null; // Limpiar mensaje de error
        await this.fetchMisTorneos(); // Actualizar la lista de mis torneos
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Error al salir del torneo';
        console.error('Error leaving torneo:', this.errorMessage);
      }
    },

    async fetchMisTorneos() {
      try {
        const response = await apiClient.get('/participacion/mis-torneos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.misTorneos = response.data;
        this.errorMessage = null; // Limpiar mensaje de error
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Error al obtener mis torneos';
        console.error('Error fetching mis torneos:', this.errorMessage);
      }
    },
  },
});