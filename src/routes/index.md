# PRD — Organização do Menu da Conta no Canto Superior

## Objetivo

Remover a opção de conta da seção **Sistema** e reorganizar o acesso às informações do usuário para ficar exclusivamente no **menu da conta localizado no canto superior da interface**.

## Alteração Principal

Na seção/menu **Sistema**, não deverá existir nenhuma opção relacionada à conta do usuário.

Remover:

* Minha Conta
* Meu Perfil
* Qualquer outra opção pessoal do usuário

A seção **Sistema** deverá permanecer apenas com suas funcionalidades próprias.

---

## Menu da Conta

No canto superior da interface, onde o usuário visualiza sua conta/avatar/nome, deverá existir um menu suspenso de conta.

Ao clicar nesse elemento, abrir um dropdown contendo somente:

* **Meu Perfil**
* **Sair**

### Meu Perfil

Deve direcionar o usuário para sua página de perfil.

Manter todas as funcionalidades já existentes do perfil.

### Sair

Deve encerrar a sessão do usuário e realizar o logout normalmente.

---

## Regras de Interface

* O menu da conta deve ficar claramente localizado no canto superior.
* Utilizar o avatar, foto ou identificação do usuário como gatilho do menu.
* O dropdown deve possuir design consistente com o restante do sistema.
* Deve funcionar corretamente em desktop, tablet e mobile.
* Não duplicar “Meu Perfil” ou “Sair” em outras áreas.
* Remover completamente essas opções da seção **Sistema**.
* Não deixar espaços vazios após a remoção.
* Manter o restante da navegação intacto.
* Não alterar outras funcionalidades do sistema.

---

## Resultado Esperado

A estrutura deverá ficar:

**Canto superior → Conta do usuário**

```text
┌──────────────────────────────┐
│  👤 Nome do Usuário          │
├──────────────────────────────┤
│  Meu Perfil                  │
│  Sair                        │
└──────────────────────────────┘
```

E na seção **Sistema** não deverá existir nenhuma opção relacionada à conta pessoal do usuário.