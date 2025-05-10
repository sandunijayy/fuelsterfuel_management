"use client"

import { LayoutDashboard, ShoppingCart, Users, FileText, Settings } from "lucide-react"
import ProfileSidebar from "../components/ProfileSidebar"

const StaffLayout = ({ children }) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/sales-dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Sales",
      path: "/sales-dashboard/sales",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Customers",
      path: "/sales-dashboard/customers",
      icon: <Users size={20} />,
    },
    {
      name: "Reports",
      path: "/sales-dashboard/reports",
      icon: <FileText size={20} />,
    },
    {
      name: "Settings",
      path: "/sales-dashboard/settings",
      icon: <Settings size={20} />,
    },
  ]

  return <ProfileSidebar navItems={navItems}>{children}</ProfileSidebar>
}

export default StaffLayout
