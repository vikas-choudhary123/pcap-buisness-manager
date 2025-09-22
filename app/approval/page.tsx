"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { CheckSquare, Clock, CheckCircle, Eye, FileText, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApprovalEntry {
  id: string
  billNo: string
  entryId: string
  name: string
  vehicleNo: string
  netWeight: string
  grade: string
  totalAmount: string
  billGeneratedAt: string
  timestamp: string
  status: "pending" | "approved" | "rejected"
  approvalData?: {
    approvedBy: string
    approvedAt: string
    remarks?: string
    rejectionReason?: string
  }
}

const mockEntries: ApprovalEntry[] = [
  {
    id: "APP001",
    billNo: "BG-2024-003",
    entryId: "GE002",
    name: "Suresh Patel",
    vehicleNo: "HR12CD5678",
    netWeight: "3180 kg",
    grade: "Grade A",
    totalAmount: "₹1,95,124.80",
    billGeneratedAt: "2024-01-15 12:30 PM",
    timestamp: "2024-01-15 12:30 PM",
    status: "pending",
  },
  {
    id: "APP002",
    billNo: "BG-2024-004",
    entryId: "GE005",
    name: "Mohan Kumar",
    vehicleNo: "HR44ST7890",
    netWeight: "2950 kg",
    grade: "Grade B",
    totalAmount: "₹1,41,600",
    billGeneratedAt: "2024-01-15 11:45 AM",
    timestamp: "2024-01-15 11:45 AM",
    status: "pending",
  },
  {
    id: "APP003",
    billNo: "BG-2024-001",
    entryId: "GE001",
    name: "Rajesh Kumar",
    vehicleNo: "HR55AB1234",
    netWeight: "2480 kg",
    grade: "Grade A",
    totalAmount: "₹1,52,172.80",
    billGeneratedAt: "2024-01-15 10:30 AM",
    timestamp: "2024-01-15 10:30 AM",
    status: "approved",
    approvalData: {
      approvedBy: "Manager - Operations",
      approvedAt: "2024-01-15 01:15 PM",
      remarks: "All documents verified. Approved for payment.",
    },
  },
]

export default function ApprovalPage() {
  const [entries, setEntries] = useState<ApprovalEntry[]>(mockEntries)
  const [selectedEntry, setSelectedEntry] = useState<ApprovalEntry | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [approvalForm, setApprovalForm] = useState({
    approvedBy: "",
    remarks: "",
    rejectionReason: "",
  })
  const { toast } = useToast()

  const handleProcessEntry = (entry: ApprovalEntry) => {
    setSelectedEntry(entry)
    setApprovalForm({
      approvedBy: "",
      remarks: "",
      rejectionReason: "",
    })
    setIsProcessing(true)
  }

  const handleApprove = () => {
    if (!selectedEntry || !approvalForm.approvedBy) return

    const updatedEntries = entries.map((entry) =>
      entry.id === selectedEntry.id
        ? {
            ...entry,
            status: "approved" as const,
            approvalData: {
              approvedBy: approvalForm.approvedBy,
              approvedAt: new Date().toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              remarks: approvalForm.remarks,
            },
          }
        : entry,
    )

    setEntries(updatedEntries)
    setIsProcessing(false)
    setSelectedEntry(null)

    toast({
      title: "Bill Approved",
      description: `Bill ${selectedEntry.billNo} has been approved successfully.`,
    })
  }

  const handleReject = () => {
    if (!selectedEntry || !approvalForm.rejectionReason) return

    const updatedEntries = entries.map((entry) =>
      entry.id === selectedEntry.id
        ? {
            ...entry,
            status: "rejected" as const,
            approvalData: {
              approvedBy: approvalForm.approvedBy || "System",
              approvedAt: new Date().toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              rejectionReason: approvalForm.rejectionReason,
            },
          }
        : entry,
    )

    setEntries(updatedEntries)
    setIsProcessing(false)
    setSelectedEntry(null)

    toast({
      title: "Bill Rejected",
      description: `Bill ${selectedEntry.billNo} has been rejected.`,
      variant: "destructive",
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Approval</h1>
            <p className="text-muted-foreground">Review and approve generated bills</p>
          </div>

          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription>Bills awaiting management approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill No.</TableHead>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Vehicle No.</TableHead>
                        <TableHead>Net Weight</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Generated At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((entry) => entry.status === "pending")
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.billNo}</TableCell>
                            <TableCell>{entry.entryId}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell>{entry.vehicleNo}</TableCell>
                            <TableCell>{entry.netWeight}</TableCell>
                            <TableCell>
                              <Badge variant="default">{entry.grade}</Badge>
                            </TableCell>
                            <TableCell className="font-medium text-green-600">{entry.totalAmount}</TableCell>
                            <TableCell>{entry.billGeneratedAt}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {entry.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleProcessEntry(entry)} className="gap-1">
                                  <CheckSquare className="h-4 w-4" />
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

            <TabsContent value="approved">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Approved Bills
                  </CardTitle>
                  <CardDescription>Bills approved and ready for payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill No.</TableHead>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Approved By</TableHead>
                        <TableHead>Approved At</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((entry) => entry.status === "approved")
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.billNo}</TableCell>
                            <TableCell>{entry.entryId}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell className="font-medium text-green-600">{entry.totalAmount}</TableCell>
                            <TableCell>{entry.approvalData?.approvedBy}</TableCell>
                            <TableCell>{entry.approvalData?.approvedAt}</TableCell>
                            <TableCell className="max-w-xs truncate">{entry.approvalData?.remarks}</TableCell>
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rejected">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    Rejected Bills
                  </CardTitle>
                  <CardDescription>Bills that were rejected during approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill No.</TableHead>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Rejected At</TableHead>
                        <TableHead>Rejection Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((entry) => entry.status === "rejected")
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.billNo}</TableCell>
                            <TableCell>{entry.entryId}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell className="font-medium text-red-600">{entry.totalAmount}</TableCell>
                            <TableCell>{entry.approvalData?.approvedAt}</TableCell>
                            <TableCell className="max-w-xs truncate">{entry.approvalData?.rejectionReason}</TableCell>
                            <TableCell>
                              <Badge variant="destructive" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                {entry.status}
                              </Badge>
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

      {/* Approval Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={setIsProcessing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Process Approval</DialogTitle>
            <DialogDescription>
              Review and approve/reject Bill {selectedEntry?.billNo} for {selectedEntry?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Bill Amount:</span>
                <p className="font-medium text-green-600">{selectedEntry?.totalAmount}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Grade:</span>
                <p className="font-medium">{selectedEntry?.grade}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Net Weight:</span>
                <p className="font-medium">{selectedEntry?.netWeight}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Vehicle:</span>
                <p className="font-medium">{selectedEntry?.vehicleNo}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="approvedBy">Approved/Reviewed By *</Label>
              <Input
                id="approvedBy"
                value={approvalForm.approvedBy}
                onChange={(e) => setApprovalForm({ ...approvalForm, approvedBy: e.target.value })}
                placeholder="Enter your name/designation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Approval Remarks</Label>
              <Textarea
                id="remarks"
                value={approvalForm.remarks}
                onChange={(e) => setApprovalForm({ ...approvalForm, remarks: e.target.value })}
                placeholder="Enter any remarks or notes for approval"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
              <Textarea
                id="rejectionReason"
                value={approvalForm.rejectionReason}
                onChange={(e) => setApprovalForm({ ...approvalForm, rejectionReason: e.target.value })}
                placeholder="Enter reason for rejection"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleApprove} className="gap-2" disabled={!approvalForm.approvedBy}>
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                className="gap-2"
                disabled={!approvalForm.rejectionReason}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button variant="outline" onClick={() => setIsProcessing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
