import fs from "node:fs"
import path from "node:path"
import { faker } from "@faker-js/faker"

// import { accessLevels } from "./data"

const customers = Array.from({ length: 100 }, () => ({
  id: faker.string.ulid(),
  title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  filePath: faker.system.filePath(),
  thumbnail: faker.image.url(),
  description: faker.lorem.paragraph(2),
  // category: faker.helpers.arrayElement(categories).value,
  // label: faker.helpers.arrayElement(labels).value,
  // accessLevel: faker.helpers.arrayElement(accessLevels).value,
}))

fs.writeFileSync(
  path.join(__dirname, "customers.json"),
  JSON.stringify(customers, null, 2),
)

console.log("✅ Customers data generated.")
