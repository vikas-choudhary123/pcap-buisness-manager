"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  LogIn,
  CheckCircle,
  Scale,
  FileText,
  CheckSquare,
  CreditCard,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Gate Entry",
    href: "/gate-entry",
    icon: LogIn,
  },
  {
    name: "Quality Check",
    href: "/quality-check",
    icon: CheckCircle,
  },
  {
    name: "Final Weight",
    href: "/final-weight",
    icon: Scale,
  },
  {
    name: "Bill",
    href: "/bill-generation",
    icon: FileText,
  },
  {
    name: "Approval",
    href: "/approval",
    icon: CheckSquare,
  },
  {
    name: "Payment",
    href: "/payment",
    icon: CreditCard,
  },
  {
    name: "Operations",
    href: "/operations",
    icon: Settings,
  },
  {
    name: "Labor",
    href: "/labor",
    icon: Users,
  },
]

function SidebarContent({
  collapsed,
  onCollapse,
  isMobile = false,
  onNavigate,
}: {
  collapsed: boolean
  onCollapse: () => void
  isMobile?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border",
        !isMobile && "transition-all duration-300",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {(!collapsed || isMobile) && (
          <h1 className="text-lg font-semibold text-sidebar-foreground">Business Manager</h1>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} onClick={onNavigate}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                    isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                    collapsed && !isMobile && "px-2",
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {(!collapsed || isMobile) && <span className="text-sm">{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) {
    return (
      <>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm border border-border"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent
              collapsed={false}
              onCollapse={() => {}}
              isMobile={true}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <div className={cn("hidden md:flex flex-col h-screen transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <SidebarContent collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
    </div>
  )
}
