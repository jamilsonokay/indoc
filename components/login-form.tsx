'use client';

import { useState } from 'react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client"

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um email válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const [isRegistering, setIsRegistering] = useState(false)

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      let result;
      if (isRegistering) {
        // Formata o nome baseado no email (antes do @)
        const emailName = data.email.split('@')[0];
        const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

        result = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: formattedName,
            },
          },
        })
      } else {
        result = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
      }

      const { error, data: authData } = result

      if (error) {
        setError(error.message || (isRegistering ? "Falha ao criar conta." : "Falha ao entrar."))
        return
      }

      // Se for registro, verificar se precisa confirmar email
      if (isRegistering && authData.user && !authData.session) {
         setError("Conta criada! Verifique seu email para confirmar (se necessário) ou tente fazer login.")
         setIsRegistering(false) // Volta para login
         return
      }

      router.replace("/dashboard")
      router.refresh()
    } catch (err) {
      setError('Ocorreu um erro inesperado.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">{isRegistering ? "Criar Conta" : "Login"}</CardTitle>
          <CardDescription>
            {isRegistering 
              ? "Preencha os dados abaixo para se registrar" 
              : "Digite seu email abaixo para acessar sua conta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@inpharma.cv"
                  disabled={isLoading}
                  className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  className={cn(errors.password && "border-red-500 focus-visible:ring-red-500")}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              {error && (
                <div className="text-sm text-red-500 font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRegistering ? "Criar Conta" : "Entrar"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {isRegistering ? "Já tem uma conta? " : "Não tem uma conta? "}
              <button 
                type="button" 
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setError(null)
                }}
                className="underline underline-offset-4"
              >
                {isRegistering ? "Faça login" : "Criar conta"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Ao clicar em continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  )
}
