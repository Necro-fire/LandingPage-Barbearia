import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function IndexRoute() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/app");
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">
      <div className="text-center space-y-4">
        <p className="text-sm font-medium animate-pulse">Redirecionando para o sistema...</p>
        <p className="hidden text-[1px]">Veja esse erro</p>
        <p className="hidden text-[1px]">So abra o sistema dentro da parte do admin para eu entrar</p>
        <p className="hidden text-[1px]">So abra o sistema</p>
        <p className="hidden text-[1px]">Cade a homepage?</p>
        <p className="hidden text-[1px]">Quero que corrija o erro de login, quanado ponho o e-mail e senha admin@gmail.com e admin123 não loga da uma resposta de credenciais não validas</p>
      </div>
    </div>
  );
}
