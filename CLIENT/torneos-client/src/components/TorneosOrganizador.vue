<template>
  <div class="torneos-organizador">
    <h2>Mis Torneos</h2>
    <button @click="openCreateModal">Crear Torneo</button>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

    <ul v-if="torneos.length">
      <li v-for="torneo in torneos" :key="torneo.id">
        <span>{{ torneo.nombre }}</span>
        <span>{{ torneo.ubicacion }}</span>
        <span>{{ torneo.fecha }}</span>
        <button @click="openUpdateModal(torneo)">Actualizar</button>
        <button @click="deleteTorneo(torneo.id)">Eliminar</button>
        <button @click="verParticipantes(torneo.id)">Ver Participantes</button>
      </li>
    </ul>

    <div v-if="participantes.length">
      <h3>Participantes</h3>
      <ul>
        <li v-for="participante in participantes" :key="participante.id">
          {{ participante.usuario.nombre }}
        </li>
      </ul>
      <button @click="limpiarParticipantes">Ocultar Participantes</button>
    </div>

    <!-- Modal -->
    <modal v-if="showModal" @close="closeModal">
      <template v-slot:header>
        <h3>{{ isEditing ? 'Actualizar Torneo' : 'Crear Torneo' }}</h3>
      </template>
      <template v-slot:body>
        <form @submit.prevent="handleSubmit">
          <label>
            Nombre:
            <input v-model="modalData.nombre" type="text" required />
          </label>
          <label>
            Fecha:
            <input v-model="modalData.fecha" type="date" required />
          </label>
          <label>
            Ubicación:
            <input v-model="modalData.ubicacion" type="text" required />
          </label>
          <button type="submit">{{ isEditing ? 'Actualizar' : 'Crear' }}</button>
        </form>
      </template>
    </modal>
  </div>
</template>

<script>
import { useTorneosStore } from "../stores/torneos";
import Modal from "./Modal.vue";

export default {
  components: { Modal },
  data() {
    return {
      showModal: false,
      isEditing: false,
      modalData: {
        id: null,
        nombre: "",
        fecha: "",
        ubicacion: ""
      }
    };
  },
  computed: {
    torneos() {
      return this.torneosStore.torneos;
    },
    participantes() {
      return this.torneosStore.participantes;
    },
    errorMessage() {
      return this.torneosStore.errorMessage;
    },
    successMessage() {
      return this.torneosStore.successMessage;
    }
  },
  methods: {
    openCreateModal() {
      this.isEditing = false;
      this.resetModalData();
      this.showModal = true;
    },
    openUpdateModal(torneo) {
      this.isEditing = true;
      const fechaFormateada = new Date(torneo.fecha).toISOString().split("T")[0];
      this.modalData = {
        ...torneo,
        fecha: fechaFormateada,
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.torneosStore.limpiarParticipantes(); // Limpiar participantes al cerrar
    },
    resetModalData() {
      this.modalData = {
        nombre: "",
        fecha: "",
        ubicacion: ""
      };
    },
    async handleSubmit() {
      if (this.isEditing) {
        await this.torneosStore.updateTorneo(this.modalData.id, this.modalData);
      } else {
        await this.torneosStore.createTorneo(this.modalData);
      }
      this.torneosStore.fetchTorneos(); // Refrescar la lista de torneos
      this.closeModal();
    },
    async deleteTorneo(torneoId) {
      await this.torneosStore.deleteTorneo(torneoId);
      this.torneosStore.fetchTorneos(); // Refrescar la lista
    },
    async verParticipantes(torneoId) {
      await this.torneosStore.listarParticipantes(torneoId);
    },
    limpiarParticipantes() {
      this.torneosStore.limpiarParticipantes();
    }
  },
  created() {
    this.torneosStore.fetchTorneos();
  },
  setup() {
    const torneosStore = useTorneosStore();
    return { torneosStore };
  }
};
</script>
<style scoped>
/* Contenedor principal */
.torneos-organizador {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fffaf0;
  text-align: center;
}

/* Título */
.torneos-organizador h2 {
  margin-bottom: 20px;
  color: #e67e22;
  font-size: 24px;
  font-weight: bold;
}

/* Botón de Crear Torneo */
.torneos-organizador button {
  padding: 10px 16px;
  margin: 10px 0;
  background-color: #e67e22;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Botón: Hover */
.torneos-organizador button:hover {
  background-color: #d35400;
}

/* Lista de torneos */
.torneos-organizador ul {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
}

/* Elemento individual de la lista */
.torneos-organizador li {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e67e22;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
}

/* Información del torneo */
.torneos-organizador li span {
  font-size: 14px;
  color: #7f8c8d;
}

/* Botones dentro de cada torneo */
.torneos-organizador li button {
  padding: 8px 16px;
  font-size: 14px;
  margin-right: 10px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Botón de Actualizar */
.torneos-organizador li button:nth-child(4) {
  background-color: #3498db;
  color: #fff;
}

.torneos-organizador li button:nth-child(4):hover {
  background-color: #2980b9;
}

/* Botón de Eliminar */
.torneos-organizador li button:nth-child(5) {
  background-color: #e74c3c;
  color: #fff;
}

.torneos-organizador li button:nth-child(5):hover {
  background-color: #c0392b;
}

/* Mensajes */
.error-message {
  color: #e74c3c;
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}

.success-message {
  color: #27ae60;
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}

/* Estilos del Modal */
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
  color: #e67e22;
}

.modal-content form label {
  display: block;
  margin-bottom: 10px;
  text-align: left;
  color: #7f8c8d;
}

.modal-content form input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #e67e22;
  border-radius: 8px;
  font-size: 14px;
}

.modal-content form input:focus {
  outline: none;
  border-color: #d35400;
  box-shadow: 0 0 4px rgba(231, 76, 60, 0.3);
}

.modal-content button {
  margin-top: 20px;
  padding: 10px 16px;
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
  .torneos-organizador {
    padding: 15px;
  }
  .modal-content {
    width: 90%;
  }
}
</style>


