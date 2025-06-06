// src/entities/ClientAssetEntity.ts
export interface ClientAssetEntity {
  id: number;
  clientId: number;
  assetId: number;
  quantity: number;
  client?: { id: number; name: string; email: string; };
  asset?: { id: number; name: string; value: number; };
}