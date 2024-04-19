const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();

    // Retrieve all rows from the 'users' table
    const users = await prisma.users.findMany();

    // Print each user row
    console.log("Rows from the 'users' table:");
    users.forEach(user => {
      console.log(user);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
