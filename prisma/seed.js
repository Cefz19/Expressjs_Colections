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

  await prisma.user.deleteMany();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
