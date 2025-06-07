// src/prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Seed Assets (Ativos)
  const assetsData = [
    { name: 'Ação XYZ', value: 50.25 },
    { name: 'Fundo ABC', value: 120.75 },
    { name: 'CDB DEF', value: 98.50 },
    { name: 'Tesouro Direto Selic', value: 10.00 },
    { name: 'Crypto GHI', value: 50000.00 },
  ];

  for (const assetData of assetsData) {
    const asset = await prisma.asset.upsert({
      where: { name: assetData.name },
      update: { value: assetData.value },
      create: assetData,
    });
    console.log(`Upserted asset with id: ${asset.id} and name: ${asset.name}`);
  }

  // 2. Seed Clients (Clientes) to test
  const clientsData = [
    { name: 'Paloma Santos', email: 'paloma.santos@example.com' },
    { name: 'Bryan Ricardo', email: 'bryan.ricardo@example.com' },
    { name: 'Daniel Silva', email: 'daniel.silva@example.com' },
  ];

  for (const clientData of clientsData) {
    const client = await prisma.client.upsert({
      where: { email: clientData.email },
      update: { name: clientData.name },
      create: clientData,
    });
    console.log(`Upserted client with id: ${client.id} and name: ${client.name}`);
  }

  const clientAssetsData = [
    { clientId: 1, assetId: 1, quantity: 10 },
    { clientId: 1, assetId: 2, quantity: 5 },
    { clientId: 2, assetId: 1, quantity: 20 },
    { clientId: 2, assetId: 3, quantity: 8 },
    { clientId: 3, assetId: 4, quantity: 100 },
    { clientId: 2, assetId: 1, quantity: 25 },
  ];

  for (const clientAssetData of clientAssetsData) {
    await prisma.clientAsset.upsert({
      where: {
        clientId_assetId: {
          clientId: clientAssetData.clientId,
          assetId: clientAssetData.assetId,
        },
      },
      update: {
        quantity: clientAssetData.quantity,
      },
      create: clientAssetData,
    });
    console.log(`Upserted client asset for client ${clientAssetData.clientId} and asset ${clientAssetData.assetId} with quantity ${clientAssetData.quantity}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });