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
    name: string;
    email: string;
    avatar: string;
  } | null>(initialUser || null)

  React.useEffect(() => {
    // Se já temos usuário inicial, não precisamos buscar de novo imediatamente,
    // mas ainda queremos ouvir mudanças de estado.
    
    const supabase = createClient()
    
    // Função para buscar e formatar dados do usuário
    const fetchUserData = async (authUser: any) => {
      if (!authUser) return

      // Se o usuário atual já for igual ao authUser (verificação simples por email),
      // e já tivermos nome, talvez não precise buscar perfil de novo se já veio do server.
      // Mas para garantir consistência, vamos buscar.
      
      let profile = null
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
        profile = data
      } catch (e) {
        console.log("Tabela profiles não encontrada ou erro ao buscar perfil", e)
      }

      // Formata o nome de fallback (ex: "admin" -> "Admin")
      const emailName = authUser.email?.split('@')[0]
      const formattedEmailName = emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : "Usuário"

      setUser({
        name: profile?.full_name || authUser.user_metadata?.full_name || formattedEmailName,
        email: authUser.email || "",
        avatar: authUser.user_metadata?.avatar_url || "",
      })
    }

    // Busca inicial apenas se não tiver usuário inicial
    if (!initialUser) {
      const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await fetchUserData(user)
        }
      }
      getUser()
    }

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Só atualiza se for diferente do atual (opcional, mas bom para evitar renders)
        await fetchUserData(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialUser])

  // Dados padrão para exibir enquanto carrega ou se não tiver usuário (fallback seguro)
  const displayUser = user || {
    name: "Carregando...",
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
