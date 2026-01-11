"use client"

import * as React from "react"
import {
  IconBuildingFactory,
  IconChartBar,
  IconCheckbox,
  IconCloudUpload,
  IconDashboard,
  IconDatabase,
  IconFiles,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
  IconShieldLock,
  IconStar,
  IconTrash,
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

// Navigation data configuration
const getNavData = (role?: string) => {
  const isAdmin = role === 'admin';

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Documentos",
      url: "/documents",
      icon: IconFiles,
      items: [
        {
          title: "Todos os Documentos",
          url: "/documents",
        },
        {
          title: "Por Departamento",
          url: "/documents?filter=department",
        },
        {
          title: "Por Tipo",
          url: "/documents?filter=type",
        },
      ],
    },
    {
      title: "Upload / Nova Versão",
      url: "/documents/upload",
      icon: IconCloudUpload,
    },
    {
      title: "Minhas Confirmações",
      url: "/acknowledgments",
      icon: IconCheckbox,
    },
    {
      title: "Relatórios / Auditoria",
      url: "/reports",
      icon: IconChartBar,
    },
  ];

  if (isAdmin) {
    navMain.push({
      title: "Administração",
      url: "/admin",
      icon: IconShieldLock,
      items: [
        {
          title: "Utilizadores",
          url: "/admin/users",
        },
        {
          title: "Tipos Documentais",
          url: "/admin/document-types",
        },
        {
          title: "Departamentos",
          url: "/admin/departments",
        },
        {
          title: "Backup",
          url: "/admin/backup",
        },
      ],
    });
  }

  const navSecondary = [
    {
      title: "Configurações",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Ajuda",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Buscar",
      url: "/search",
      icon: IconSearch,
    },
  ];

  return { navMain, navSecondary };
}

export function AppSidebar({
  user: initialUser,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
    avatar: string
    role?: string
  }
}) {
  const [user, setUser] = React.useState<{
    name: string
    email: string
    avatar: string
    role?: string
  } | null>(initialUser || null)

  const [navData, setNavData] = React.useState(getNavData(initialUser?.role));

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
           console.warn("Erro ao buscar perfil (Client):", error.message)
        }
      } catch (e) {
        console.log("Tabela profiles não encontrada ou erro ao buscar perfil", e)
      }

      const emailName = authUser.email?.split('@')[0]
      const formattedEmailName = emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : "Usuário"
      const finalName = profile?.full_name || authUser.user_metadata?.full_name || formattedEmailName
      const userRole = profile?.role || 'user';

      setUser({
        name: finalName,
        email: authUser.email || "",
        avatar: authUser.user_metadata?.avatar_url || "",
        role: userRole,
      })
      
      // Update nav data based on fetched role
      setNavData(getNavData(userRole));
    }

    if (!initialUser) {
      const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await fetchUserData(user)
        } else {
          setUser(null)
          setNavData(getNavData());
        }
      }
      getUser()
    } else {
       // If initialUser is provided, ensure navData is up to date (though useState init handles it, this covers updates)
       setNavData(getNavData(initialUser.role));
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserData(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setNavData(getNavData());
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
        <NavMain items={navData.navMain} />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
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
