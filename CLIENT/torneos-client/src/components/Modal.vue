<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header>
          <slot name="header"></slot>
          <button class="close-button" @click="close">&times;</button>
        </header>
        <main>
          <slot name="body"></slot>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      close() {
        this.$emit("close");
      }
    }
  };
  </script>
  
  <style scoped>
/* Fondo oscuro del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegurarse de que el modal esté encima de otros elementos */
}

/* Contenido del modal */
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Encabezado del modal */
.modal-content header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Título dentro del header */
.modal-content header h3 {
  color: #e67e22;
  font-size: 22px;
  font-weight: bold;
}

/* Botón de cerrar */
.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #e67e22;
  cursor: pointer;
  transition: color 0.3s ease;
}

/* Botón de cerrar: Hover */
.close-button:hover {
  color: #d35400;
}

/* Cuerpo del modal */
.modal-content main {
  margin-bottom: 20px;
}

/* Responsivo: Ajuste en dispositivos móviles */
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }
  .modal-content header h3 {
    font-size: 18px;
  }
  .close-button {
    font-size: 1.2rem;
  }
}
</style>

  