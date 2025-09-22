"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, Eye, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QualityCheckEntry {
  id: string
  entryId: string
  name: string
  vehicleNo: string
  weight: string
  timestamp: string
  status: "pending" | "processed"
  qualityData?: {
    moisture: string
    length: string
    ot: string
    rate: string
    unloadLocation: string
    processedAt: string
    processedBy: string
  }
}

const mockEntries: QualityCheckEntry[] = [
  {
    id: "QC001",
    entryId: "GE001",
    name: "Rajesh Kumar",
    vehicleNo: "HR55AB1234",
    weight: "2500 kg",
    timestamp: "2024-01-15 09:30 AM",
    status: "pending",
  },
  {
    id: "QC002",
    entryId: "GE003",
    name: "Amit Singh",
    vehicleNo: "HR12XY9876",
    weight: "3100 kg",
    timestamp: "2024-01-15 08:45 AM",
    status: "pending",
  },
  {
    id: "QC003",
    entryId: "GE002",
    name: "Suresh Patel",
    vehicleNo: "HR12CD5678",
    weight: "3200 kg",
    timestamp: "2024-01-15 08:15 AM",
    status: "processed",
    qualityData: {
      moisture: "12.5%",
      length: "28mm",
      ot: "Grade A",
      rate: "₹5,200/quintal",
      unloadLocation: "Warehouse A-1",
      processedAt: "2024-01-15 10:30 AM",
      processedBy: "Quality Inspector 1",
    },
  },
]

export default function QualityCheckPage() {
  const [entries, setEntries] = useState<QualityCheckEntry[]>(mockEntries)
  const [selectedEntry, setSelectedEntry] = useState<QualityCheckEntry | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [qualityForm, setQualityForm] = useState({
    moisture: "",
    length: "",
    ot: "",
    rate: "",
    unloadLocation: "",
  })
  const { toast } = useToast()

  const handleProcessEntry = (entry: QualityCheckEntry) => {
    setSelectedEntry(entry)
    setQualityForm({
      moisture: "",
      length: "",
      ot: "",
      rate: "",
      unloadLocation: "",
    })
    setIsProcessing(true)
  }

  const handleSubmitQualityCheck = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEntry) return

    const updatedEntries = entries.map((entry) =>
      entry.id === selectedEntry.id
        ? {
            ...entry,
            status: "processed" as const,
            qualityData: {
              ...qualityForm,
              moisture: `${qualityForm.moisture}%`,
              length: `${qualityForm.length}mm`,
              rate: `₹${qualityForm.rate}/quintal`,
              processedAt: new Date().toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              processedBy: "Quality Inspector 1",
            },
          }
        : entry,
    )

    setEntries(updatedEntries)
    setIsProcessing(false)
    setSelectedEntry(null)

    toast({
      title: "Quality Check Completed",
      description: `Entry ${selectedEntry.id} has been processed successfully.`,
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quality Check</h1>
            <p className="text-muted-foreground">Process and validate material quality parameters</p>
          </div>

          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Quality Checks
                  </CardTitle>
                  <CardDescription>Entries awaiting quality inspection and processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>QC ID</TableHead>
                          <TableHead>Entry ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Vehicle No.</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Entry Time</TableHead>
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
                              <TableCell>{entry.entryId}</TableCell>
                              <TableCell>{entry.name}</TableCell>
                              <TableCell>{entry.vehicleNo}</TableCell>
                              <TableCell>{entry.weight}</TableCell>
                              <TableCell>{entry.timestamp}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="gap-1">
                                  <Clock className="h-3 w-3" />
                                  {entry.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleProcessEntry(entry)} className="gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    Process
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="md:hidden space-y-4">
                    {entries
                      .filter((entry) => entry.status === "pending")
                      .map((entry) => (
                        <Card key={entry.id} className="bg-background border-border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-foreground">{entry.id}</h3>
                                <p className="text-sm text-foreground/70">{entry.name}</p>
                              </div>
                              <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {entry.status}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Entry ID:</span>
                                <span className="text-foreground">{entry.entryId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Vehicle:</span>
                                <span className="text-foreground">{entry.vehicleNo}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Weight:</span>
                                <span className="text-foreground">{entry.weight}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Entry Time:</span>
                                <span className="text-foreground">{entry.timestamp}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" onClick={() => handleProcessEntry(entry)} className="flex-1 gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Process
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Quality Check History
                  </CardTitle>
                  <CardDescription>All completed quality inspections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>QC ID</TableHead>
                          <TableHead>Entry ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Vehicle No.</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Moisture</TableHead>
                          <TableHead>Length</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Processed At</TableHead>
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
                              <TableCell>{entry.entryId}</TableCell>
                              <TableCell>{entry.name}</TableCell>
                              <TableCell>{entry.vehicleNo}</TableCell>
                              <TableCell>{entry.weight}</TableCell>
                              <TableCell>{entry.qualityData?.moisture}</TableCell>
                              <TableCell>{entry.qualityData?.length}</TableCell>
                              <TableCell>
                                <Badge variant="default">{entry.qualityData?.ot}</Badge>
                              </TableCell>
                              <TableCell>{entry.qualityData?.rate}</TableCell>
                              <TableCell>{entry.qualityData?.processedAt}</TableCell>
                              <TableCell>
                                <Badge variant="default" className="gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  {entry.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="md:hidden space-y-4">
                    {entries
                      .filter((entry) => entry.status === "processed")
                      .map((entry) => (
                        <Card key={entry.id} className="bg-background border-border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-foreground">{entry.id}</h3>
                                <p className="text-sm text-foreground/70">{entry.name}</p>
                              </div>
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {entry.status}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Entry ID:</span>
                                <span className="text-foreground">{entry.entryId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Vehicle:</span>
                                <span className="text-foreground">{entry.vehicleNo}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Weight:</span>
                                <span className="text-foreground">{entry.weight}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Grade:</span>
                                <Badge variant="default" className="text-xs">
                                  {entry.qualityData?.ot}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Moisture:</span>
                                <span className="text-foreground">{entry.qualityData?.moisture}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Length:</span>
                                <span className="text-foreground">{entry.qualityData?.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Rate:</span>
                                <span className="text-foreground">{entry.qualityData?.rate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-foreground/60">Processed:</span>
                                <span className="text-foreground">{entry.qualityData?.processedAt}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                <FileText className="h-4 w-4 mr-1" />
                                Report
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Quality Check Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={setIsProcessing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Process Quality Check</DialogTitle>
            <DialogDescription>
              Enter quality parameters for Entry {selectedEntry?.entryId} - {selectedEntry?.name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitQualityCheck} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moisture" className="text-foreground">
                  Moisture Content (%) *
                </Label>
                <Input
                  id="moisture"
                  type="number"
                  step="0.1"
                  value={qualityForm.moisture}
                  onChange={(e) => setQualityForm({ ...qualityForm, moisture: e.target.value })}
                  placeholder="e.g., 12.5"
                  required
                  className="text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length" className="text-foreground">
                  Fiber Length (mm) *
                </Label>
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  value={qualityForm.length}
                  onChange={(e) => setQualityForm({ ...qualityForm, length: e.target.value })}
                  placeholder="e.g., 28"
                  required
                  className="text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ot" className="text-foreground">
                  Grade/OT *
                </Label>
                <Select value={qualityForm.ot} onValueChange={(value) => setQualityForm({ ...qualityForm, ot: value })}>
                  <SelectTrigger className="text-foreground">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade A">Grade A</SelectItem>
                    <SelectItem value="Grade B">Grade B</SelectItem>
                    <SelectItem value="Grade C">Grade C</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate" className="text-foreground">
                  Rate (₹/quintal) *
                </Label>
                <Input
                  id="rate"
                  type="number"
                  value={qualityForm.rate}
                  onChange={(e) => setQualityForm({ ...qualityForm, rate: e.target.value })}
                  placeholder="e.g., 5200"
                  required
                  className="text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unloadLocation" className="text-foreground">
                Unload Location *
              </Label>
              <Select
                value={qualityForm.unloadLocation}
                onValueChange={(value) => setQualityForm({ ...qualityForm, unloadLocation: value })}
              >
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Select unload location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Warehouse A-1">Warehouse A-1</SelectItem>
                  <SelectItem value="Warehouse A-2">Warehouse A-2</SelectItem>
                  <SelectItem value="Warehouse B-1">Warehouse B-1</SelectItem>
                  <SelectItem value="Warehouse B-2">Warehouse B-2</SelectItem>
                  <SelectItem value="Processing Unit 1">Processing Unit 1</SelectItem>
                  <SelectItem value="Processing Unit 2">Processing Unit 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">Complete Quality Check</Button>
              <Button type="button" variant="outline" onClick={() => setIsProcessing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
