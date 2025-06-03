import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'


const prisma = new PrismaClient()

async function seedMainDatabase() {
  // Permissions
  await prisma.permissions.createMany({
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
  await prisma.roles.createMany({
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

  // Points
  await prisma.points.createMany({
    data: [
      {
        name: 'Praia de Barra Nova',
        city: 'Cascavel',
        state: 'CE',
        lat: -4.1333,
        long: -38.2333,
      },
      {
        name: 'Lagoa do Banana',
        city: 'Cascavel',
        state: 'CE',
        lat: -4.1408,
        long: -38.2419,
      },
      {
        name: 'Praia do Balbino',
        city: 'Cascavel',
        state: 'CE',
        lat: -4.1286,
        long: -38.2258,
      },
      {
        name: 'Praia de Caponga',
        city: 'Cascavel',
        state: 'CE',
        lat: -4.1667,
        long: -38.2500,
      },
      {
        name: 'Praia do Batoque',
        city: 'Aquiraz',
        state: 'CE',
        lat: -3.9019,
        long: -38.3861,
      },
      {
        name: 'Praia do Presídio',
        city: 'Aquiraz',
        state: 'CE',
        lat: -3.9167,
        long: -38.3667,
      },
      {
        name: 'Prainha',
        city: 'Beberibe',
        state: 'CE',
        lat: -4.4500,
        long: -38.0667,
      },
      {
        name: 'Praia das Fontes',
        city: 'Beberibe',
        state: 'CE',
        lat: -4.4333,
        long: -38.0500,
      },
      {
        name: 'Morro Branco',
        city: 'Beberibe',
        state: 'CE',
        lat: -4.4167,
        long: -38.0333,
      },
      {
        name: 'Praia do Uruaú',
        city: 'Beberibe',
        state: 'CE',
        lat: -4.3667,
        long: -38.0167,
      },
    ],
    skipDuplicates: true,
  });

  const superAdmin = await prisma.roles.findUnique({
    where: { slug: 'admin' },
  })

  const allPermissions = await prisma.permissions.findMany()

  if (superAdmin && allPermissions.length > 0) {
    await prisma.rolePermissions.createMany({
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

  const existingUser = await prisma.users.findUnique({
    where: { email: adminEmail },
  })

  if (!existingUser && superAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    await prisma.users.create({
      data: {
        full_name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        roleId: superAdmin.id,
        is_active: true,
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
