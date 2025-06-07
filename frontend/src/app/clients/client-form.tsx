"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(50, {
    message: "Name must not be longer than 50 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  status: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>;

interface Client {
  id: number;
  name: string;
  email: string;
  status: boolean;
  createdAt: string;
}

interface ClientFormProps {
  onClose: () => void;
  client: Client | null; // Null for creation mode, Client object for edit mode
}

export default function ClientForm({ onClose, client }: ClientFormProps) {
  const queryClient = useQueryClient()

  const isEditing = !!client;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing ? {
      name: client.name,
      email: client.email,
      status: client.status,
    } : {
      name: "",
      email: "",
      status: true,
    },
  })

  const createClientMutation = useMutation({
    mutationFn: async (newClientData: FormValues) => {
      const response = await axios.post("http://localhost:3000/clients", newClientData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast.success("Client created!", {
        description: "The new client has been added successfully.",
      })
      onClose()
      form.reset()
    },
    onError: (error) => {
      toast.error("Error creating client", {
        description: error.message || "Something went wrong.",
      })
    },
  })

  const updateClientMutation = useMutation({
    mutationFn: async (updatedClientData: FormValues) => {
      if (!client?.id) {
        throw new Error("Client ID is missing for update operation.")
      }
      const response = await axios.put(`http://localhost:3000/clients/${client.id}`, updatedClientData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast.success("Client updated!", {
        description: "The client details have been updated successfully.",
      })
      onClose()
    },
    onError: (error) => {
      toast.error("Error updating client", {
        description: error.message || "Something went wrong.",
      })
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (isEditing) {
      updateClientMutation.mutate(values)
    } else {
      createClientMutation.mutate(values)
    }
  }

  const isPending = createClientMutation.isPending || updateClientMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Client Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="client@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Active Client
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Client" : "Create Client")}
        </Button>
      </form>
    </Form>
  )
}
