import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Scissors, Eye, EyeOff, Mail, Github, Chrome } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Spinner } from "@/components/common/Loading";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const emailSchema = z.string().trim().email("Informe um e-mail válido").max(255);
const passwordSchema = z.string().min(6, "A senha deve ter no mínimo 6 caracteres").max(72);
const nameSchema = z
  .string()
  .trim()
  .min(2, "Informe seu nome")
  .max(45, "Máximo de 45 caracteres")
  .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nome deve conter apenas letras");

export default function Auth() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (!loading && session) {
      // If admin, go to /app, else go to /app/meu-painel
      supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => {
        const roles = (data || []).map(r => r.role);
        if (roles.includes("admin")) {
          navigate("/app", { replace: true });
        } else {
          navigate("/app/meu-painel", { replace: true });
        }
      });
    }
  }, [session, loading, navigate]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = z
      .object({ email: emailSchema, password: passwordSchema })
      .safeParse({ email: form.get("email"), password: form.get("password") });

    if (!parsed.success) {
      toast({ title: "Dados inválidos", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }

    setBusy(true);
    
    // Admin specific handling for better logging/recovery
    if (parsed.data.email === "admin@gmail.com") {
      console.log("Admin login attempt...");
    }

    const { error } = await supabase.auth.signInWithPassword({ 
      email: parsed.data.email, 
      password: parsed.data.password 
    });
    setBusy(false);

    if (error) {
      toast({ title: "Não foi possível entrar", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/app", { replace: true });
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = z
      .object({ full_name: nameSchema, email: emailSchema, password: passwordSchema })
      .safeParse({
        full_name: form.get("full_name"),
        email: form.get("email"),
        password: form.get("password"),
      });

    if (!parsed.success) {
      toast({ title: "Dados inválidos", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: parsed.data.full_name },
      },
    });
    setBusy(false);

    if (error) {
      toast({ title: "Não foi possível cadastrar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Cadastro realizado", description: "Confirme seu e-mail para ativar a conta." });
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setBusy(false);
      toast({ title: "Falha no login com Google", variant: "destructive" });
      return;
    }
    if (result.redirected) return;
    navigate("/app", { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 overflow-x-hidden">
      <div className="w-full max-w-sm space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-center mb-10">
          <Link to="/" className="flex flex-col items-center gap-2 text-slate-900">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Scissors className="h-7 w-7" />
            </span>
            <span className="font-heading text-2xl font-bold tracking-tight uppercase">ON-TESTE</span>
          </Link>
        </div>
          <div className="lg:hidden">
            {/* Logo is now handled in the visual banner at the top */}
          </div>

          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
              {mode === "signin" ? "Login" : "Criar Conta"}
            </h1>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {mode === "signin" 
                ? "Entre com suas credenciais" 
                : "Cadastre-se para começar"}
            </p>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGoogle} 
              disabled={busy}
              className="rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50 h-12 text-xs font-bold w-full"
            >
              <Chrome className="mr-3 h-4 w-4 text-blue-500" /> CONTINUAR COM GOOGLE
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-4 text-slate-300 uppercase">OU</span></div>
          </div>

          <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase ml-1">Nome Completo</label>
                <Input name="full_name" required className="rounded-xl border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:border-primary h-12" />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase ml-1">E-mail</label>
              <Input name="email" type="email" required className="rounded-xl border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:border-primary h-12" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Senha</label>
                {mode === "signin" && (
                  <Link to="/auth/forgot-password" title="ESQUECEU A SENHA?" className="text-[9px] font-bold tracking-wider text-primary hover:text-primary/80 uppercase transition-colors">
                    Esqueceu?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="rounded-xl border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:border-primary h-12 pr-12" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" disabled={busy} className="w-full rounded-xl bg-primary py-6 text-sm font-bold uppercase text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all mt-4">
              {busy ? <Spinner className="h-5 w-5" /> : (mode === "signin" ? "Entrar" : "Criar Conta")}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button 
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-[10px] font-bold tracking-wider text-slate-400 hover:text-primary uppercase transition-colors"
            >
              {mode === "signin" 
                ? "Não tem conta? Cadastre-se" 
                : "Já tem uma conta? Entrar"}
            </button>
          </div>
      </div>
    </main>
  );
}
