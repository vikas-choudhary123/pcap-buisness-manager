"use client"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, TrendingUp, Package, BarChart3 } from "lucide-react"

const materials = [
  { name: "Cotton", stock: "2,450 kg", sold: "1,200 kg", price: "₹5,200/quintal", status: "available" },
  { name: "Kapas", stock: "1,800 kg", sold: "900 kg", price: "₹3,800/quintal", status: "available" },
  { name: "Seed", stock: "3,200 kg", sold: "1,500 kg", price: "₹2,100/quintal", status: "available" },
  { name: "Bales", stock: "45 units", sold: "20 units", price: "₹8,500/unit", status: "available" },
  { name: "Oil", stock: "850 liters", sold: "400 liters", price: "₹120/liter", status: "low" },
  { name: "Khali", stock: "1,200 kg", sold: "600 kg", price: "₹1,800/quintal", status: "available" },
  { name: "Muddy", stock: "300 kg", sold: "150 kg", price: "₹800/quintal", status: "low" },
]

const salesData = [
  {
    id: "SALE001",
    material: "Cotton",
    quantity: "500 kg",
    rate: "₹5,200/quintal",
    amount: "₹26,000",
    buyer: "Textile Mills Ltd",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "SALE002",
    material: "Oil",
    quantity: "200 liters",
    rate: "₹120/liter",
    amount: "₹24,000",
    buyer: "Local Distributor",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "SALE003",
    material: "Bales",
    quantity: "10 units",
    rate: "₹8,500/unit",
    amount: "₹85,000",
    buyer: "Export Company",
    date: "2024-01-14",
    status: "pending",
  },
]

export default function SalesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales Section</h1>
            <p className="text-muted-foreground">Track materials inventory and sales performance</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Total Materials</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">7</div>
                <p className="text-xs text-muted-foreground">Different materials</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Today's Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">₹1,35,000</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Low Stock Items</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">2</div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Monthly Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">₹18,45,000</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="inventory" className="space-y-4">
            <TabsList>
              <TabsTrigger value="inventory">Material Inventory</TabsTrigger>
              <TabsTrigger value="sales">Sales Records</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Material Inventory
                  </CardTitle>
                  <CardDescription>Current stock levels and pricing for all materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Sold Today</TableHead>
                        <TableHead>Current Price</TableHead>
                        <TableHead>Stock Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((material, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{material.name}</TableCell>
                          <TableCell>{material.stock}</TableCell>
                          <TableCell>{material.sold}</TableCell>
                          <TableCell className="font-medium">{material.price}</TableCell>
                          <TableCell>
                            <Badge variant={material.status === "available" ? "default" : "destructive"}>
                              {material.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Update Stock
                              </Button>
                              <Button size="sm" variant="outline">
                                Set Price
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

            <TabsContent value="sales">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Sales Records
                  </CardTitle>
                  <CardDescription>Recent sales transactions and orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sale ID</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{sale.material}</TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell>{sale.rate}</TableCell>
                          <TableCell className="font-medium text-green-600">{sale.amount}</TableCell>
                          <TableCell>{sale.buyer}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>
                            <Badge variant={sale.status === "completed" ? "default" : "secondary"}>{sale.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              {sale.status === "pending" && <Button size="sm">Complete</Button>}
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
