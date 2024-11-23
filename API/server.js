const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/auth'); // Rutas de autenticación
const torneoRoutes = require('./src/routes/torneos');
const participacionRoutes = require('./src/routes/participantes');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', authRoutes); 
app.use('/api/torneos', torneoRoutes);
app.use('/api/participacion', participacionRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
