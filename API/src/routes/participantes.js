const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { autenticar, verificarRol } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Ver torneos disponibles para un participante
router.get('/ver-disponibles', autenticar, verificarRol(['participante']), async (req, res) => {
    try {
      const torneosDisponibles = await prisma.torneo.findMany({
        where: {
          NOT: {
            participantes: {
              some: {
                usuarioId: req.user.id, // Excluye torneos en los que ya está inscrito este participante
              }
            }
          }
        },
      });
  
      // Devolver los torneos disponibles
      res.json(torneosDisponibles);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener torneos disponibles", detalle: error.message });
    }
  });
  

// Participante se une a un torneo
router.post('/unirse', autenticar, verificarRol(['participante']), async (req, res) => {
  const { torneoId } = req.body;

  try {
    const torneo = await prisma.torneo.findUnique({ where: { id: torneoId } });
    if (!torneo) {
      return res.status(404).json({ error: "Torneo no encontrado" });
    }

    // Verificar si ya está inscrito
    const yaInscrito = await prisma.participante.findFirst({
      where: { torneoId, usuarioId: req.user.id },
    });
    if (yaInscrito) {
      return res.status(400).json({ error: "Ya estás inscrito en este torneo" });
    }

    const participante = await prisma.participante.create({
      data: {
        torneoId,
        usuarioId: req.user.id,
      },
    });

    res.status(201).json({ message: "Inscripción exitosa", participante });
  } catch (error) {
    res.status(500).json({ error: "Error al inscribirse en el torneo", detalle: error.message });
  }
});

// Participante se retira de un torneo
router.delete('/salir', autenticar, verificarRol(['participante']), async (req, res) => {
  const { torneoId } = req.body;

  try {
    const torneo = await prisma.torneo.findUnique({ where: { id: torneoId } });
    if (!torneo) {
      return res.status(404).json({ error: "Torneo no encontrado" });
    }

    const participacion = await prisma.participante.findFirst({
      where: { torneoId, usuarioId: req.user.id },
    });

    if (!participacion) {
      return res.status(400).json({ error: "No estás inscrito en este torneo" });
    }

    await prisma.participante.delete({ where: { id: participacion.id } });

    res.json({ message: "Te has retirado del torneo" });
  } catch (error) {
    res.status(500).json({ error: "Error al salir del torneo", detalle: error.message });
  }
});


// Listar torneos en los que el participante está inscrito
router.get('/mis-torneos', autenticar, async (req, res) => {
    const usuarioId = req.user.id; // Obtener el ID del usuario autenticado
  
    try {
      const torneos = await prisma.torneo.findMany({
        where: {
          participantes: {
            some: { usuarioId }, // Filtrar torneos donde hay al menos un participante con el usuarioId
          },
        },
        include: {
          participantes: {
            include: {
              usuario: { select: { id: true, nombre: true, email: true } }, // Incluir información del usuario en los participantes
            },
          },
        },
      });
  
      res.json(torneos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener torneos", detalle: error.message });
    }
  });
  
module.exports = router;
