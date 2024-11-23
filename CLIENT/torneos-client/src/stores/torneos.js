import { defineStore } from 'pinia';
import apiClient from '../api/axios';

export const useTorneosStore = defineStore('torneos', {
  state: () => ({
    torneos: [], // Lista de torneos
    errorMessage: null, // Para almacenar mensajes de error
    successMessage: null, // Para almacenar mensajes de éxito
    participantes: [], // Lista de participantes de un torneo seleccionado
  }),
  actions: {
    async fetchTorneos() {
      try {
        const response = await apiClient.get('/torneos/ver', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.torneos = response.data;
        this.errorMessage = null; // Limpiar mensaje de error
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Error al obtener torneos';
        console.error('Error fetching torneos:', this.errorMessage);
      }
    },
    async createTorneo(data) {
      try {
        const response = await apiClient.post('/torneos/crear', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.torneos.push(response.data);
        this.successMessage = 'Torneo creado exitosamente'; // Mensaje de éxito
        this.errorMessage = null; // Limpiar mensaje de error
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Error al crear torneo';
        console.error('Error creating torneo:', this.errorMessage);
      }
    },
    async deleteTorneo(torneoId) {
      try {
        const response = await fetch(`http://localhost:3000/api/torneos/eliminar?torneoId=${torneoId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token para autenticación
          },
        });
    
        if (!response.ok) {
          throw new Error("Error al eliminar el torneo");
        }
        
        console.log("Torneo eliminado con éxito");
        this.fetchTorneos(); // Refrescar la lista de torneos
      } catch (error) {
        console.error(error.message);
      }
    },
    async updateTorneo(torneoId, data) {
      try {
        const response = await fetch(`http://localhost:3000/api/torneos/actualizar/${torneoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...data,
            fecha: data.fecha ? new Date(data.fecha).toISOString() : undefined, // Formatear la fecha
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al actualizar el torneo");
        }
    
        const result = await response.json();
        console.log("Torneo actualizado con éxito:", result.torneo);
    
        this.torneos = this.torneos.map((torneo) =>
          torneo.id === torneoId ? result.torneo : torneo
        );
    
        return result.torneo;
      } catch (error) {
        console.error("Error al actualizar el torneo:", error.message);
        throw error;
      }
    },    
    async listarParticipantes(torneoId) {
      try {
        const response = await apiClient.get('/torneos/participacion', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { torneoId }, // Pasar torneoId como parámetro
        });
        this.participantes = response.data; // Guardar la lista de participantes en el estado
        this.errorMessage = null; // Limpiar mensaje de error
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Error al obtener participantes';
        console.error('Error fetching participantes:', this.errorMessage);
      }
    },
    limpiarParticipantes() {
      // Método adicional para limpiar la lista de participantes
      this.participantes = [];
    },
  },
});
