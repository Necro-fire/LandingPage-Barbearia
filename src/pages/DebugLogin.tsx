import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function DebugLogin() {
  const navigate = useNavigate();

  const handleForceLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "admin@gmail.com",
      password: "admin123",
    });
    
    if (error) {
      console.error("Login error:", error);
      toast({ title: "Erro no Login", description: error.message, variant: "destructive" });
    } else {
      console.log("Login success:", data);
      toast({ title: "Login Sucesso", description: "Bem-vindo, admin!" });
      navigate("/app");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Debug de Login</h1>
        <p className="text-gray-400">Tente entrar com as credenciais padrão</p>
      </div>
      
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 w-full max-w-sm">
        <div className="space-y-4">
          <div className="text-sm">
            <span className="text-gray-500">Email:</span> admin@gmail.com
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Senha:</span> admin123
          </div>
          <Button onClick={handleForceLogin} className="w-full bg-primary hover:bg-primary/90">
            Tentar Entrar Agora
          </Button>
        </div>
      </div>
      
      <Button variant="ghost" onClick={() => navigate("/auth")} className="text-gray-500">
        Voltar para Login Normal
      </Button>
    </div>
  );
}
