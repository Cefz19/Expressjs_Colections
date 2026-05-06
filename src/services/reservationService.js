const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.createReservation = async (data) => {
  const conflict = await prisma.appointment.findFirst({
    where: {
      date: data.date,
      timeBlockId: data.timeBlockId,
    },
  });
  if (conflict) {
    throw new Error("The schedule is already occupied");
  }
  return prisma.appointment.create({ data });
};

exports.getReservation = (id) => {
  return prisma.appointment.findUnique({
    where: { id: parseInt(id, 10) },
  });
};

exports.updateReservation = async (id, date) => {
  const conflict = await prisma.appointment.findFirst({
    where: {
      date: data.date,
      timeBlockId: data.timeBlockId,
      id: { not: parseInt(id, 10) },
    },
  });
  if (conflict) {
    throw new Error("The schedule is already occupied");
  }
  return prisma.appointment.update({
    where: { id: parseInt(id, 10) },
    data,
  });
};

exports.deleteReservation = (id) => {
  return prisma.appointment.delete({
    where: { id: parseInt(id, 10) },
  });
};
