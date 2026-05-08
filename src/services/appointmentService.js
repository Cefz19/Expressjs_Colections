const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

exports.getUserAppointments = async (userId) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: parseInt(userId) },
      include: { timeBlock: true },
    });
    return appointments;
  } catch (error) {
    throw new Error("Error fetching the appointments history");
  }
};
