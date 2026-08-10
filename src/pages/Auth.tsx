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
    if (!loading && session) navigate("/app", { replace: true });
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
    <main className="min-h-screen bg-black flex flex-col lg:flex-row overflow-x-hidden">
      {/* Visual Side - Immersive Image */}
      <div className="relative w-full h-[30vh] lg:h-screen lg:w-1/2 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
          className="absolute inset-0 h-full w-full object-cover grayscale brightness-[0.3]" 
          alt="Login Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end lg:justify-center p-8 lg:p-20">
          <Link to="/" className="mb-4 lg:mb-8 flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-primary text-black shrink-0">
              <Scissors className="h-5 w-5 lg:h-6 lg:w-6" />
            </span>
            <span className="font-heading text-xl lg:text-3xl font-black tracking-tighter uppercase">ON-TESTE</span>
          </Link>
          <h2 className="text-2xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-4 lg:mb-6 max-w-xl">
            GESTÃO PROFISSIONAL PARA <span className="text-primary italic">SUA BARBEARIA</span>
          </h2>
          <p className="hidden md:block text-white/50 text-[10px] lg:text-[11px] font-black tracking-[0.3em] uppercase leading-relaxed max-w-sm">
            ACESSE SEU PAINEL E GERENCIE SEUS AGENDAMENTOS COM A EFICIÊNCIA QUE SEU NEGÓCIO MERECE.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 bg-black min-h-[70vh] lg:min-h-screen">
        <div className="w-full max-w-sm space-y-8 lg:space-y-10">
          <div className="hidden lg:block">
            {/* Logo placeholder removed as it's in the visual side */}
          </div>
          <div className="lg:hidden flex justify-center mb-10">
            <Link to="/" className="flex items-center gap-2 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-black">
                <Scissors className="h-5 w-5" />
              </span>
              <span className="font-heading text-xl font-black tracking-tighter uppercase">ON-TESTE</span>
            </Link>
          </div>

          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
              {mode === "signin" ? "BEM-VINDO DE VOLTA" : "CRIE SUA CONTA"}
            </h1>
            <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
              {mode === "signin" 
                ? "ENTRE COM SUAS CREDENCIAIS PARA CONTINUAR" 
                : "JUNTE-SE À ELITE DA GESTÃO DE BARBEARIAS"}
            </p>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGoogle} 
              disabled={busy}
              className="rounded-none border-white/10 bg-white/[0.02] text-white hover:bg-white/[0.05] h-14 text-[10px] font-black tracking-[0.2em] uppercase w-full"
            >
              <Chrome className="mr-3 h-4 w-4 text-primary" /> CONTINUAR COM GOOGLE
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.5em]"><span className="bg-black px-4 text-white/20 uppercase">OU</span></div>
          </div>

          <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-6">
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">NOME COMPLETO</label>
                <Input name="full_name" required className="rounded-none border-white/10 bg-white/[0.02] text-white text-[11px] tracking-widest focus:border-primary h-14" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">E-MAIL</label>
              <Input name="email" type="email" required className="rounded-none border-white/10 bg-white/[0.02] text-white text-[11px] tracking-widest focus:border-primary h-14" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">SENHA</label>
                {mode === "signin" && (
                  <Link to="/auth/forgot-password" title="ESQUECEU A SENHA?" className="text-[8px] font-black tracking-[0.2em] text-white/30 hover:text-primary uppercase transition-colors">
                    ESQUECEU?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="rounded-none border-white/10 bg-white/[0.02] text-white text-[11px] tracking-widest focus:border-primary h-14 pr-12" 

                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" disabled={busy} className="w-full rounded-none bg-primary py-10 text-[12px] font-black tracking-[0.4em] uppercase text-black hover:bg-primary/90 transition-all">
              {busy ? <Spinner className="h-6 w-6" /> : (mode === "signin" ? "ENTRAR AGORA" : "CRIAR MINHA CONTA")}
            </Button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-[10px] font-black tracking-[0.3em] text-white/40 hover:text-white uppercase transition-colors"
            >
              {mode === "signin" 
                ? "NÃO TEM CONTA? CADASTRE-SE" 
                : "JÁ TEM UMA CONTA? ENTRAR"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
