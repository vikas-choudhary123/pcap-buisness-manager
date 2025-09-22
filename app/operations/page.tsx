"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Settings, CheckCircle, AlertTriangle, XCircle, Wrench } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Machine {
  id: string
  name: string
  type: string
  status: "working" | "not-working" | "maintenance"
  efficiency: string
  lastUpdated: string
  operator?: string
  remarks?: string
}

const mockMachines: Machine[] = [
  {
    id: "M001",
    name: "Cotton Gin #1",
    type: "Ginning",
    status: "working",
    efficiency: "98%",
    lastUpdated: "2024-01-15 09:30 AM",
    operator: "Operator A",
  },
  {
    id: "M002",
    name: "Cotton Gin #2",
    type: "Ginning",
    status: "working",
    efficiency: "95%",
    lastUpdated: "2024-01-15 09:30 AM",
    operator: "Operator B",
  },
  {
    id: "M003",
    name: "Oil Extractor #1",
    type: "Oil Processing",
    status: "maintenance",
    efficiency: "0%",
    lastUpdated: "2024-01-15 08:00 AM",
    remarks: "Scheduled maintenance - bearing replacement",
  },
  {
    id: "M004",
    name: "Seed Cleaner #1",
    type: "Cleaning",
    status: "working",
    efficiency: "92%",
    lastUpdated: "2024-01-15 09:30 AM",
    operator: "Operator C",
  },
  {
    id: "M005",
    name: "Baling Machine #1",
    type: "Baling",
    status: "not-working",
    efficiency: "0%",
    lastUpdated: "2024-01-15 07:45 AM",
    remarks: "Motor failure - awaiting repair",
  },
]

export default function OperationsPage() {
  const [machines, setMachines] = useState<Machine[]>(mockMachines)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    status: "",
    operator: "",
    remarks: "",
  })
  const { toast } = useToast()

  const handleUpdateMachine = (machine: Machine) => {
    setSelectedMachine(machine)
    setUpdateForm({
      status: machine.status,
      operator: machine.operator || "",
      remarks: machine.remarks || "",
    })
    setIsUpdating(true)
  }

  const handleSubmitUpdate = () => {
    if (!selectedMachine) return

    const updatedMachines = machines.map((machine) =>
      machine.id === selectedMachine.id
        ? {
            ...machine,
            status: updateForm.status as "working" | "not-working" | "maintenance",
            operator: updateForm.operator,
            remarks: updateForm.remarks,
            efficiency: updateForm.status === "working" ? "95%" : "0%",
            lastUpdated: new Date().toLocaleString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          }
        : machine,
    )

    setMachines(updatedMachines)
    setIsUpdating(false)
    setSelectedMachine(null)

    toast({
      title: "Machine Status Updated",
      description: `${selectedMachine.name} status has been updated successfully.`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "working":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "maintenance":
        return <Wrench className="h-4 w-4 text-yellow-500" />
      case "not-working":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "working":
        return <Badge variant="default">Working</Badge>
      case "maintenance":
        return <Badge variant="secondary">Maintenance</Badge>
      case "not-working":
        return <Badge variant="destructive">Not Working</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const workingMachines = machines.filter((m) => m.status === "working").length
  const maintenanceMachines = machines.filter((m) => m.status === "maintenance").length
  const notWorkingMachines = machines.filter((m) => m.status === "not-working").length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Operations</h1>
            <p className="text-muted-foreground">Monitor and manage machine operations status</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Total Machines</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{machines.length}</div>
                <p className="text-xs text-muted-foreground">Registered machines</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Working</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{workingMachines}</div>
                <p className="text-xs text-muted-foreground">Currently operational</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Maintenance</CardTitle>
                <Wrench className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{maintenanceMachines}</div>
                <p className="text-xs text-muted-foreground">Under maintenance</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Not Working</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{notWorkingMachines}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Machine Status Overview
              </CardTitle>
              <CardDescription>Current operational status of all machines</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine ID</TableHead>
                    <TableHead>Machine Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machines.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell className="font-medium">{machine.id}</TableCell>
                      <TableCell>{machine.name}</TableCell>
                      <TableCell>{machine.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(machine.status)}
                          {getStatusBadge(machine.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            machine.efficiency === "0%"
                              ? "text-red-600"
                              : Number.parseInt(machine.efficiency) > 95
                                ? "text-green-600"
                                : "text-yellow-600"
                          }
                        >
                          {machine.efficiency}
                        </span>
                      </TableCell>
                      <TableCell>{machine.operator || "-"}</TableCell>
                      <TableCell>{machine.lastUpdated}</TableCell>
                      <TableCell className="max-w-xs truncate">{machine.remarks || "-"}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleUpdateMachine(machine)} className="gap-1">
                          <Settings className="h-4 w-4" />
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Machine Update Dialog */}
      <Dialog open={isUpdating} onOpenChange={setIsUpdating}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Machine Status</DialogTitle>
            <DialogDescription>Update the operational status for {selectedMachine?.name}</DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Machine:</span>
                <p className="font-medium">{selectedMachine?.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <p className="font-medium">{selectedMachine?.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Status:</span>
                <p className="font-medium">{selectedMachine?.status}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Efficiency:</span>
                <p className="font-medium">{selectedMachine?.efficiency}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Machine Status *</Label>
              <Select
                value={updateForm.status}
                onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select machine status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="working">Working</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="not-working">Not Working</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {updateForm.status === "working" && (
              <div className="space-y-2">
                <Label htmlFor="operator">Operator Name</Label>
                <Select
                  value={updateForm.operator}
                  onValueChange={(value) => setUpdateForm({ ...updateForm, operator: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operator A">Operator A</SelectItem>
                    <SelectItem value="Operator B">Operator B</SelectItem>
                    <SelectItem value="Operator C">Operator C</SelectItem>
                    <SelectItem value="Operator D">Operator D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={updateForm.remarks}
                onChange={(e) => setUpdateForm({ ...updateForm, remarks: e.target.value })}
                placeholder="Enter any remarks or notes about the machine status"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSubmitUpdate} className="gap-2" disabled={!updateForm.status}>
                <Settings className="h-4 w-4" />
                Update Status
              </Button>
              <Button variant="outline" onClick={() => setIsUpdating(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
