import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  "Electronics",
  "Furniture",
  "Books",
  "Textbooks",
  "Clothing",
  "Accessories",
  "Services",
  "Other",
];

async function main() {
  for (const name of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`Seeded ${DEFAULT_CATEGORIES.length} categories.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
