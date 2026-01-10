"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Ciclo de Vida",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Análises",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Projetos",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Equipe",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Captura",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Propostas Ativas",
          url: "#",
        },
        {
          title: "Arquivados",
          url: "#",
        },
      ],
    },
    {
      title: "Propostas",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Propostas Ativas",
          url: "#",
        },
        {
          title: "Arquivados",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Propostas Ativas",
          url: "#",
        },
        {
          title: "Arquivados",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Buscar",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Biblioteca de Dados",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Relatórios",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Assistente Word",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "User",
    email: "user@example.com",
    avatar: "",
  })

  React.useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error("Erro ao buscar usuário:", error)
        return
      }

      if (user) {
        // Tenta buscar perfil, mas não falha se não existir
        let profile = null
        try {
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
          profile = data
        } catch (e) {
          console.log("Tabela profiles não encontrada ou erro ao buscar perfil", e)
        }

        // Formata o nome de fallback (ex: "admin" -> "Admin")
          const emailName = user.email?.split('@')[0]
          const formattedEmailName = emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : "Usuário"

          setUser({
            name: profile?.full_name || user.user_metadata?.full_name || formattedEmailName,
            email: user.email || "",
            avatar: user.user_metadata?.avatar_url || "",
          })
      }
    }
    getUser()
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Laboratórios Inpharma</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
