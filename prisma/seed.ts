import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
const prisma = new PrismaClient()
async function main() {
    const password = await hash("test", 11)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@trackie.io' },
        update: {},
        create: {
        email: 'admin@trackie.io',
        name: 'Admin',
        password: password
        },
    })
    console.log({ admin })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })