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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Users, Clock, Plus, Eye, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LaborEntry {
  id: string
  name: string
  employeeId: string
  timeIn: string
  timeOut?: string
  location: string
  task: string
  hours: string
  date: string
  status: "present" | "absent" | "half-day"
  remarks?: string
}

const mockEntries: LaborEntry[] = [
  {
    id: "LAB001",
    name: "Ramesh Kumar",
    employeeId: "EMP001",
    timeIn: "08:00 AM",
    timeOut: "06:00 PM",
    location: "Cotton Ginning Unit",
    task: "Machine Operation",
    hours: "10",
    date: "2024-01-15",
    status: "present",
  },
  {
    id: "LAB002",
    name: "Suresh Singh",
    employeeId: "EMP002",
    timeIn: "08:30 AM",
    timeOut: "06:30 PM",
    location: "Quality Check Section",
    task: "Quality Inspection",
    hours: "10",
    date: "2024-01-15",
    status: "present",
  },
  {
    id: "LAB003",
    name: "Mohan Lal",
    employeeId: "EMP003",
    timeIn: "09:00 AM",
    timeOut: "01:00 PM",
    location: "Warehouse",
    task: "Material Handling",
    hours: "4",
    date: "2024-01-15",
    status: "half-day",
    remarks: "Medical appointment",
  },
  {
    id: "LAB004",
    name: "Vijay Sharma",
    employeeId: "EMP004",
    timeIn: "-",
    location: "Oil Processing Unit",
    task: "Machine Maintenance",
    hours: "0",
    date: "2024-01-15",
    status: "absent",
    remarks: "Sick leave",
  },
]

export default function LaborPage() {
  const [entries, setEntries] = useState<LaborEntry[]>(mockEntries)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    timeIn: "",
    timeOut: "",
    location: "",
    task: "",
    status: "",
    remarks: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const hours = formData.timeOut
      ? calculateHours(formData.timeIn, formData.timeOut)
      : formData.status === "absent"
        ? "0"
        : "4"

    const newEntry: LaborEntry = {
      id: `LAB${String(entries.length + 1).padStart(3, "0")}`,
      name: formData.name,
      employeeId: formData.employeeId,
      timeIn: formData.timeIn || "-",
      timeOut: formData.timeOut,
      location: formData.location,
      task: formData.task,
      hours,
      date: new Date().toISOString().split("T")[0],
      status: formData.status as "present" | "absent" | "half-day",
      remarks: formData.remarks,
    }

    setEntries([newEntry, ...entries])
    setFormData({
      name: "",
      employeeId: "",
      timeIn: "",
      timeOut: "",
      location: "",
      task: "",
      status: "",
      remarks: "",
    })
    setShowForm(false)

    toast({
      title: "Labor Entry Added",
      description: `Entry for ${newEntry.name} has been recorded successfully.`,
    })
  }

  const calculateHours = (timeIn: string, timeOut: string) => {
    // Simple hour calculation (in real app, use proper date/time library)
    const inHour = Number.parseInt(timeIn.split(":")[0])
    const outHour = Number.parseInt(timeOut.split(":")[0])
    return Math.max(0, outHour - inHour).toString()
  }

  const presentCount = entries.filter((e) => e.status === "present").length
  const absentCount = entries.filter((e) => e.status === "absent").length
  const halfDayCount = entries.filter((e) => e.status === "half-day").length
  const totalHours = entries.reduce((sum, entry) => sum + Number.parseInt(entry.hours), 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Labor Management</h1>
              <p className="text-muted-foreground">Track daily labor attendance and work assignments</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Present Today</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                <p className="text-xs text-muted-foreground">Workers present</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Absent</CardTitle>
                <Users className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                <p className="text-xs text-muted-foreground">Workers absent</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Half Day</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{halfDayCount}</div>
                <p className="text-xs text-muted-foreground">Half day workers</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Total Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{totalHours}</div>
                <p className="text-xs text-muted-foreground">Hours worked today</p>
              </CardContent>
            </Card>
          </div>

          {showForm && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">New Labor Entry</CardTitle>
                <CardDescription>Record daily labor attendance and work details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Worker Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter worker name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        placeholder="e.g., EMP001"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeIn">Time In</Label>
                      <Input
                        id="timeIn"
                        type="time"
                        value={formData.timeIn}
                        onChange={(e) => setFormData({ ...formData, timeIn: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeOut">Time Out</Label>
                      <Input
                        id="timeOut"
                        type="time"
                        value={formData.timeOut}
                        onChange={(e) => setFormData({ ...formData, timeOut: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Work Location *</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => setFormData({ ...formData, location: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select work location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cotton Ginning Unit">Cotton Ginning Unit</SelectItem>
                          <SelectItem value="Oil Processing Unit">Oil Processing Unit</SelectItem>
                          <SelectItem value="Quality Check Section">Quality Check Section</SelectItem>
                          <SelectItem value="Warehouse">Warehouse</SelectItem>
                          <SelectItem value="Maintenance Shop">Maintenance Shop</SelectItem>
                          <SelectItem value="Administrative Office">Administrative Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task">Task/Assignment *</Label>
                      <Select
                        value={formData.task}
                        onValueChange={(value) => setFormData({ ...formData, task: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select task" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Machine Operation">Machine Operation</SelectItem>
                          <SelectItem value="Quality Inspection">Quality Inspection</SelectItem>
                          <SelectItem value="Material Handling">Material Handling</SelectItem>
                          <SelectItem value="Machine Maintenance">Machine Maintenance</SelectItem>
                          <SelectItem value="Cleaning & Housekeeping">Cleaning & Housekeeping</SelectItem>
                          <SelectItem value="Administrative Work">Administrative Work</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Attendance Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select attendance status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="half-day">Half Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Textarea
                      id="remarks"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Enter any additional notes or remarks"
                      rows={3}
                    />
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

          <Tabs defaultValue="today" className="space-y-4">
            <TabsList>
              <TabsTrigger value="today">Today's Attendance</TabsTrigger>
              <TabsTrigger value="history">Attendance History</TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Today's Labor Attendance
                  </CardTitle>
                  <CardDescription>Current day attendance and work assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Time In</TableHead>
                        <TableHead>Time Out</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.employeeId}</TableCell>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>{entry.timeIn}</TableCell>
                          <TableCell>{entry.timeOut || "-"}</TableCell>
                          <TableCell>{entry.location}</TableCell>
                          <TableCell>{entry.task}</TableCell>
                          <TableCell>{entry.hours}h</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                entry.status === "present"
                                  ? "default"
                                  : entry.status === "half-day"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {entry.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{entry.remarks || "-"}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
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
                    <Clock className="h-5 w-5" />
                    Attendance History
                  </CardTitle>
                  <CardDescription>Historical labor attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Historical attendance data will be displayed here</p>
                    <p className="text-sm">Filter by date range, employee, or department</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
