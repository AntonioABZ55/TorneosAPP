const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = "bxdJ0WyDEar4G2GlVx7sX1bUBjEzNtRW";

// Registro de usuario
router.post('/registro', async (req, res) => {
  const { nombre, email, password, tipo } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: { nombre, email, password: hashedPassword, tipo },
  });

  res.status(201).json({ message: "Usuario registrado con éxito", usuario });
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario en la base de datos
        const usuario = await prisma.usuario.findUnique({
            where: { email: email }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verifica si la contraseña fue proporcionada correctamente
        if (!password) {
            return res.status(400).json({ error: 'Por favor, ingrese una contraseña' });
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const isPasswordValid = await bcrypt.compare(password, usuario.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Crear el payload del token
        const payload = {
            id: usuario.id,
            email: usuario.email,
            tipo: usuario.tipo // Puedes incluir más información según sea necesario
        };

        // Generar el JWT
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Devolver el token al cliente
       return res.status(200).json({ message: 'Login exitoso', token: token, tipo: usuario.tipo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error en el servidor' });
    }
});

module.exports = router;
