"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Download, Eye, Printer, CheckCircle, Clock, IndianRupee } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BillEntry {
  id: string
  billNo: string
  entryId: string
  qcId: string
  fwId: string
  name: string
  vehicleNo: string
  netWeight: string
  grade: string
  rate: string
  amount: string
  gst: string
  totalAmount: string
  timestamp: string
  status: "pending" | "generated" | "approved"
  billData?: {
    generatedAt: string
    generatedBy: string
    billPath?: string
  }
}

const mockEntries: BillEntry[] = [
  {
    id: "BILL001",
    billNo: "BG-2024-001",
    entryId: "GE001",
    qcId: "QC001",
    fwId: "FW001",
    name: "Rajesh Kumar",
    vehicleNo: "HR55AB1234",
    netWeight: "2480 kg",
    grade: "Grade A",
    rate: "₹5,200",
    amount: "₹1,28,960",
    gst: "₹23,212.80",
    totalAmount: "₹1,52,172.80",
    timestamp: "2024-01-15 11:30 AM",
    status: "pending",
  },
  {
    id: "BILL002",
    billNo: "BG-2024-002",
    entryId: "GE004",
    qcId: "QC004",
    fwId: "FW002",
    name: "Vikram Sharma",
    vehicleNo: "HR33PQ4567",
    netWeight: "2750 kg",
    grade: "Grade B",
    rate: "₹4,800",
    amount: "₹1,32,000",
    gst: "₹23,760",
    totalAmount: "₹1,55,760",
    timestamp: "2024-01-15 10:45 AM",
    status: "pending",
  },
  {
    id: "BILL003",
    billNo: "BG-2024-003",
    entryId: "GE002",
    qcId: "QC002",
    fwId: "FW003",
    name: "Suresh Patel",
    vehicleNo: "HR12CD5678",
    netWeight: "3180 kg",
    grade: "Grade A",
    rate: "₹5,200",
    amount: "₹1,65,360",
    gst: "₹29,764.80",
    totalAmount: "₹1,95,124.80",
    timestamp: "2024-01-15 08:15 AM",
    status: "generated",
    billData: {
      generatedAt: "2024-01-15 12:30 PM",
      generatedBy: "Bill Clerk 1",
      billPath: "/bills/BG-2024-003.pdf",
    },
  },
]

export default function BillGenerationPage() {
  const [entries, setEntries] = useState<BillEntry[]>(mockEntries)
  const [selectedEntry, setSelectedEntry] = useState<BillEntry | null>(null)
  const [showBillPreview, setShowBillPreview] = useState(false)
  const { toast } = useToast()

  const handleGenerateBill = (entry: BillEntry) => {
    const updatedEntries = entries.map((e) =>
      e.id === entry.id
        ? {
            ...e,
            status: "generated" as const,
            billData: {
              generatedAt: new Date().toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              generatedBy: "Bill Clerk 1",
              billPath: `/bills/${entry.billNo}.pdf`,
            },
          }
        : e,
    )

    setEntries(updatedEntries)

    toast({
      title: "Bill Generated",
      description: `Bill ${entry.billNo} has been generated successfully.`,
    })
  }

  const handlePreviewBill = (entry: BillEntry) => {
    setSelectedEntry(entry)
    setShowBillPreview(true)
  }

  const handleDownloadPDF = (entry: BillEntry) => {
    // Simulate PDF download
    toast({
      title: "PDF Downloaded",
      description: `Bill ${entry.billNo} has been downloaded as PDF.`,
    })
  }

  const BillPreview = ({ entry }: { entry: BillEntry }) => (
    <div className="space-y-6 p-6 bg-white text-black rounded-lg">
      {/* Bill Header */}
      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold">COTTON PROCESSING UNIT</h1>
        <p className="text-sm text-gray-600">Village Kharkhoda, Sonipat, Haryana - 131001</p>
        <p className="text-sm text-gray-600">GST No: 06ABCDE1234F1Z5 | Phone: +91-9876543210</p>
      </div>

      {/* Bill Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Bill To:</h3>
          <p className="font-medium">{entry.name}</p>
          <p className="text-sm text-gray-600">Vehicle: {entry.vehicleNo}</p>
          <p className="text-sm text-gray-600">Entry ID: {entry.entryId}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold mb-2">Bill Details:</h3>
          <p className="font-medium">Bill No: {entry.billNo}</p>
          <p className="text-sm text-gray-600">Date: {entry.timestamp}</p>
          <p className="text-sm text-gray-600">QC ID: {entry.qcId}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 border-b">Description</th>
              <th className="text-right p-3 border-b">Weight</th>
              <th className="text-right p-3 border-b">Rate</th>
              <th className="text-right p-3 border-b">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b">
                Cotton - {entry.grade}
                <br />
                <span className="text-sm text-gray-600">Quality Checked & Processed</span>
              </td>
              <td className="text-right p-3 border-b">{entry.netWeight}</td>
              <td className="text-right p-3 border-b">{entry.rate}/quintal</td>
              <td className="text-right p-3 border-b font-medium">{entry.amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-medium">{entry.amount}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (18%):</span>
          <span className="font-medium">{entry.gst}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Total Amount:</span>
          <span>{entry.totalAmount}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 border-t pt-4">
        <p>Thank you for your business!</p>
        <p>This is a computer generated bill.</p>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bill Generation</h1>
            <p className="text-muted-foreground">Generate and manage bills for processed entries</p>
          </div>

          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending Bills</TabsTrigger>
              <TabsTrigger value="generated">Generated Bills</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Bill Generation
                  </CardTitle>
                  <CardDescription>Entries ready for bill generation</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bill No.</TableHead>
                          <TableHead>Entry ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Vehicle No.</TableHead>
                          <TableHead>Net Weight</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Total Amount</TableHead>
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
                              <TableCell>{entry.rate}/quintal</TableCell>
                              <TableCell className="font-medium text-green-600">{entry.totalAmount}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="gap-1">
                                  <Clock className="h-3 w-3" />
                                  {entry.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleGenerateBill(entry)} className="gap-1">
                                    <FileText className="h-4 w-4" />
                                    Generate
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handlePreviewBill(entry)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {entries
                      .filter((entry) => entry.status === "pending")
                      .map((entry) => (
                        <Card key={entry.id} className="bg-background border-border">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-foreground">{entry.billNo}</h3>
                                  <p className="text-sm text-foreground/70">Entry: {entry.entryId}</p>
                                </div>
                                <Badge variant="secondary" className="gap-1">
                                  <Clock className="h-3 w-3" />
                                  {entry.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-foreground/60">Name</p>
                                  <p className="font-medium text-foreground">{entry.name}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Vehicle</p>
                                  <p className="font-medium text-foreground">{entry.vehicleNo}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Weight</p>
                                  <p className="font-medium text-foreground">{entry.netWeight}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Grade</p>
                                  <Badge variant="default">{entry.grade}</Badge>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Rate</p>
                                  <p className="font-medium text-foreground">{entry.rate}/quintal</p>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Total Amount</p>
                                  <p className="font-medium text-green-600">{entry.totalAmount}</p>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button size="sm" onClick={() => handleGenerateBill(entry)} className="gap-1 flex-1">
                                  <FileText className="h-4 w-4" />
                                  Generate
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handlePreviewBill(entry)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="generated">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Generated Bills
                  </CardTitle>
                  <CardDescription>All generated bills ready for approval</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
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
                          <TableHead>Generated By</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries
                          .filter((entry) => entry.status === "generated" || entry.status === "approved")
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
                              <TableCell>{entry.billData?.generatedAt}</TableCell>
                              <TableCell>{entry.billData?.generatedBy}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={entry.status === "approved" ? "default" : "secondary"}
                                  className="gap-1"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  {entry.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handlePreviewBill(entry)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(entry)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {entries
                      .filter((entry) => entry.status === "generated" || entry.status === "approved")
                      .map((entry) => (
                        <Card key={entry.id} className="bg-background border-border">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-foreground">{entry.billNo}</h3>
                                  <p className="text-sm text-foreground/70">Entry: {entry.entryId}</p>
                                </div>
                                <Badge
                                  variant={entry.status === "approved" ? "default" : "secondary"}
                                  className="gap-1"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  {entry.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-foreground/60">Name</p>
                                  <p className="font-medium text-foreground">{entry.name}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Vehicle</p>
                                  <p className="font-medium text-foreground">{entry.vehicleNo}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Weight</p>
                                  <p className="font-medium text-foreground">{entry.netWeight}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Grade</p>
                                  <Badge variant="default">{entry.grade}</Badge>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Total Amount</p>
                                  <p className="font-medium text-green-600">{entry.totalAmount}</p>
                                </div>
                                <div>
                                  <p className="text-foreground/60">Generated At</p>
                                  <p className="font-medium text-foreground">{entry.billData?.generatedAt}</p>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePreviewBill(entry)}
                                  className="flex-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  Preview
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(entry)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Pending Bills</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {entries.filter((e) => e.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting generation</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Generated Bills</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {entries.filter((e) => e.status === "generated").length}
                </div>
                <p className="text-xs text-muted-foreground">Ready for approval</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Total Value</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">₹5,02,057</div>
                <p className="text-xs text-muted-foreground">Today's bills</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Bill Preview Dialog */}
      <Dialog open={showBillPreview} onOpenChange={setShowBillPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Bill Preview</DialogTitle>
            <DialogDescription>Preview of Bill {selectedEntry?.billNo}</DialogDescription>
          </DialogHeader>

          {selectedEntry && <BillPreview entry={selectedEntry} />}

          <div className="flex gap-4 pt-4">
            <Button onClick={() => selectedEntry && handleDownloadPDF(selectedEntry)} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={() => setShowBillPreview(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
