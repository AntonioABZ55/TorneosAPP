const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { autenticar, verificarRol } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Crear torneo
router.post('/crear', autenticar, verificarRol(['organizador']), async (req, res) => {
  const { nombre, fecha, ubicacion } = req.body;
  const torneo = await prisma.torneo.create({
    data: { nombre, fecha: new Date(fecha), ubicacion, organizadorId: req.user.id },
  });
  res.json(torneo);
});

// Leer torneos de un organizador
router.get('/ver', autenticar, verificarRol(['organizador']), async (req, res) => {
  const torneos = await prisma.torneo.findMany({ where: { organizadorId: req.user.id } });
  res.json(torneos);
});

// Listar participantes de un torneo
router.get('/participacion', autenticar, async (req, res) => {
    const { torneoId } = req.query; // Obtener torneoId desde los parámetros de consulta
  
    try {
      const participantes = await prisma.participante.findMany({
        where: { torneoId },
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
        },
      });
      res.json(participantes);

    } catch (error) {
      res.status(500).json({ error: "Error al obtener participantes", detalle: error.message });
    }
  });

// Eliminar torneo
router.delete('/eliminar', autenticar, verificarRol(['organizador']), async (req, res) => {
    const { torneoId } = req.query; // Obtén el ID del torneo de los parámetros de consulta
    console.log('Inicio de la peticion')
    console.log(torneoId)
    if (!torneoId) {
      return res.status(400).json({ message: "ID del torneo es requerido." });
    }
  
    try {
      await prisma.torneo.deleteMany({
        where: { id: torneoId, organizadorId: req.user.id },
      });
  
      res.json({ message: "Torneo eliminado" });
      console.log('ID del torneo eliminado: ',torneoId)
    } catch (error) {
      res.status(404).json({ message: "Torneo no encontrado" });
    }
  });

// Actualizar torneo
router.put('/actualizar/:torneoId', autenticar, verificarRol(['organizador']), async (req, res) => {
  console.log('-------------Estas en la funcion update--------------')
  const { torneoId } = req.params; // Obtén el ID del torneo de los parámetros de ruta
  const { nombre, fecha, ubicacion } = req.body;
  if (!nombre && !fecha && !ubicacion) {
    return res.status(400).json({ message: "Al menos un campo debe ser proporcionado para la actualización." });
  }

  try {
    const torneoActualizado = await prisma.torneo.update({
      where: { id: torneoId },
      data: {
        nombre: nombre || undefined,
        fecha: fecha ? new Date(fecha) : undefined, // Convierte fecha a objeto Date
        ubicacion: ubicacion || undefined,
      },
    });

    res.json({ message: "Torneo actualizado", torneo: torneoActualizado });
    console.log('El ID del torneo que actualizo: ', torneoId)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Torneo no encontrado." });
    }
    console.log(error)
    res.status(500).json({ message: "Error al actualizar el torneo" });
    console.log('El ID del torneo intento actualizar: ', torneoId)

  }
});

module.exports = router;
