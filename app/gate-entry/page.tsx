"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GateEntry {
  id: string
  name: string
  address: string
  contact: string
  vehicleNo: string
  driverNo: string
  weight: string
  landArea: string
  photo?: string
  timestamp: string
  status: "pending" | "processed"
}

const mockEntries: GateEntry[] = [
  {
    id: "GE001",
    name: "Rajesh Kumar",
    address: "Village Kharkhoda, Sonipat",
    contact: "9876543210",
    vehicleNo: "HR55AB1234",
    driverNo: "DL123456789",
    weight: "2500 kg",
    landArea: "5 acres",
    timestamp: "2024-01-15 09:30 AM",
    status: "pending",
  },
  {
    id: "GE002",
    name: "Suresh Patel",
    address: "Village Bahadurgarh, Jhajjar",
    contact: "9876543211",
    vehicleNo: "HR12CD5678",
    driverNo: "DL987654321",
    weight: "3200 kg",
    landArea: "7 acres",
    timestamp: "2024-01-15 08:15 AM",
    status: "processed",
  },
]

export default function GateEntryPage() {
  const [entries, setEntries] = useState<GateEntry[]>(mockEntries)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    vehicleNo: "",
    driverNo: "",
    weight: "",
    landArea: "",
    photo: null as File | null,
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEntry: GateEntry = {
      id: `GE${String(entries.length + 1).padStart(3, "0")}`,
      ...formData,
      weight: `${formData.weight} kg`,
      landArea: `${formData.landArea} acres`,
      photo: formData.photo ? URL.createObjectURL(formData.photo) : undefined,
      timestamp: new Date().toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: "pending",
    }

    setEntries([newEntry, ...entries])
    setFormData({
      name: "",
      address: "",
      contact: "",
      vehicleNo: "",
      driverNo: "",
      weight: "",
      landArea: "",
      photo: null,
    })
    setShowForm(false)

    toast({
      title: "Entry Created",
      description: `Gate entry ${newEntry.id} has been successfully created.`,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, photo: file })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gate Entry</h1>
              <p className="text-muted-foreground">Manage vehicle entries and farmer registrations</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </div>

          {showForm && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">New Gate Entry</CardTitle>
                <CardDescription>Fill in the details for the new entry</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter farmer name"
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-foreground">
                        Contact *
                      </Label>
                      <Input
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        placeholder="Enter contact number"
                        required
                        className="text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground">
                      Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter complete address"
                      required
                      className="text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleNo" className="text-foreground">
                        Vehicle Number *
                      </Label>
                      <Input
                        id="vehicleNo"
                        value={formData.vehicleNo}
                        onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                        placeholder="e.g., HR55AB1234"
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driverNo" className="text-foreground">
                        Driver License No. *
                      </Label>
                      <Input
                        id="driverNo"
                        value={formData.driverNo}
                        onChange={(e) => setFormData({ ...formData, driverNo: e.target.value })}
                        placeholder="Enter driver license number"
                        required
                        className="text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-foreground">
                        Weight (kg) *
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        placeholder="Enter weight in kg"
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landArea" className="text-foreground">
                        Land Area (acres) *
                      </Label>
                      <Input
                        id="landArea"
                        type="number"
                        step="0.1"
                        value={formData.landArea}
                        onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                        placeholder="Enter land area in acres"
                        required
                        className="text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo" className="text-foreground">
                      Photo Upload
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 text-foreground"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {formData.photo && <p className="text-sm text-foreground/60">Selected: {formData.photo.name}</p>}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit">Submit Entry</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Pending Entries</CardTitle>
                  <CardDescription>Entries awaiting quality check processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Vehicle No.</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Land Area</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((entry) => entry.status === "pending")
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.id}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell>{entry.vehicleNo}</TableCell>
                            <TableCell>{entry.weight}</TableCell>
                            <TableCell>{entry.landArea}</TableCell>
                            <TableCell>{entry.timestamp}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{entry.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Entry History</CardTitle>
                  <CardDescription>All processed gate entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Vehicle No.</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Land Area</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((entry) => entry.status === "processed")
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.id}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell>{entry.vehicleNo}</TableCell>
                            <TableCell>{entry.weight}</TableCell>
                            <TableCell>{entry.landArea}</TableCell>
                            <TableCell>{entry.timestamp}</TableCell>
                            <TableCell>
                              <Badge variant="default">{entry.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
