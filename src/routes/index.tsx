import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function IndexRoute() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">
      <div className="text-center space-y-4">
        <p className="text-sm font-medium animate-pulse">Redirecionando para o sistema...</p>
        <p className="hidden text-[1px]"># PRD — Adição da HomePage na Área Pública

## Objetivo

Adicionar a HomePage à área pública do sistema, tornando-a a porta de entrada principal para clientes e visitantes.
A HomePage será responsável por apresentar a barbearia e permitir que qualquer pessoa acesse o fluxo de agendamento sem precisar entrar no painel administrativo.</p>
      </div>
    </div>
  );
}
