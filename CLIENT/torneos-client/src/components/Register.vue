<template>
    <div class="register-container">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="userData.nombre" type="text" placeholder="Full Name" required />
        <input v-model="userData.email" type="email" placeholder="Email" required />
        <input v-model="userData.password" type="password" placeholder="Password" required />
        
        <!-- Select para elegir el tipo de usuario -->
        <div class="user-type">
          <label for="tipo">Select User Type:</label>
          <select v-model="tipo" id="tipo" required>
            <option value="paarticipante">Participant</option>
            <option value="organizador">Organizer</option>
          </select>
        </div>
  
        <button type="submit">Register</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
  
      <!-- Enlace para ir al Login -->
      <p>Already have an account? 
        <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '../stores/auth';
  
  export default {
    data() {
      return {
        userData: {
          nombre: '',
          email: '',
          password: '',
          tipo: 'participante'
        }
      };
    },
    computed: {
      errorMessage() {
        return this.authStore.errorMessage;
      }
    },
    methods: {
      async handleRegister() {
        try {
          // Incluye el tipo de usuario al registrar
          await this.authStore.register({ ...this.userData, type: this.userType });
          this.$router.push('/login');  // Redirige al login después de registrar
        } catch (err) {
          console.error(err);
        }
      }
    },
    setup() {
      const authStore = useAuthStore();
      return { authStore };
    }
  };
  </script>
  
  <style scoped>
/* Contenedor principal del registro */
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fffaf0;
  text-align: center;
}

/* Título */
.register-container h2 {
  margin-bottom: 20px;
  color: #e67e22;
  font-size: 24px;
  font-weight: bold;
}

/* Inputs y Select */
.register-container input,
.register-container select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #e67e22;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

/* Inputs y Select: Enfoque */
.register-container input:focus,
.register-container select:focus {
  outline: none;
  border-color: #d35400;
  box-shadow: 0 0 4px rgba(231, 76, 60, 0.3);
}

/* Botón de Registro */
.register-container button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #e67e22;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Botón: Enfoque y hover */
.register-container button:hover,
.register-container button:focus {
  background-color: #d35400;
}

/* Mensaje de error */
.error-message {
  color: #e74c3c;
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}

/* Enlace */
.register-container a {
  color: #e67e22;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

/* Enlace: Hover */
.register-container a:hover {
  color: #d35400;
}

/* Responsivo */
@media (max-width: 480px) {
  .register-container {
    padding: 15px;
  }
  .register-container h2 {
    font-size: 20px;
  }
  .register-container input,
  .register-container button,
  .register-container select {
    font-size: 14px;
  }
}
</style>
