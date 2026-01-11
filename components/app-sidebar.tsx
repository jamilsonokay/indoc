"use client"

import * as React from "react"
import {
  IconBuildingFactory,
  IconChartBar,
  IconDashboard,
  IconFiles,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListCheck,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

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
      title: "Meus Documentos",
      url: "#",
      icon: IconFiles,
    },
    {
      title: "Departamentos",
      url: "#",
      icon: IconBuildingFactory,
    },
    {
      title: "Tarefas",
      url: "#",
      icon: IconListCheck,
    },
    {
      title: "Relatórios",
      url: "#",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Usuários",
      url: "#",
      icon: IconUsers,
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
}

export function AppSidebar({
  user: initialUser,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
    avatar: string
  }
}) {
  const [user, setUser] = React.useState<{
    name: string
    email: string
    avatar: string
  } | null>(initialUser || null)

  React.useEffect(() => {
    const supabase = createClient()
    
    const fetchUserData = async (authUser: any) => {
      if (!authUser) return

      let profile = null
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
        if (!error) {
           profile = data
        } else {
           // Em caso de erro (ex: RLS), tenta pegar do metadata
           console.warn("Erro ao buscar perfil (Client):", error.message)
        }
      } catch (e) {
        console.log("Tabela profiles não encontrada ou erro ao buscar perfil", e)
      }

      const emailName = authUser.email?.split('@')[0]
      const formattedEmailName = emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : "Usuário"

      // Prioridade:
      // 1. Nome do Perfil (Tabela public.profiles)
      // 2. Nome do Metadata (Auth)
      // 3. Nome formatado do email
      const finalName = profile?.full_name || authUser.user_metadata?.full_name || formattedEmailName

      setUser({
        name: finalName,
        email: authUser.email || "",
        avatar: authUser.user_metadata?.avatar_url || "",
      })
    }

    if (!initialUser) {
      const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await fetchUserData(user)
        } else {
          setUser(null)
        }
      }
      getUser()
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserData(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialUser])

  const displayUser = user || {
    name: "Usuário",
    email: "",
    avatar: "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <NavUser user={displayUser} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
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
