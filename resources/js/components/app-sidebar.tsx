"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, ChartSpline, Database, Settings2Icon, Truck } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "Hendri Alqori",
    email: "hendrialqori@pb1.co.id",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Menu Utama",
      url: "#",
      icon: (
        <ChartSpline />
      ),
      isActive: true,
      items: [
        {
          title: "Ikhtisar",
          url: "#",
        },
        {
          title: "Log Aktivitas Driver",
          url: "/log-activity-driver",
        },
        {
          title: "Laporan Temuan",
          url: "/finding-reports",
        },
      ],
    },
    // {
    //   title: "Monitoring",
    //   url: "#",
    //   icon: (
    //     <Truck />
    //   ),
    //   items: [
    //     {
    //       title: "Cartrack Monitoring",
    //       url: "/cartrack-monitoring",
    //     },
    //   ],
    // },
    {
      title: "Master Data",
      url: "#",
      icon: (
        <Database />
      ),
      items: [
        {
          title: "Fleet",
          url: "/fleet",
        },
        {
          title: "Driver",
          url: "/driver",
        },
      ],
    },
    {
      title: "Pengaturan",
      url: "#",
      icon: (
        <Settings2Icon />
      ),
      items: [
        {
          title: "Notifikasi",
          url: "#",
        },
        {
          title: "Suara",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
