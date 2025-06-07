"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Asset {
  id: number;
  name: string;
  value: number;
}

async function fetchAssets(): Promise<Asset[]> {
  const response = await axios.get("http://localhost:3000/assets")
  return response.data
}

export default function AssetsPage() {
  const { data: assets, isLoading, isError, error } = useQuery<Asset[], Error>({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  })

  if (isLoading) {
    return <div className="p-8">Loading assets...</div>
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error loading assets: {error?.message}</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Financial Assets</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets?.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.id}</TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell className="text-right">{asset.value.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}