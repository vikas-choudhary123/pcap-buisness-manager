import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Package, Clock, CheckCircle, AlertTriangle, DollarSign, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Total Entries Today",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Pending Quality Checks",
    value: "8",
    change: "-3",
    trend: "down",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Completed Bills",
    value: "16",
    change: "+8",
    trend: "up",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Revenue Today",
    value: "₹2,45,000",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "Gate Entry",
    description: "New cotton entry - Vehicle MH12AB1234",
    time: "2 minutes ago",
    status: "completed",
  },
  {
    id: 2,
    type: "Quality Check",
    description: "Quality check completed for Entry #1023",
    time: "5 minutes ago",
    status: "completed",
  },
  {
    id: 3,
    type: "Bill Generation",
    description: "Bill generated for Entry #1021",
    time: "8 minutes ago",
    status: "completed",
  },
  {
    id: 4,
    type: "Approval",
    description: "Entry #1019 pending approval",
    time: "12 minutes ago",
    status: "pending",
  },
]

const machineStatus = [
  { name: "Cotton Gin #1", status: "working", efficiency: "98%" },
  { name: "Cotton Gin #2", status: "working", efficiency: "95%" },
  { name: "Oil Extractor #1", status: "maintenance", efficiency: "0%" },
  { name: "Seed Cleaner #1", status: "working", efficiency: "92%" },
  { name: "Baling Machine #1", status: "not-working", efficiency: "0%" },
]

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="p-4 md:p-6 space-y-6 pt-16 md:pt-6">
          <div className="animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm md:text-base">Overview of all operations and key metrics</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-slide-up">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                  <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl md:text-2xl font-bold text-card-foreground">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={cn("flex items-center", stat.trend === "up" ? "text-green-600" : "text-red-500")}>
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">from yesterday</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {/* Recent Activities */}
            <Card className="bg-card border-border animate-slide-up">
              <CardHeader>
                <CardTitle className="text-card-foreground">Recent Activities</CardTitle>
                <CardDescription>Latest operations and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Badge variant={activity.status === "completed" ? "default" : "secondary"} className="text-xs">
                          {activity.type}
                        </Badge>
                        {activity.status === "pending" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      </div>
                      <p className="text-sm text-card-foreground leading-relaxed">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Machine Status */}
            <Card className="bg-card border-border animate-slide-up">
              <CardHeader>
                <CardTitle className="text-card-foreground">Machine Status</CardTitle>
                <CardDescription>Current operational status of machines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {machineStatus.map((machine, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-card-foreground">{machine.name}</p>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Badge
                          variant={
                            machine.status === "working"
                              ? "default"
                              : machine.status === "maintenance"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {machine.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Efficiency: <span className="font-medium">{machine.efficiency}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
