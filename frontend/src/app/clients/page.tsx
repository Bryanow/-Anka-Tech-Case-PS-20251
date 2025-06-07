"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import ClientForm from "./client-form"

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
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);


  const { data: clients, isLoading, isError, error } = useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: fetchClients,
  })

  const handleEditClick = (client: Client) => {
    setEditingClient(client)
    setIsEditClientModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditClientModalOpen(false)
    setEditingClient(null)
  }


  if (isLoading) {
    return <div className="p-8">Loading clients...</div>
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error loading clients: {error?.message}</div>
  }

  if (!clients || !Array.isArray(clients)) {
    return <div className="p-8">No clients found or data format is incorrect.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>

        <Dialog open={isNewClientModalOpen} onOpenChange={setIsNewClientModalOpen}>
          <DialogTrigger asChild>
            <Button>New Client</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Client</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new client.
              </DialogDescription>
            </DialogHeader>
            <ClientForm onClose={() => setIsNewClientModalOpen(false)} client={null} />
          </DialogContent>
        </Dialog>

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
                <Button variant="outline" size="sm" onClick={() => handleEditClick(client)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="ml-2" asChild>
                  <Link href={`/clients/${client.id}/allocations`}>Allocations</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingClient && (
        <Dialog open={isEditClientModalOpen} onOpenChange={handleCloseEditModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Edit the details of the client below.
              </DialogDescription>
            </DialogHeader>
            <ClientForm onClose={handleCloseEditModal} client={editingClient} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}