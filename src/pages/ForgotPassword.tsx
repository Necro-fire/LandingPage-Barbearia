import { useState } from "react";
import { Link } from "react-router-dom";
import { Scissors, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/common/Loading";
import { toast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string;

    if (!email) return;

    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setBusy(false);

    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
      return;
    }

    setSent(true);
  };

  return (
    <main className="theme-dark flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/auth" className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Voltar para o login</span>
        </Link>

        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-2xl">Recuperar senha</CardTitle>
            <CardDescription>
              Enviaremos um link para o seu e-mail para definir uma nova senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Se o e-mail estiver cadastrado, você receberá um link em breve. Verifique também sua caixa de spam.
                </p>
                <Button variant="outline" onClick={() => setSent(false)} className="w-full rounded-xl">
                  Tentar outro e-mail
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" required className="rounded-xl" />
                </div>
                <Button type="submit" disabled={busy} className="w-full rounded-xl">
                  {busy ? <Spinner className="h-4 w-4" /> : "Enviar link de recuperação"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
