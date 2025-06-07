"use client"

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define interfaces for data types
interface Client {
  id: number;
  name: string;
  email: string;
  status: boolean;
  createdAt: string;
}

interface ClientAsset {
  id: number;
  clientId: number;
  assetId: number; // This comes from your backend schema.prisma
  quantity: number; // This comes from your backend schema.prisma
  createdAt: string; // Add createdAt to ClientAsset as per your schema
  client?: {
    id: number;
    name: string;
    email: string;
  };
  asset?: {
    id: number;
    name: string;
    value: number;
  };
}

interface AvailableAsset {
  id: number;
  name: string;
  value: number;
}

// Zod schema for adding a new allocation
const addAllocationSchema = z.object({
  assetId: z.coerce.number().int().positive({ message: "Asset ID must be a positive integer." }), 
  quantity: z.coerce.number().positive({ message: "Quantity must be a positive number." }),
});

type AddAllocationFormValues = z.infer<typeof addAllocationSchema>;

export default function ClientAllocationsPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const clientId = parseInt(params.id as string);

  const [isAddAllocationModalOpen, setIsAddAllocationModalOpen] = useState(false);

  // Fetch client details
  const { data: client, isLoading: isLoadingClient, isError: isErrorClient, error: errorClient } = useQuery<Client, Error>({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/clients/${clientId}`);
      return response.data;
    },
    enabled: !!clientId && !isNaN(clientId), // Only run if clientId is valid and not NaN
  });

  // Fetch client's allocated assets
  const { data: clientAssets, isLoading: isLoadingClientAssets, isError: isErrorClientAssets, error: errorClientAssets } = useQuery<ClientAsset[], Error>({
    queryKey: ["clientAssets", clientId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/clients/${clientId}/allocations`);
      return response.data;
    },
    enabled: !!clientId && !isNaN(clientId),
  });

  // Fetch static list of all assets for the dropdown
  const { data: allAvailableAssets, isLoading: isLoadingAllAvailableAssets, isError: isErrorAllAvailableAssets, error: errorAllAvailableAssets } = useQuery<AvailableAsset[], Error>({
    queryKey: ["allAvailableAssets"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/assets");
      return response.data;
    }
  });


  const form = useForm<AddAllocationFormValues>({
    resolver: zodResolver(addAllocationSchema),
    defaultValues: {
      assetId: 0, // Default to 0 or null for select
      quantity: 1,
    },
  });

  // Mutation to add a new allocation
  const addAllocationMutation = useMutation({
    mutationFn: async (newAllocationData: AddAllocationFormValues) => {
      // Endpoint to create a new client asset allocation
      const response = await axios.post("http://localhost:3000/client-assets", {
        clientId: clientId,
        assetId: newAllocationData.assetId,
        quantity: newAllocationData.quantity,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientAssets", clientId] });
      toast.success("Asset allocated successfully!", {
        description: "The asset has been added to the client's portfolio.",
      });
      setIsAddAllocationModalOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Error allocating asset", {
        description: error.message || "Something went wrong.",
      });
    },
  });

  // Mutation to delete an allocation
  const deleteAllocationMutation = useMutation({
    mutationFn: async (allocationId: number) => {
      // Endpoint to delete a client asset allocation by its ID
      const response = await axios.delete(`http://localhost:3000/client-assets/${allocationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientAssets", clientId] });
      toast.success("Allocation removed successfully!", {
        description: "The asset has been removed from the client's portfolio.",
      });
    },
    onError: (error) => {
      toast.error("Error removing allocation", {
        description: error.message || "Something went wrong.",
      });
    },
  });

  const onSubmitAddAllocation: SubmitHandler<AddAllocationFormValues> = (values) => {
    addAllocationMutation.mutate(values);
  };

  const handleDeleteAllocation = (allocationId: number) => {
    if (window.confirm("Are you sure you want to remove this allocation?")) {
      deleteAllocationMutation.mutate(allocationId);
    }
  };

  // Function to dynamically set asset value if a static asset is chosen
  const handleAssetSelectChange = (value: string) => {
    const selectedAssetId = parseInt(value);
    const selectedAsset = allAvailableAssets?.find(asset => asset.id === selectedAssetId);
    if (selectedAsset) {
      form.setValue("assetId", selectedAsset.id);
    } else {
      form.setValue("assetId", 0); // Reset if nothing valid selected
    }
    form.trigger("assetId");
  };


  if (isLoadingClient || isLoadingClientAssets || isLoadingAllAvailableAssets) {
    return <div className="p-8">Loading client and assets...</div>
  }

  if (isErrorClient) {
    return <div className="p-8 text-red-500">Error loading client: {errorClient?.message}</div>
  }

  if (isErrorClientAssets) {
    return <div className="p-8 text-red-500">Error loading client assets: {errorClientAssets?.message}</div>
  }

  if (isErrorAllAvailableAssets) {
    return <div className="p-8 text-red-500">Error loading available assets: {errorAllAvailableAssets?.message}</div>
  }

  if (!client) {
    return <div className="p-8 text-red-500">Client not found.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Allocations for {client.name}</h1>
        <div className="flex space-x-4">
          <Link href="/clients">
            <Button variant="outline">Back to Clients</Button>
          </Link>
          <Dialog open={isAddAllocationModalOpen} onOpenChange={setIsAddAllocationModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Allocation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Asset Allocation</DialogTitle>
                <DialogDescription>
                  Allocate a financial asset to {client.name}.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmitAddAllocation)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="assetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset</FormLabel>
                      <Select onValueChange={handleAssetSelectChange} value={field.value ? String(field.value) : ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an asset" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allAvailableAssets?.map((asset) => (
                            <SelectItem key={asset.id} value={String(asset.id)}>
                              {asset.name} (Value: {asset.value.toFixed(2)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g., 10.5"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))} // Ensure value is number
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={addAllocationMutation.isPending}>
                  {addAllocationMutation.isPending ? "Adding..." : "Add Allocation"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Name</TableHead>
            <TableHead className="text-right">Asset Value</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Allocated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientAssets?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No assets allocated yet.</TableCell> {/* Colspan adjusted */}
            </TableRow>
          ) : (
            clientAssets?.map((allocation) => (
              <TableRow key={allocation.id}>
                <TableCell className="font-medium">{allocation.asset?.name || "N/A"}</TableCell> {/* Access asset.name */}
                <TableCell className="text-right">{allocation.asset?.value.toFixed(2) || "N/A"}</TableCell> {/* Access asset.value */}
                <TableCell className="text-right">{allocation.quantity.toFixed(2)}</TableCell> {/* Display quantity */}
                <TableCell className="text-right">{new Date(allocation.createdAt || '').toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAllocation(allocation.id)}
                    disabled={deleteAllocationMutation.isPending}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}