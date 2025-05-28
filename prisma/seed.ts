import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'


const prisma = new PrismaClient()

async function seedMainDatabase() {
  // Permissions
  await prisma.permission.createMany({
    data: [
      {
        name: 'Admin',
        slug: 'admin',
        description: 'Permissão completa de administração do sistema',
      },
    ],
    skipDuplicates: true,
  })

  // Roles
  await prisma.role.createMany({
    data: [
      {
        name: 'Admin',
        slug: 'admin',
        description: 'Perfil com acesso total ao sistema',
      },
      {
        name: 'Client',
        slug: 'client',
        description: 'Perfil de usuário',
      },
      {
        name: 'Driver',
        slug: 'driver',
        description: 'Perfil de motorista',
      },
    ],
    skipDuplicates: true,
  })

  const superAdmin = await prisma.role.findUnique({
    where: { slug: 'admin' },
  })

  const allPermissions = await prisma.permission.findMany()

  if (superAdmin && allPermissions.length > 0) {
    await prisma.rolePermission.createMany({
      data: allPermissions.map((p) => ({
        roleId: superAdmin.id,
        permissionId: p.id,
      })),
      skipDuplicates: true,
    })
  }

  // Admin user
  const adminEmail = process.env.EMAIL_ADMIN
  const adminPassword = process.env.PASSWORD_ADMIN

  if (!adminEmail || !adminPassword) {
    throw new Error('EMAIL_ADMIN e PASSWORD_ADMIN precisam estar definidos no .env')
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingUser && superAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    await prisma.user.create({
      data: {
        full_name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        roleId: superAdmin.id,
        is_active: true,
        status: 'APPROVED',
      },
    })

    console.log('Usuário admin criado com sucesso!')
  } else {
    console.log('Usuário admin já existe ou role admin não encontrada.')
  }

  console.log('Seed concluído com sucesso!')
}

async function main() {
  await seedMainDatabase()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
