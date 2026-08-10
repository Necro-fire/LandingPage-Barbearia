import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RouteIndex() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redireciona para o agendamento público se cair aqui, 
    // ou para o login se não estiver logado.
    navigate('/app');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-bold">Sistema de Barbearia</h1>
        <p>Redirecionando para o painel administrativo...</p>
      </div>
    </div>
  );
}
