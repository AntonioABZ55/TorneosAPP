const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // Crear contraseñas encriptadas
  const hashedPassword1 = await bcrypt.hash('organizador123', 10);
  const hashedPassword2 = await bcrypt.hash('participante123', 10);

  // Crear usuarios organizadores
  const organizador1 = await prisma.usuario.create({
    data: {
      nombre: "Organizador 1",
      email: "organizador1@example.com",
      password: hashedPassword1,
      tipo: "organizador"
    },
  });

  const organizador2 = await prisma.usuario.create({
    data: {
      nombre: "Organizador 2",
      email: "organizador2@example.com",
      password: hashedPassword1,
      tipo: "organizador"
    },
  });

  // Crear usuarios participantes
  const participante1 = await prisma.usuario.create({
    data: {
      nombre: "Participante 1",
      email: "participante1@example.com",
      password: hashedPassword2,
      tipo: "participante"
    },
  });

  const participante2 = await prisma.usuario.create({
    data: {
      nombre: "Participante 2",
      email: "participante2@example.com",
      password: hashedPassword2,
      tipo: "participante"
    },
  });

  // Crear torneos y asociar participantes directamente
  const torneo1 = await prisma.torneo.create({
    data: {
      nombre: "Torneo de Fútbol",
      fecha: new Date("2024-12-01"),
      ubicacion: "Ciudad Deportiva",
      organizadorId: organizador1.id,
      participantes: { // Asociar participantes al torneo
        create: [
          { usuarioId: participante1.id },
          { usuarioId: participante2.id },
        ],
      },
    },
  });

  const torneo2 = await prisma.torneo.create({
    data: {
      nombre: "Torneo de Ajedrez",
      fecha: new Date("2024-12-10"),
      ubicacion: "Club de Ajedrez",
      organizadorId: organizador2.id,
      participantes: { // Asociar participantes al torneo
        create: [
          { usuarioId: participante2.id }, // Solo el participante 2 se une a este torneo
        ],
      },
    },
  });

  // También agregar participantes a torneos utilizando el modelo Participante
  await prisma.participante.createMany({
    data: [
      { torneoId: torneo1.id, usuarioId: participante1.id },
      { torneoId: torneo1.id, usuarioId: participante2.id },
      { torneoId: torneo2.id, usuarioId: participante2.id },
    ],
  });

  console.log("Seed completado!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });