import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  FileText,
  Users,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documentos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aprovações Pendentes
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +15 novas esta semana
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 novos usuários
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% desde o último mês
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card
          className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
        >
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Documentos Recentes</CardTitle>
              <CardDescription>
                Últimos documentos submetidos no sistema.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                Ver Todos
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Mock items */}
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">IT</span>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    IT_05_2026 - Política de Segurança
                  </p>
                  <p className="text-sm text-muted-foreground">
                    joao.silva@inpharma.cv
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-green-600">Aprovado</div>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-600">RH</span>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    RH_02_2026 - Manual do Colaborador
                  </p>
                  <p className="text-sm text-muted-foreground">
                    maria.costa@inpharma.cv
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-yellow-600">Pendente</div>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">IT</span>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    IT_06_2026 - Procedimento de Backup
                  </p>
                  <p className="text-sm text-muted-foreground">
                    carlos.santos@inpharma.cv
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-green-600">Aprovado</div>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">FI</span>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    FI_01_2026 - Relatório Financeiro Q1
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ana.pereira@inpharma.cv
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-gray-600">Rascunho</div>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600">OP</span>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    OP_03_2026 - Manual de Operações
                  </p>
                  <p className="text-sm text-muted-foreground">
                    pedro.alves@inpharma.cv
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-yellow-600">Pendente</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Aprovação de Documento
                </p>
                <p className="text-sm text-muted-foreground">
                  Sofia Andrade aprovou IT_05_2026
                </p>
              </div>
              <div className="ml-auto font-medium text-xs text-muted-foreground">2m atrás</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Nova Versão
                </p>
                <p className="text-sm text-muted-foreground">
                  Carlos Santos enviou v2.0 de IT_06_2026
                </p>
              </div>
              <div className="ml-auto font-medium text-xs text-muted-foreground">15m atrás</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Novo Usuário
                </p>
                <p className="text-sm text-muted-foreground">
                  Ricardo Gomes entrou no departamento IT
                </p>
              </div>
              <div className="ml-auto font-medium text-xs text-muted-foreground">1h atrás</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
