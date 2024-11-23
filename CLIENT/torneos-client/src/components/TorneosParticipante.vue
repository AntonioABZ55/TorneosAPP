<template>
  <div class="torneos-participante-container">
    <h2>Torneos Disponibles</h2>
    <div v-if="torneosDisponibles.length === 0">
      <p>No hay torneos disponibles para inscribirse.</p>
    </div>
    <ul v-else>
      <li v-for="torneo in torneosDisponibles" :key="torneo.id">
        <h3>{{ torneo.nombre }}</h3>
        <p>{{ torneo.ubicacion }}</p>
        <p>{{ torneo.fecha }}</p>

        <button @click="unirseATorneo(torneo.id)">Unirse</button>
        <button @click="salirDeTorneo(torneo.id)">Salir</button>
      </li>
    </ul>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import { useParticipantesStore } from '../stores/participantes';

export default {
  data() {
    return {
      participantes: [], // Lista de participantes de un torneo específico
      modalVisible: false, // Controla la visibilidad del modal
    };
  },
  computed: {
    torneosDisponibles() {
      return this.participantesStore.torneosDisponibles;
    },
    misTorneos() {
      return this.participantesStore.misTorneos;
    },
    errorMessage() {
      return this.participantesStore.errorMessage;
    },
    successMessage() {
      return this.participantesStore.successMessage;
    },
  },
  methods: {
    async unirseATorneo(torneoId) {
      await this.participantesStore.unirseATorneo(torneoId);
    },
    async salirDeTorneo(torneoId) {
      await this.participantesStore.salirDeTorneo(torneoId);
    },
    async mostrarParticipantes(torneoId) {
      this.participantes = await this.participantesStore.listarParticipantes(torneoId);
      this.modalVisible = true;
    },
    cerrarModal() {
      this.modalVisible = false;
    },
  },
  async created() {
    // Cargar torneos disponibles e inscritos al montar la vista
    await this.participantesStore.fetchTorneosDisponibles();
    await this.participantesStore.fetchMisTorneos();
  },
  setup() {
    const participantesStore = useParticipantesStore();
    return { participantesStore };
  },
};
</script>

<style scoped>
/* Contenedor principal */
.torneos-participante-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fffaf0;
  text-align: center;
}

/* Título */
.torneos-participante-container h2 {
  margin-bottom: 20px;
  color: #e67e22;
  font-size: 24px;
  font-weight: bold;
}

/* Lista de torneos */
.torneos-participante-container ul {
  list-style-type: none;
  padding: 0;
}

/* Elementos individuales de la lista */
.torneos-participante-container li {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e67e22;
  border-radius: 8px;
  background-color: #fff;
  text-align: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Encabezado del torneo */
.torneos-participante-container li h3 {
  margin: 0;
  color: #d35400;
  font-size: 18px;
  font-weight: bold;
}

/* Información adicional */
.torneos-participante-container li p {
  margin: 5px 0;
  color: #7f8c8d;
  font-size: 14px;
}

/* Botones */
.torneos-participante-container li button {
  padding: 8px 16px;
  margin-right: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Botón Unirse */
.torneos-participante-container li button:nth-child(1) {
  background-color: #e67e22;
  color: #fff;
}

.torneos-participante-container li button:nth-child(1):hover {
  background-color: #d35400;
}

/* Botón Salir */
.torneos-participante-container li button:nth-child(2) {
  background-color: #e74c3c;
  color: #fff;
}

.torneos-participante-container li button:nth-child(2):hover {
  background-color: #c0392b;
}

/* Mensajes de error y éxito */
.error {
  color: #e74c3c;
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}

.success {
  color: #27ae60;
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 50%;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-top: 0;
  color: #e67e22;
}

.modal-content button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #e67e22;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #d35400;
}

/* Responsivo */
@media (max-width: 480px) {
  .torneos-participante-container {
    padding: 15px;
  }
  .torneos-participante-container h2 {
    font-size: 20px;
  }
  .torneos-participante-container li {
    padding: 10px;
  }
  .modal-content {
    width: 80%;
  }
}
</style>

