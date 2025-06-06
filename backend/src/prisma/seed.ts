// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Criar os ativos fixos no banco de dados se eles não existirem
  const fixedAssetsData = [
    { id: 1, name: "Ação XYZ", value: 50.25 },
    { id: 2, name: "Fundo ABC", value: 120.00 },
    { id: 3, name: "CDB DEF", value: 105.50 },
    { id: 4, name: "Tesouro Direto Selic", value: 10.50 },
    { id: 5, name: "Bitcoin", value: 60000.00 },
  ]

  for (const assetData of fixedAssetsData) {
    await prisma.asset.upsert({
      where: { id: assetData.id },
      update: {}, // Não faz nada se já existe
      create: assetData, // Cria se não existe
    })
    console.log(`Upserted asset with id: ${assetData.id}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })