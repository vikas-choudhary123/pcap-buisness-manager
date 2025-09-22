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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Clock, CheckCircle, Eye, IndianRupee, Banknote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentEntry {
  id: string
  billNo: string
  entryId: string
  name: string
  vehicleNo: string
  totalAmount: string
  approvedAt: string
  approvedBy: string
  timestamp: string
  status: "pending" | "paid" | "partial"
  paymentData?: {
    paymentMethod: string
    paidAmount: string
    paymentDate: string
    transactionId?: string
    chequeNo?: string
    bankName?: string
    remarks?: string
    paidBy: string
  }
}

const mockEntries: PaymentEntry[] = [
  {
    id: "PAY001",
    billNo: "BG-2024-001",
    entryId: "GE001",
    name: "Rajesh Kumar",
    vehicleNo: "HR55AB1234",
    totalAmount: "₹1,52,172.80",
    approvedAt: "2024-01-15 01:15 PM",
    approvedBy: "Manager - Operations",
    timestamp: "2024-01-15 01:15 PM",
    status: "pending",
  },
  {
    id: "PAY002",
    billNo: "BG-2024-005",
    entryId: "GE006",
    name: "Ramesh Singh",
    vehicleNo: "HR66UV3456",
    totalAmount: "₹1,78,240",
    approvedAt: "2024-01-15 02:30 PM",
    approvedBy: "Manager - Operations",
    timestamp: "2024-01-15 02:30 PM",
    status: "pending",
  },
  {
    id: "PAY003",
    billNo: "BG-2024-002",
    entryId: "GE003",
    name: "Amit Kumar",
    vehicleNo: "HR77XY9012",
    totalAmount: "₹1,35,680",
    approvedAt: "2024-01-14 04:45 PM",
    approvedBy: "Manager - Operations",
    timestamp: "2024-01-14 04:45 PM",
    status: "paid",
    paymentData: {
      paymentMethod: "Bank Transfer",
      paidAmount: "₹1,35,680",
      paymentDate: "2024-01-15 10:30 AM",
      transactionId: "TXN123456789",
      bankName: "State Bank of India",
      remarks: "Full payment completed",
      paidBy: "Cashier - Finance",
    },
  },
]

export default function PaymentPage() {
  const [entries, setEntries] = useState<PaymentEntry[]>(mockEntries)
  const [selectedEntry, setSelectedEntry] = useState<PaymentEntry | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "",
    paidAmount: "",
    transactionId: "",
    chequeNo: "",
    bankName: "",
    remarks: "",
  })
  const { toast } = useToast()

  const handleProcessPayment = (entry: PaymentEntry) => {
    setSelectedEntry(entry)
    setPaymentForm({
      paymentMethod: "",
      paidAmount: entry.totalAmount.replace("₹", "").replace(",", ""),
      transactionId: "",
      chequeNo: "",
      bankName: "",
      remarks: "",
    })
    setIsProcessing(true)
  }

  const handleSubmitPayment = () => {
    if (!selectedEntry || !paymentForm.paymentMethod || !paymentForm.paidAmount) return

    const paidAmountNum = Number.parseFloat(paymentForm.paidAmount.replace(",", ""))
    const totalAmountNum = Number.parseFloat(selectedEntry.totalAmount.replace("₹", "").replace(",", ""))

    const paymentStatus = paidAmountNum >= totalAmountNum ? "paid" : "partial"

    const updatedEntries = entries.map((entry) =>
      entry.id === selectedEntry.id
        ? {
            ...entry,
            status: paymentStatus as "paid" | "partial",
            paymentData: {
              paymentMethod: paymentForm.paymentMethod,
              paidAmount: `₹${Number.parseFloat(paymentForm.paidAmount).toLocaleString("en-IN")}`,
              paymentDate: new Date().toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              transactionId: paymentForm.transactionId,
              chequeNo: paymentForm.chequeNo,
              bankName: paymentForm.bankName,
              remarks: paymentForm.remarks,
              paidBy: "Cashier - Finance",
            },
          }
        : entry,
    )

    setEntries(updatedEntries)
    setIsProcessing(false)
    setSelectedEntry(null)

    toast({
      title: "Payment Processed",
      description: `Payment for Bill ${selectedEntry.billNo} has been processed successfully.`,
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment</h1>
            <p className="text-muted-foreground">Process payments for approved bills</p>
          </div>

          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending Payments</TabsTrigger>
              <TabsTrigger value="paid">Completed Payments</TabsTrigger>
              <TabsTrigger value="partial">Partial Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Payments
                  </CardTitle>
                  <CardDescription>Approved bills awaiting payment processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill No.</TableHead>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Vehicle No.</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Approved By</TableHead>
                        <TableHead>Approved At</TableHead>
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
                            <TableCell className="font-medium text-green-600">{entry.totalAmount}</TableCell>
                            <TableCell>{entry.approvedBy}</TableCell>
                            <TableCell>{entry.approvedAt}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {entry.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleProcessPayment(entry)} className="gap-1">
                                  <CreditCard className="h-4 w-4" />
                                  Pay
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

            <TabsContent value="paid">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Completed Payments
                  </CardTitle>
                  <CardDescription>All successfully completed payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Paid Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((entry) => entry.status === "paid")
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.billNo}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell className="font-medium">{entry.totalAmount}</TableCell>
                            <TableCell className="font-medium text-green-600">
                              {entry.paymentData?.paidAmount}
                            </TableCell>
                            <TableCell>{entry.paymentData?.paymentMethod}</TableCell>
                            <TableCell className="font-mono text-sm">{entry.paymentData?.transactionId}</TableCell>
                            <TableCell>{entry.paymentData?.paymentDate}</TableCell>
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
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partial">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
                    Partial Payments
                  </CardTitle>
                  <CardDescription>Bills with partial payments requiring follow-up</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Paid Amount</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries
                        .filter((entry) => entry.status === "partial")
                        .map((entry) => {
                          const totalAmount = Number.parseFloat(entry.totalAmount.replace("₹", "").replace(",", ""))
                          const paidAmount = Number.parseFloat(
                            entry.paymentData?.paidAmount?.replace("₹", "").replace(",", "") || "0",
                          )
                          const remaining = totalAmount - paidAmount

                          return (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">{entry.billNo}</TableCell>
                              <TableCell>{entry.name}</TableCell>
                              <TableCell className="font-medium">{entry.totalAmount}</TableCell>
                              <TableCell className="font-medium text-blue-600">
                                {entry.paymentData?.paidAmount}
                              </TableCell>
                              <TableCell className="font-medium text-red-600">
                                ₹{remaining.toLocaleString("en-IN")}
                              </TableCell>
                              <TableCell>{entry.paymentData?.paymentDate}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="gap-1">
                                  <IndianRupee className="h-3 w-3" />
                                  {entry.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleProcessPayment(entry)} className="gap-1">
                                    <CreditCard className="h-4 w-4" />
                                    Pay Balance
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Pending Payments</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {entries.filter((e) => e.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Completed Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {entries.filter((e) => e.status === "paid").length}
                </div>
                <p className="text-xs text-muted-foreground">Payments processed</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Total Paid</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">₹1,35,680</div>
                <p className="text-xs text-muted-foreground">Today's payments</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Pending Amount</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">₹3,30,413</div>
                <p className="text-xs text-muted-foreground">To be paid</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Payment Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={setIsProcessing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Process payment for Bill {selectedEntry?.billNo} - {selectedEntry?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Amount:</span>
                <p className="font-medium text-green-600">{selectedEntry?.totalAmount}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Approved By:</span>
                <p className="font-medium">{selectedEntry?.approvedBy}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Vehicle:</span>
                <p className="font-medium">{selectedEntry?.vehicleNo}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Approved At:</span>
                <p className="font-medium">{selectedEntry?.approvedAt}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select
                  value={paymentForm.paymentMethod}
                  onValueChange={(value) => setPaymentForm({ ...paymentForm, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="RTGS/NEFT">RTGS/NEFT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paidAmount">Paid Amount (₹) *</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  value={paymentForm.paidAmount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paidAmount: e.target.value })}
                  placeholder="Enter paid amount"
                  required
                />
              </div>
            </div>

            {(paymentForm.paymentMethod === "Bank Transfer" ||
              paymentForm.paymentMethod === "UPI" ||
              paymentForm.paymentMethod === "RTGS/NEFT") && (
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                  placeholder="Enter transaction ID"
                />
              </div>
            )}

            {paymentForm.paymentMethod === "Cheque" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chequeNo">Cheque Number</Label>
                  <Input
                    id="chequeNo"
                    value={paymentForm.chequeNo}
                    onChange={(e) => setPaymentForm({ ...paymentForm, chequeNo: e.target.value })}
                    placeholder="Enter cheque number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={paymentForm.bankName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                    placeholder="Enter bank name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="remarks">Payment Remarks</Label>
              <Textarea
                id="remarks"
                value={paymentForm.remarks}
                onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                placeholder="Enter any payment notes or remarks"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSubmitPayment}
                className="gap-2"
                disabled={!paymentForm.paymentMethod || !paymentForm.paidAmount}
              >
                <CreditCard className="h-4 w-4" />
                Process Payment
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
