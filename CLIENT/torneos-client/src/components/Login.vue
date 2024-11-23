<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="credentials.email" type="email" placeholder="Email" required />
      <input v-model="credentials.password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
    <p>Don't have an account? 
      <router-link to="/registro">Sign up here</router-link> <!-- Enlace al registro -->
    </p>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
    };
  },
  computed: {
    errorMessage() {
      return this.authStore.errorMessage;
    }
  },
  methods: {
    async handleLogin() {
      try {
        await this.authStore.login(this.credentials);
        console.log(this.authStore.role)
        // Redirigir según el tipo de usuario
        if (this.authStore.role === 'organizador') {
          this.$router.push('/torneos/organizador'); // Redirigir a la página de torneos para organizadores
        } else  {
          this.$router.push('/torneos/participante'); // Redirigir a la página de torneos para participantes
        }
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
/* Contenedor principal del login */
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fffaf0;
  text-align: center;
}

/* Título */
.login-container h2 {
  margin-bottom: 20px;
  color: #e67e22;
  font-size: 24px;
  font-weight: bold;
}

/* Inputs */
.login-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #e67e22;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

/* Inputs: Enfoque */
.login-container input:focus {
  outline: none;
  border-color: #d35400;
  box-shadow: 0 0 4px rgba(231, 76, 60, 0.3);
}

/* Botón de Login */
.login-container button {
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
.login-container button:hover,
.login-container button:focus {
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
.login-container a {
  color: #e67e22;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

/* Enlace: Hover */
.login-container a:hover {
  color: #d35400;
}

/* Responsivo */
@media (max-width: 480px) {
  .login-container {
    padding: 15px;
  }
  .login-container h2 {
    font-size: 20px;
  }
  .login-container input,
  .login-container button {
    font-size: 14px;
  }
}
</style>

