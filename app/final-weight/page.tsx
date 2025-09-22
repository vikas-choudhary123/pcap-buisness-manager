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
import { Scale, Clock, CheckCircle, Eye, Calculator, TrendingUp, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FinalWeightEntry {
  id: string
  entryId: string
  qcId: string
  name: string
  vehicleNo: string
  initialWeight: string
  unloadLocation: string
  grade: string
  timestamp: string
  status: "pending" | "processed"
  finalWeightData?: {
    finalWeight: string
    netWeight: string
    weightDifference: string
    processedAt: string
    processedBy: string
    tareWeight?: string
  }
}

const mockEntries: FinalWeightEntry[] = [
  {
    id: "FW001",
    entryId: "GE001",
    qcId: "QC001",
    name: "Rajesh Kumar",
    vehicleNo: "HR55AB1234",
    initialWeight: "2500 kg",
    unloadLocation: "Warehouse A-1",
    grade: "Grade A",
    timestamp: "2024-01-15 10:30 AM",
    status: "pending",
  },
  {
    id: "FW002",
    entryId: "GE004",
    qcId: "QC004",
    name: "Vikram Sharma",
    vehicleNo: "HR33PQ4567",
    initialWeight: "2800 kg",
    unloadLocation: "Warehouse B-1",
    grade: "Grade B",
    timestamp: "2024-01-15 09:45 AM",
    status: "pending",
  },
  {
    id: "FW003",
    entryId: "GE002",
    qcId: "QC002",
    name: "Suresh Patel",
    vehicleNo: "HR12CD5678",
    initialWeight: "3200 kg",
    unloadLocation: "Warehouse A-1",
    grade: "Grade A",
    timestamp: "2024-01-15 08:15 AM",
    status: "processed",
    finalWeightData: {
      finalWeight: "3180 kg",
      netWeight: "3180 kg",
      weightDifference: "-20 kg",
      tareWeight: "0 kg",
      processedAt: "2024-01-15 11:30 AM",
      processedBy: "Weight Inspector 1",
    },
  },
]

export default function FinalWeightPage() {
  const [entries, setEntries] = useState<FinalWeightEntry[]>(mockEntries)
  const [selectedEntry, setSelectedEntry] = useState<FinalWeightEntry | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [weightForm, setWeightForm] = useState({
    finalWeight: "",
    tareWeight: "",
  })
  const { toast } = useToast()

  const handleProcessEntry = (entry: FinalWeightEntry) => {
    setSelectedEntry(entry)
    setWeightForm({
      finalWeight: "",
      tareWeight: "",
    })
    setIsProcessing(true)
  }

  const calculateWeightDifference = (initial: string, final: string) => {
    const initialNum = Number.parseFloat(initial.replace(" kg", ""))
    const finalNum = Number.parseFloat(final)
    const difference = finalNum - initialNum
    return difference >= 0 ? `+${difference} kg` : `${difference} kg`
  }

  const handleSubmitFinalWeight = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEntry) return

    const netWeight = weightForm.tareWeight
      ? (Number.parseFloat(weightForm.finalWeight) - Number.parseFloat(weightForm.tareWeight)).toString()
      : weightForm.finalWeight

    const weightDifference = calculateWeightDifference(selectedEntry.initialWeight, netWeight)

    const updatedEntries = entries.map((entry) =>
      entry.id === selectedEntry.id
        ? {
            ...entry,
            status: "processed" as const,
            finalWeightData: {
              finalWeight: `${weightForm.finalWeight} kg`,
              netWeight: `${netWeight} kg`,
              weightDifference,
              tareWeight: weightForm.tareWeight ? `${weightForm.tareWeight} kg` : "0 kg",
              processedAt: new Date().toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              processedBy: "Weight Inspector 1",
            },
          }
        : entry,
    )

    setEntries(updatedEntries)
    setIsProcessing(false)
    setSelectedEntry(null)

    toast({
      title: "Final Weight Recorded",
      description: `Final weight for Entry ${selectedEntry.id} has been recorded successfully.`,
    })
  }

  const getWeightTrendIcon = (difference: string) => {
    if (difference.startsWith("+")) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (difference.startsWith("-")) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    }
    return <Scale className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Final Weight</h1>
            <p className="text-muted-foreground">Record final weights after unloading and processing</p>
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
                    Pending Final Weight
                  </CardTitle>
                  <CardDescription>Entries awaiting final weight measurement</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>FW ID</TableHead>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>QC ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Vehicle No.</TableHead>
                        <TableHead>Initial Weight</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Unload Location</TableHead>
                        <TableHead>QC Time</TableHead>
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
                            <TableCell>{entry.qcId}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell>{entry.vehicleNo}</TableCell>
                            <TableCell>{entry.initialWeight}</TableCell>
                            <TableCell>
                              <Badge variant="default">{entry.grade}</Badge>
                            </TableCell>
                            <TableCell>{entry.unloadLocation}</TableCell>
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
                                  <Scale className="h-4 w-4" />
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Final Weight History
                  </CardTitle>
                  <CardDescription>All completed final weight measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>FW ID</TableHead>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Vehicle No.</TableHead>
                        <TableHead>Initial Weight</TableHead>
                        <TableHead>Final Weight</TableHead>
                        <TableHead>Net Weight</TableHead>
                        <TableHead>Difference</TableHead>
                        <TableHead>Grade</TableHead>
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
                            <TableCell>{entry.initialWeight}</TableCell>
                            <TableCell>{entry.finalWeightData?.finalWeight}</TableCell>
                            <TableCell className="font-medium">{entry.finalWeightData?.netWeight}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {getWeightTrendIcon(entry.finalWeightData?.weightDifference || "")}
                                <span
                                  className={
                                    entry.finalWeightData?.weightDifference?.startsWith("+")
                                      ? "text-green-500"
                                      : entry.finalWeightData?.weightDifference?.startsWith("-")
                                        ? "text-red-500"
                                        : ""
                                  }
                                >
                                  {entry.finalWeightData?.weightDifference}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">{entry.grade}</Badge>
                            </TableCell>
                            <TableCell>{entry.finalWeightData?.processedAt}</TableCell>
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
                                  <Calculator className="h-4 w-4" />
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

      {/* Final Weight Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={setIsProcessing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Final Weight</DialogTitle>
            <DialogDescription>
              Enter final weight measurement for Entry {selectedEntry?.entryId} - {selectedEntry?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-foreground/70">Initial Weight:</span>
                <p className="font-medium text-foreground">{selectedEntry?.initialWeight}</p>
              </div>
              <div>
                <span className="text-foreground/70">Grade:</span>
                <p className="font-medium text-foreground">{selectedEntry?.grade}</p>
              </div>
              <div>
                <span className="text-foreground/70">Vehicle:</span>
                <p className="font-medium text-foreground">{selectedEntry?.vehicleNo}</p>
              </div>
              <div>
                <span className="text-foreground/70">Location:</span>
                <p className="font-medium text-foreground">{selectedEntry?.unloadLocation}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitFinalWeight} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="finalWeight" className="text-foreground">
                Final Weight (kg) *
              </Label>
              <Input
                id="finalWeight"
                type="number"
                step="0.1"
                value={weightForm.finalWeight}
                onChange={(e) => setWeightForm({ ...weightForm, finalWeight: e.target.value })}
                placeholder="Enter final weight in kg"
                required
                className="text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tareWeight" className="text-foreground">
                Tare Weight (kg)
              </Label>
              <Input
                id="tareWeight"
                type="number"
                step="0.1"
                value={weightForm.tareWeight}
                onChange={(e) => setWeightForm({ ...weightForm, tareWeight: e.target.value })}
                placeholder="Enter tare weight if applicable"
                className="text-foreground"
              />
              <p className="text-xs text-foreground/60">Optional: Weight of container/packaging to be deducted</p>
            </div>

            {weightForm.finalWeight && (
              <div className="bg-primary/10 p-3 rounded-lg">
                <div className="text-sm space-y-1 text-foreground">
                  <div className="flex justify-between">
                    <span>Final Weight:</span>
                    <span className="font-medium">{weightForm.finalWeight} kg</span>
                  </div>
                  {weightForm.tareWeight && (
                    <div className="flex justify-between">
                      <span>Tare Weight:</span>
                      <span className="font-medium">-{weightForm.tareWeight} kg</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-1">
                    <span className="font-medium">Net Weight:</span>
                    <span className="font-bold">
                      {weightForm.tareWeight
                        ? (
                            Number.parseFloat(weightForm.finalWeight) - Number.parseFloat(weightForm.tareWeight)
                          ).toFixed(1)
                        : weightForm.finalWeight}{" "}
                      kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difference from Initial:</span>
                    <span className="font-medium">
                      {selectedEntry &&
                        calculateWeightDifference(
                          selectedEntry.initialWeight,
                          weightForm.tareWeight
                            ? (
                                Number.parseFloat(weightForm.finalWeight) - Number.parseFloat(weightForm.tareWeight)
                              ).toString()
                            : weightForm.finalWeight,
                        )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit">Record Final Weight</Button>
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
