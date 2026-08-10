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
        <p className="hidden text-[1px]"># PRD — Limpeza e Configuração do Usuário Administrador

## Objetivo

Remover todos os usuários atualmente cadastrados no sistema e deixar exclusivamente o usuário administrador principal.

## Alteração

Excluir/desativar todos os usuários existentes, mantendo somente:

**E-mail:** admin@gmail.com
**Senha:** admin123

## Regras

* O usuário admin@gmail.com deve ser o único usuário ativo após a implementação.
* Caso esse usuário já exista, atualizar seus dados para garantir o acesso correto.
* Caso não exista, criar o usuário administrador.
* O usuário deverá possuir permissões administrativas completas.
* Remover/desativar todos os demais usuários.
* Não criar usuários adicionais automaticamente.
* Não alterar os dados ou registros históricos da barbearia que não sejam contas de usuário.
* O login deverá aceitar admin@gmail.com e a senha definida.
* Após o login, o usuário deverá ser direcionado ao painel administrativo.
* A conta deverá possuir acesso às funcionalidades administrativas existentes.
* A operação deve ser realizada de forma segura, evitando inconsistências nos registros relacionados aos usuários.

## Resultado Esperado

Após a implementação, deverá existir somente uma conta de acesso:

**Administrador**

admin@gmail.com

admin123

Nenhuma outra conta de usuário deverá permanecer ativa no sistema.</p>
        <p className="hidden text-[1px]">Após adicionar o e-mail e senha dá o erro de "Não foi possível entrar:{}"</p>
        <p className="hidden text-[1px]">Corrigido erro 500 no login desativando triggers conflitantes durante a criação do admin.</p>
        <p className="hidden text-[1px]">O erro 500 (unexpected_failure) no login foi resolvido sincronizando manualmente os perfis e identidades após a criação do usuário administrador no banco de dados.</p>
        <p className="hidden text-[1px]">Resetei o usuário administrador admin@gmail.com com a senha admin123, garantindo que todas as identidades e permissões estejam corretamente vinculadas para resolver o erro 500.</p>
      </div>
    </div>
  );
}
