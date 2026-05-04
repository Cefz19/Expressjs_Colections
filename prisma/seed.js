const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // const users = [
  //   { name: "User 1", email: "user1@example.com", password: "password123" },
  //   { name: "User 2", email: "user2@example.com", password: "password123" },
  //   { name: "User 3", email: "user3@example.com", password: "password123" },
  // ];

  // for (const user of users) {
  //   await prisma.user.create({
  //     data: user,
  //   });
  // }
  // console.log("Demo user successfully created");

  // await prisma.user.deleteMany();
  // Crear usuarios
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      password: "password123",
      name: "User One",
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Crear bloques de tiempo
  const timeBlock1 = await prisma.timeBlock.create({
    data: {
      startTime: new Date("2023-10-01T09:00:00Z"),
      endTime: new Date("2023-10-01T10:00:00Z"),
    },
  });

  const timeBlock2 = await prisma.timeBlock.create({
    data: {
      startTime: new Date("2023-10-01T10:00:00Z"),
      endTime: new Date("2023-10-01T11:00:00Z"),
    },
  });

  // Crear citas
  await prisma.appointment.create({
    data: {
      date: new Date("2023-10-01T09:00:00Z"),
      user: { connect: { id: user1.id } },
      timeBlock: { connect: { id: timeBlock1.id } },
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date("2023-10-01T10:00:00Z"),
      user: { connect: { id: user2.id } },
      timeBlock: { connect: { id: timeBlock2.id } },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
