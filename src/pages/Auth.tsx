import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Scissors } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
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
    <main className="theme-dark flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Scissors className="h-5 w-5" />
          </span>
          <span className="font-heading text-xl tracking-wide">ON-TESTE</span>
        </Link>

        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl">Acesse sua conta</CardTitle>
            <CardDescription>Entre para gerenciar seus agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="mb-4 grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="signin" className="rounded-lg">Entrar</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">E-mail</Label>
                    <Input id="signin-email" name="email" type="email" autoComplete="email" required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Senha</Label>
                    <Input id="signin-password" name="password" type="password" autoComplete="current-password" required className="rounded-xl" />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full rounded-xl">
                    {busy ? <Spinner className="h-4 w-4" /> : "Entrar"}
                  </Button>
                  <div className="text-center">
                    <Link to="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome completo</Label>
                    <Input id="signup-name" name="full_name" maxLength={45} required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-mail</Label>
                    <Input id="signup-email" name="email" type="email" autoComplete="email" required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input id="signup-password" name="password" type="password" autoComplete="new-password" required className="rounded-xl" />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full rounded-xl">
                    {busy ? <Spinner className="h-4 w-4" /> : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
            </div>

            <Button variant="outline" onClick={handleGoogle} disabled={busy} className="w-full rounded-xl">
              Continuar com Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
