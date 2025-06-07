export interface ClientAssetEntity {
  id: number;
  clientId: number;
  assetId: number;
  quantity: number;
  client?: {
    id: number;
    name: string;
    email: string;
    status: boolean;
    createdAt: Date;
  };
  asset?: {
    id: number;
    name: string;
    value: number;
    createdAt: Date;
  };
}