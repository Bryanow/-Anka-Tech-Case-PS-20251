"use client" 

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Client {
  id: number;
  name: string;
  email: string;
  status: boolean;
  createdAt: string;
}

async function fetchClients(): Promise<Client[]> {
  const response = await axios.get("http://localhost:3000/clients")
  return response.data
}

export default function ClientsPage() {
  const { data: clients, isLoading, isError, error } = useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: fetchClients,
  })

  if (isLoading) {
    return <div className="p-8">Loading clients...</div>
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error loading clients: {error?.message}</div>
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button asChild>
          <Link href="/clients/new">New Client</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Create At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.id}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.status ? "Active" : "Inactive"}</TableCell>
              <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/clients/${client.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="outline" size="sm" className="ml-2" asChild>
                  <Link href={`/clients/${client.id}/allocations`}>Alocations</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}