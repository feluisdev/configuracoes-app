# Especificação Técnica Frontend - Módulo de Configurações e Perfil de Usuário

## 1. Introdução

Este documento detalha a especificação técnica para o desenvolvimento frontend do Módulo de Configurações e Perfil de Usuário da aplicação, utilizando o IGRP NextJS Engine.

**Framework:** IGRP NextJS Engine (baseado em Next.js + React + Typescript)

**Perfis de Acesso:**
*   **Administrador:** Acesso total ao módulo de configurações.
*   **Usuário Autenticado:** Acesso somente ao seu perfil.

## 2. Arquitetura Frontend

A arquitetura do módulo de Configurações e Perfil de Usuário seguirá os padrões do Next.js App Router, promovendo a organização e reutilização de código.

### 2.1. Estrutura de Diretórios Recomendada

A estrutura de diretórios visa separar as preocupações, facilitando a manutenção e escalabilidade.

```
/src
|-- /app
|   |-- /configuracoes                // Rota base para configurações (acesso Admin)
|   |   |-- layout.tsx                // Layout específico para as páginas de configurações
|   |   |-- /categorias-servicos
|   |   |   |-- page.tsx              // UI da página de Categorias de Serviços
|   |   |   |-- components/           // Componentes específicos desta página
|   |   |   |   |-- CategoriasServicosDataTable.tsx
|   |   |   |   |-- FormularioCategoriaServico.tsx
|   |   |-- /tipos-servicos
|   |   |   |-- page.tsx
|   |   |   |-- components/
|   |   |   |   |-- TiposServicosDataTable.tsx
|   |   |   |   |-- FormularioTipoServico.tsx
|   |   |-- /status-pedidos
|   |   |   |-- page.tsx
|   |   |   |-- components/
|   |   |   |   |-- StatusPedidosDataTable.tsx
|   |   |   |   |-- FormularioStatusPedido.tsx
|   |-- /perfil-usuario               // Rota para o perfil do usuário (acesso Usuário Autenticado)
|   |   |-- page.tsx                  // UI da página de Perfil do Usuário
|   |   |-- components/
|   |   |   |-- FormularioPerfilUsuario.tsx
|   |   |   |-- AlterarSenhaModal.tsx // Modal específico para alteração de senha
|
|-- /components                       // Componentes React reutilizáveis em toda a aplicação
|   |-- /ui                           // Componentes de UI básicos (shadcn/ui ou similar, se usado)
|   |   |-- Button.tsx
|   |   |-- Input.tsx
|   |   |-- Select.tsx
|   |   |-- Modal.tsx
|   |   |-- DataTable.tsx             // Componente DataTable genérico e configurável
|   |   |-- AlertDialog.tsx
|   |   |-- Form.tsx                  // Wrapper para formulários, pode integrar com react-hook-form
|   |-- /shared                       // Componentes compartilhados mais complexos
|   |   |-- LoadingSpinner.tsx
|   |   |-- FeedbackMessage.tsx       // Para exibir mensagens de sucesso/erro
|   |   |-- PageHeader.tsx            // Cabeçalho padrão para páginas
|   |   |-- ConfirmacaoDialog.tsx     // Dialog de confirmação genérico
|
|-- /lib                              // Funções utilitárias, hooks, etc.
|   |-- auth.ts                       // Lógica de autenticação, hooks (ex: useCurrentUser, usePermissions)
|   |-- navigation.ts                 // Helpers para navegação, pode encapsular useRouter ou igrp-navigation
|   |-- utils.ts                      // Funções utilitárias gerais
|   |-- zod-schemas.ts                // Esquemas de validação Zod centralizados
|   |-- i18n.ts                       // Configuração de i18n (ex: next-international)
|
|-- /services                         // Lógica de comunicação com API
|   |-- api-client.ts                 // Configuração do cliente HTTP (axios, fetch wrapper)
|   |-- configuracao.service.ts       // Funções para endpoints de /configuracoes/*
|   |-- perfil.service.ts             // Funções para endpoints de /perfil-usuario/*
|
|-- /models                           // Definições de tipos e interfaces TypeScript (DTOs)
|   |-- configuracoes.models.ts       // Tipos para Categorias, Tipos de Serviço, Status de Pedido
|   |-- perfil.models.ts              // Tipos para Perfil de Usuário
|   |-- common.models.ts              // Tipos comuns (ex: PaginatedResponse)
|
|-- /locales                          // Arquivos de tradução para i18n
|   |-- pt/
|   |   |-- common.json
|   |   |-- configuracoes.json
|   |   |-- perfil.json
|   |-- en/
|   |   |-- common.json
|   |   |-- configuracoes.json
|   |   |-- perfil.json
|
|-- /hooks                            // Hooks React customizados
|   |-- useTableState.ts              // Exemplo: Hook para gerenciar estado de tabelas (paginaçao, filtros)
|   |-- useModal.ts                   // Hook para controlar visibilidade de modais
```

### 2.2. Principais Rotas e Mapeamento

*   **Páginas de Configuração (Acesso: Administrador):**
    *   `app/configuracoes/categorias-servicos/page.tsx` -> `/configuracoes/categorias-servicos`
    *   `app/configuracoes/tipos-servicos/page.tsx` -> `/configuracoes/tipos-servicos`
    *   `app/configuracoes/status-pedidos/page.tsx` -> `/configuracoes/status-pedidos`
    *   Um `layout.tsx` em `app/configuracoes/` pode ser usado para aplicar um layout comum a todas as páginas de configuração, incluindo verificação de permissão de administrador.
*   **Página de Perfil do Usuário (Acesso: Usuário Autenticado):**
    *   `app/perfil-usuario/page.tsx` -> `/perfil-usuario`
    *   Um `layout.tsx` em `app/perfil-usuario/` pode ser usado para aplicar um layout específico e garantir que o usuário esteja autenticado.

### 2.3. Navegação

*   **`next/link`:** Para navegação declarativa entre páginas.
*   **`next/navigation` (hook `useRouter`):** Para navegação programática (ex: após submissão de formulário).
*   **`igrp-navigation`:** Se este for um componente ou biblioteca específica do IGRP NextJS Engine, ele será utilizado conforme sua documentação. Presumivelmente, ele pode oferecer funcionalidades adicionais como breadcrumbs automáticos ou integração com o sistema de menu do IGRP. A integração será feita em `lib/navigation.ts` se necessário encapsulamento.

### 2.4. Gerenciamento de Estado

*   **Estado Local do Componente:** `useState` e `useReducer` para estados simples dentro dos componentes.
*   **Estado de Formulários:** Recomenda-se o uso de `react-hook-form` para gerenciamento de formulários complexos, validação e submissão. Os esquemas Zod de `lib/zod-schemas.ts` serão integrados com `react-hook-form` através de `@hookform/resolvers/zod`.
*   **Estado Global/Compartilhado:**
    *   Para dados do usuário autenticado e permissões, `React Context` (em `lib/auth.ts`) pode ser suficiente.
    *   Para dados de servidor que precisam ser cacheados e sincronizados (ex: listas das tabelas), bibliotecas como `SWR` ou `React Query (TanStack Query)` são altamente recomendadas para simplificar data fetching, caching, e revalidação automática. Isso reduzirá a necessidade de gerenciamento manual de loading/error states para chamadas de API.
*   **Estado de UI Complexo:** Para estados de UI complexos que não se encaixam bem no Context ou estado local, `Zustand` pode ser uma alternativa leve ao Redux.

### 2.5. Integração com API RESTful

*   **Cliente HTTP:** Um wrapper para `fetch` ou `axios` será configurado em `services/api-client.ts`. Este wrapper irá:
    *   Adicionar automaticamente o base URL da API.
    *   Incluir o token de autenticação (JWT) nos cabeçalhos das requisições protegidas.
    *   Tratar erros comuns da API e normalizar respostas.
*   **Serviços:**
    *   `services/configuracao.service.ts`: Conterá funções assíncronas para cada endpoint CRUD do módulo de configurações (ex: `getCategorias`, `createCategoria`, etc.).
    *   `services/perfil.service.ts`: Conterá funções para buscar e atualizar dados do perfil do usuário.
*   **Tratamento de Respostas:**
    *   As funções de serviço retornarão os dados parseados (JSON) ou lançarão erros específicos que podem ser tratados nos componentes ou hooks de data fetching (SWR/React Query).
    *   Mensagens de feedback (`FeedbackMessage.tsx`) serão exibidas com base no sucesso ou erro das operações.

## 3. Casos de Uso Frontend (CUF)

### 3.1. CUF14 – Gerenciar Categorias de Serviços

*   **ID do Caso de Uso:** CUF14
*   **Nome:** Gerenciar Categorias de Serviços
*   **Ator Principal:** Administrador
*   **Tela:** `/configuracoes/categorias-servicos`
*   **Descrição:** Permite ao administrador listar, criar, editar, ativar e inativar categorias de serviços.
*   **Componentes IGRP NextJS Engine Sugeridos:**
    *   `DataTable.tsx` para listagem.
    *   `Modal` para formulário de criação/edição.
    *   `Form`, `Input` (text) para o formulário.
    *   `AlertDialog` para confirmação de ativação/inativação.
*   **Estrutura de Componentes Proposta:**
    *   `app/configuracoes/categorias-servicos/page.tsx`: Página principal que orquestra os componentes.
    *   `app/configuracoes/categorias-servicos/components/CategoriasServicosDataTable.tsx`: Tabela para exibir e gerenciar categorias.
        *   **Props:** `data: CategoriaServico[]`, `onEdit: (id: string) => void`, `onToggleStatus: (id: string, status: boolean) => void`, `isLoading: boolean`.
        *   **Colunas:** Nome, Status (renderizado como "Ativo" ou "Inativo" com base no booleano), Ações (botões para Editar, Ativar/Inativar).
    *   `app/configuracoes/categorias-servicos/components/FormularioCategoriaServico.tsx`: Formulário para criar/editar categoria.
        *   **Props:** `isOpen: boolean`, `onClose: () => void`, `onSubmit: (data: CreateCategoriasServicosCommand | UpdateCategoriasServicosCommand) => void`, `initialData?: CategoriaServico`, `isLoading: boolean`.
        *   **Campos:**
            *   `nome`: `Input` tipo texto. Obrigatório. Min. 3 caracteres.
        *   **Validação:** Utilizar `zod` com o schema `createCategoriaServicoSchema` ou `updateCategoriaServicoSchema`.
*   **Fluxo de Interação:**
    1.  **Listar:** Ao carregar a página, o `CategoriasServicosDataTable.tsx` faz uma requisição GET para `configuracao.service.ts` que busca `/api/configuracoes/categorias-servicos`.
        *   Exibe um estado de `loading` (`LoadingSpinner.tsx`) enquanto os dados são carregados.
        *   Em caso de erro, exibe `FeedbackMessage.tsx` com a mensagem de erro.
    2.  **Criar:**
        *   Usuário clica no botão "Nova Categoria".
        *   O `Modal` com `FormularioCategoriaServico.tsx` é aberto.
        *   Usuário preenche o nome da categoria.
        *   Ao submeter:
            *   Validação client-side é executada. Se inválido, exibe mensagens de erro nos campos.
            *   Se válido, `onSubmit` é chamado, que por sua vez invoca uma função em `configuracao.service.ts` para fazer um POST para `/api/configuracoes/categorias-servicos` com `CreateCategoriasServicosCommand`.
            *   Exibe `loading` no botão de submissão.
            *   Após resposta da API:
                *   **Sucesso:** Fecha o modal, atualiza a `CategoriasServicosDataTable.tsx` (re-fetch ou adiciona localmente), exibe `FeedbackMessage.tsx` de sucesso.
                *   **Erro:** Exibe `FeedbackMessage.tsx` com o erro no modal/página.
    3.  **Editar:**
        *   Usuário clica no botão "Editar" de uma categoria na `CategoriasServicosDataTable.tsx`.
        *   O `Modal` com `FormularioCategoriaServico.tsx` é aberto, preenchido com os dados da categoria selecionada.
        *   Usuário modifica os dados.
        *   Ao submeter:
            *   Validação client-side.
            *   Se válido, `onSubmit` é chamado, que invoca PUT para `/api/configuracoes/categorias-servicos/{id}` com `UpdateCategoriasServicosCommand`.
            *   Tratamento de loading, sucesso e erro similar ao de "Criar".
    4.  **Ativar/Inativar:**
        *   Usuário clica no botão "Ativar" ou "Inativar" de uma categoria.
        *   Um `AlertDialog` (`ConfirmacaoDialog.tsx`) é exibido para confirmar a ação.
        *   Ao confirmar:
            *   Chama função em `configuracao.service.ts` para fazer um PUT/PATCH para `/api/configuracoes/categorias-servicos/{id}/status` (ou similar, para atualizar o status).
            *   Exibe `loading`.
            *   Após resposta da API:
                *   **Sucesso:** Atualiza a `CategoriasServicosDataTable.tsx`, exibe `FeedbackMessage.tsx` de sucesso.
                *   **Erro:** Exibe `FeedbackMessage.tsx` com o erro.
*   **Serviços Envolvidos (em `services/configuracao.service.ts`):**
    *   `getCategoriasServicos(): Promise<CategoriaServico[]>`
    *   `createCategoriaServico(data: CreateCategoriasServicosCommand): Promise<CategoriaServico>`
    *   `updateCategoriaServico(id: string, data: UpdateCategoriasServicosCommand): Promise<CategoriaServico>`
    *   `toggleCategoriaServicoStatus(id: string, status: boolean): Promise<void>`
*   **Modelos/DTOs (em `models/configuracoes.models.ts`):**
    *   `interface CategoriaServico { id: string; nome: string; ativo: boolean; }`
    *   `interface CreateCategoriasServicosCommand { nome: string; }` // Usado no corpo do POST
    *   `interface UpdateCategoriasServicosCommand { nome?: string; ativo?: boolean; }` // Usado no corpo do PUT/PATCH
*   **Validação (em `lib/zod-schemas.ts`):**
    *   `export const CategoriaServicoFormSchema = z.object({ nome: z.string().min(3, { message: "configuracoes:validacao.nomeMin" }).max(100, { message: "configuracoes:validacao.nomeMax" }), ativo: z.boolean().optional() });`
    *   `export type CategoriaServicoFormValues = z.infer<typeof CategoriaServicoFormSchema>;`
    *   *Nota: O schema para criação pode ser mais estrito (ex: `ativo` não presente ou `default(true)`), enquanto o de atualização permite campos opcionais.*

### 3.2. CUF15 – Gerenciar Tipos de Serviços

*   **ID do Caso de Uso:** CUF15
*   **Nome:** Gerenciar Tipos de Serviços
*   **Ator Principal:** Administrador
*   **Tela:** `/configuracoes/tipos-servicos`
*   **Descrição:** Permite ao administrador realizar operações CRUD (Criar, Ler, Atualizar, Deletar) para tipos de serviços, associando cada tipo a uma categoria de serviço existente.
*   **Componentes IGRP NextJS Engine Sugeridos:**
    *   `DataTable.tsx`
    *   `Modal`
    *   `Form`, `Input` (text), `Select` (para categorias)
    *   `AlertDialog` para confirmação de exclusão.
*   **Estrutura de Componentes Proposta:**
    *   `app/configuracoes/tipos-servicos/page.tsx`
    *   `app/configuracoes/tipos-servicos/components/TiposServicosDataTable.tsx`:
        *   **Props:** `data: TipoServico[]`, `onEdit: (id: string) => void`, `onDelete: (id: string) => void`, `isLoading: boolean`.
        *   **Colunas:** Nome, Categoria (nome da categoria), Ações (Editar, Excluir).
    *   `app/configuracoes/tipos-servicos/components/FormularioTipoServico.tsx`:
        *   **Props:** `isOpen: boolean`, `onClose: () => void`, `onSubmit: (data: CreateTiposServicosCommand | UpdateTiposServicosCommand) => void`, `initialData?: TipoServico`, `categorias: CategoriaServico[]`, `isLoading: boolean`.
        *   **Campos:**
            *   `nome`: `Input` tipo texto. Obrigatório.
            *   `idCategoria`: `Select`. Obrigatório. As opções são carregadas dinamicamente (categorias ativas).
        *   **Validação:** `createTipoServicoSchema`, `updateTipoServicoSchema`.
*   **Fluxo de Interação (CRUD):**
    1.  **Listar:** Similar ao CUF14, GET para `/api/configuracoes/tipos-servicos`. A lista de categorias (`getCategoriasServicos()`) também é buscada para popular o select no formulário.
    2.  **Criar:**
        *   Botão "Novo Tipo de Serviço" abre `Modal` com `FormularioTipoServico.tsx`.
        *   O `Select` de categorias deve estar populado com as categorias ativas.
        *   Submissão: POST para `/api/configuracoes/tipos-servicos` com `CreateTiposServicosCommand`.
        *   Tratamento de loading, validação, sucesso e erro similar ao CUF14.
    3.  **Editar:**
        *   Botão "Editar" abre `Modal` com `FormularioTipoServico.tsx` preenchido.
        *   Submissão: PUT para `/api/configuracoes/tipos-servicos/{id}` com `UpdateTiposServicosCommand`.
        *   Tratamento similar ao CUF14.
    4.  **Excluir:**
        *   Botão "Excluir" abre `AlertDialog` (`ConfirmacaoDialog.tsx`).
        *   Ao confirmar: DELETE para `/api/configuracoes/tipos-servicos/{id}`.
        *   Tratamento similar ao CUF14 (Ativar/Inativar).
*   **Serviços Envolvidos (em `services/configuracao.service.ts`):**
    *   `getTiposServicos(): Promise<TipoServico[]>`
    *   `createTipoServico(data: CreateTiposServicosCommand): Promise<TipoServico>`
    *   `updateTipoServico(id: string, data: UpdateTiposServicosCommand): Promise<TipoServico>`
    *   `deleteTipoServico(id: string): Promise<void>`
    *   (Reutiliza `getCategoriasServicos()` do CUF14 para o select)
*   **Modelos/DTOs (em `models/configuracoes.models.ts`):**
    *   `interface TipoServico { id: string; nome: string; idCategoria: string; categoria?: { id: string; nome: string }; }` // `categoria` pode ser incluído na resposta da API
    *   `interface CreateTiposServicosCommand { nome: string; idCategoria: string; }`
    *   `interface UpdateTiposServicosCommand { nome?: string; idCategoria?: string; }`
*   **Validação (em `lib/zod-schemas.ts`):**
    *   `export const TipoServicoFormSchema = z.object({ nome: z.string().min(3, { message: "configuracoes:validacao.nomeMin" }), idCategoria: z.string().uuid({ message: "configuracoes:validacao.categoriaInvalida" }) });`
    *   `export type TipoServicoFormValues = z.infer<typeof TipoServicoFormSchema>;`
    *   *Nota: Para atualização, os campos podem ser `.optional()` no schema se a API permitir atualizações parciais.*

### 3.3. CUF16 – Gerenciar Status de Pedidos

*   **ID do Caso de Uso:** CUF16
*   **Nome:** Gerenciar Status de Pedidos
*   **Ator Principal:** Administrador
*   **Tela:** `/configuracoes/status-pedidos`
*   **Descrição:** Permite ao administrador realizar CRUD para status de pedidos, definindo nome, cor e ordem de exibição.
*   **Componentes IGRP NextJS Engine Sugeridos:**
    *   `DataTable.tsx`
    *   `Modal`
    *   `Form`, `Input` (text, color, number)
    *   `AlertDialog`
*   **Estrutura de Componentes Proposta:**
    *   `app/configuracoes/status-pedidos/page.tsx`
    *   `app/configuracoes/status-pedidos/components/StatusPedidosDataTable.tsx`:
        *   **Props:** `data: StatusPedido[]`, `onEdit: (id: string) => void`, `onDelete: (id: string) => void`, `isLoading: boolean`.
        *   **Colunas:** Nome, Cor (renderizar um swatch da cor), Ordem, Ações.
    *   `app/configuracoes/status-pedidos/components/FormularioStatusPedido.tsx`:
        *   **Props:** `isOpen: boolean`, `onClose: () => void`, `onSubmit: (data: CreateStatusPedidoCommand | UpdateStatusPedidoCommand) => void`, `initialData?: StatusPedido`, `isLoading: boolean`.
        *   **Campos:**
            *   `nome`: `Input` tipo texto. Obrigatório.
            *   `cor`: `Input` tipo `color` (HTML5 color picker) ou texto (hex). Obrigatório.
            *   `ordem`: `Input` tipo `number`. Obrigatório, inteiro positivo.
        *   **Validação:** `createStatusPedidoSchema`, `updateStatusPedidoSchema`.
*   **Fluxo de Interação (CRUD):**
    1.  **Listar:** GET para `/api/configuracoes/status-pedidos`. Ordenar pela coluna `ordem`.
    2.  **Criar:** POST para `/api/configuracoes/status-pedidos` com `CreateStatusPedidoCommand`.
    3.  **Editar:** PUT para `/api/configuracoes/status-pedidos/{id}` com `UpdateStatusPedidoCommand`.
    4.  **Excluir:** DELETE para `/api/configuracoes/status-pedidos/{id}` com confirmação.
    *   Tratamento de loading, validação, sucesso e erro similar aos CUs anteriores.
*   **Serviços Envolvidos (em `services/configuracao.service.ts`):**
    *   `getStatusPedidos(): Promise<StatusPedido[]>`
    *   `createStatusPedido(data: CreateStatusPedidoCommand): Promise<StatusPedido>`
    *   `updateStatusPedido(id: string, data: UpdateStatusPedidoCommand): Promise<StatusPedido>`
    *   `deleteStatusPedido(id: string): Promise<void>`
*   **Modelos/DTOs (em `models/configuracoes.models.ts`):**
    *   `interface StatusPedido { id: string; nome: string; cor: string; ordem: number; }`
    *   `interface CreateStatusPedidoCommand { nome: string; cor: string; ordem: number; }`
    *   `interface UpdateStatusPedidoCommand { nome?: string; cor?: string; ordem?: number; }`
*   **Validação (em `lib/zod-schemas.ts`):**
    *   `export const StatusPedidoFormSchema = z.object({ nome: z.string().min(3, { message: "configuracoes:validacao.nomeMin" }), cor: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/, { message: "configuracoes:validacao.corInvalida" }), ordem: z.number().int().positive({ message: "configuracoes:validacao.ordemInvalida" }) });`
    *   `export type StatusPedidoFormValues = z.infer<typeof StatusPedidoFormSchema>;`
    *   *Nota: Para atualização, os campos podem ser `.optional()`.*

### 3.4. CUF_USER_PROFILE – Gerenciar Perfil do Usuário (Usuário Autenticado)

*   **ID do Caso de Uso:** CUF_USER_PROFILE
*   **Nome:** Gerenciar Perfil do Usuário
*   **Atores:** Usuário Autenticado, Administrador (pode ter visão/edição expandida, TBD)
*   **Tela:** `/perfil-usuario`
*   **Componentes Principais:**
    *   `pages/perfil-usuario/page.tsx`
    *   `components/perfil-usuario/FormularioPerfilUsuario.tsx`
*   **Funcionalidades:**
    *   **Visualizar Perfil:** Exibir informações do usuário logado (Nome, Email, etc.).
    *   **Editar Perfil:**
        *   Permitir a edição de campos como nome, telefone (se aplicável).
        *   O campo de email geralmente não é editável ou requer um fluxo de verificação.
        *   Opção para alterar senha (pode ser um fluxo separado/modal).
        *   Validação client-side.
        *   Submissão chama o serviço para atualizar o perfil (`perfil.service.ts`).
        *   Feedback de sucesso/erro (`FeedbackMessage.tsx`).
*   **Componentes Adicionais:**
    *   `app/perfil-usuario/components/AlterarSenhaModal.tsx`: Modal específico para o fluxo de alteração de senha, contendo campos para senha atual, nova senha e confirmação da nova senha.
        *   **Validação:** Esquema Zod específico para alteração de senha (`AlterarSenhaSchema`).
*   **Serviços Envolvidos (em `services/perfil.service.ts`):**
    *   `getMeuPerfil(): Promise<UserProfile>`
    *   `updateMeuPerfil(data: UpdateUserProfileCommand): Promise<UserProfile>`
    *   `alterarMinhaSenha(data: AlterarSenhaCommand): Promise<void>`
*   **Modelos/DTOs (em `models/perfil.models.ts`):**
    *   `interface UserProfile { id: string; nome: string; email: string; telefone?: string; /* outros campos relevantes */ }`
    *   `interface UpdateUserProfileCommand { nome?: string; telefone?: string; /* outros campos editáveis */ }`
    *   `interface AlterarSenhaCommand { senhaAtual: string; novaSenha: string; confirmacaoNovaSenha: string; }`
*   **Validação (em `lib/zod-schemas.ts`):**
    *   `export const UpdateUserProfileSchema = z.object({ nome: z.string().min(3, { message: "perfil:validacao.nomeMin" }), telefone: z.string().optional().refine(val => !val || /^\d{9,15}$/.test(val), { message: "perfil:validacao.telefoneInvalido" }) });`
    *   `export type UpdateUserProfileFormValues = z.infer<typeof UpdateUserProfileSchema>;`
    *   `export const AlterarSenhaSchema = z.object({ senhaAtual: z.string().min(1, { message: "perfil:validacao.senhaAtualObrigatoria" }), novaSenha: z.string().min(8, { message: "perfil:validacao.novaSenhaMin" }), confirmacaoNovaSenha: z.string() }).refine(data => data.novaSenha === data.confirmacaoNovaSenha, { message: "perfil:validacao.senhasNaoConferem", path: ["confirmacaoNovaSenha"] });`
    *   `export type AlterarSenhaFormValues = z.infer<typeof AlterarSenhaSchema>;`

## 4. Componentes IGRP NextJS Engine Utilizados

*   **Formulários:** `Form` (wrapper), `Input` (text, number, email, password, color), `Select`.
*   **Layout e Estrutura:** `Tabs` (se necessário para organizar seções dentro de uma página), `Modal` (para formulários de criação/edição).
*   **Exibição de Dados:** `DataTable` (para listagens com ordenação, paginação e filtros).
*   **Feedback ao Usuário:** `AlertDialog` (para confirmações de ações destrutivas), componentes customizados para mensagens de sucesso/erro (`FeedbackMessage.tsx`).
*   **Indicadores:** Componente customizado para loading (`LoadingSpinner.tsx`).

## 5. Requisitos Técnicos Transversais

Estes requisitos aplicam-se a todo o módulo desenvolvido.

### 5.1. Validação Client-Side

*   **Biblioteca:** `Zod` será utilizada para a definição de esquemas e validação.
*   **Integração:** Os esquemas Zod (definidos em `lib/zod-schemas.ts`) serão integrados com `react-hook-form` usando `@hookform/resolvers/zod` para validação automática e exibição de mensagens de erro nos formulários.
*   **Feedback:** Mensagens de erro devem ser claras, específicas para o campo e internacionalizadas.
*   **Exemplo de Schema (já detalhado nos CUs, centralizado em `lib/zod-schemas.ts`):**
    ```typescript
    // Exemplo em lib/zod-schemas.ts
    import { z } from 'zod';

    export const CategoriaServicoCreateSchema = z.object({
      nome: z.string().min(3, { message: "configuracoes:validacao.nomeMin" }).max(100, { message: "configuracoes:validacao.nomeMax" }),
      // 'ativo' pode ser opcional na criação, com default no backend ou no DTO
    });
    export type CategoriaServicoCreateValues = z.infer<typeof CategoriaServicoCreateSchema>;

    export const CategoriaServicoUpdateSchema = z.object({
      id: z.string().uuid(),
      nome: z.string().min(3, { message: "configuracoes:validacao.nomeMin" }).max(100, { message: "configuracoes:validacao.nomeMax" }).optional(),
      ativo: z.boolean().optional(),
    });
    export type CategoriaServicoUpdateValues = z.infer<typeof CategoriaServicoUpdateSchema>;
    ```
    *Nota: As mensagens de erro (ex: "configuracoes:validacao.nomeMin") são chaves que serão resolvidas pelo sistema de i18n.*

### 5.2. Internacionalização (i18n)

*   **Biblioteca:** `next-international` (ou similar, como `next-i18next` se preferido) será usada para i18n.
*   **Estrutura de Arquivos:** Conforme definido em `/src/locales/{lang}/{namespace}.json`.
    *   `common.json`: Textos comuns (Salvar, Cancelar, Erro, Sucesso).
    *   `configuracoes.json`: Textos específicos do módulo de configurações.
    *   `perfil.json`: Textos específicos do módulo de perfil.
*   **Uso nos Componentes:**
    *   Utilização de hooks fornecidos pela biblioteca de i18n (ex: `useScopedI18n` ou `useI18n`).
    *   Exemplo: `const { t } = useScopedI18n('configuracoes'); <Button>{t('categorias.nova')}</Button>`
*   **Suporte a Idiomas:** Inicialmente Português (pt) e Inglês (en).

### 5.3. Responsividade

*   **Abordagem:** Mobile-first ou Desktop-first, a ser definido, mas todos os componentes e páginas devem ser totalmente responsivos.
*   **Técnicas:**
    *   Uso de CSS Flexbox e Grid para layouts fluidos.
    *   Media queries para ajustes específicos de breakpoints.
    *   Componentes de UI (como `DataTable`) devem oferecer modos responsivos ou permitir configuração para diferentes viewports (ex: ocultar colunas menos importantes em telas menores).
    *   Se uma biblioteca de componentes como ShadCN/UI for usada, aproveitar suas capacidades responsivas.

### 5.4. Estados de Loading, Sucesso e Erro

*   **Loading:**
    *   **Nível de Página/Seção:** `LoadingSpinner.tsx` centralizado ou esqueletos de UI (shimmer effect) para carregamento inicial de dados.
    *   **Nível de Componente/Ação:** Botões de submissão devem exibir um indicador de loading e serem desabilitados durante a ação (ex: `<Button disabled={isLoading}>{isLoading ? <LoadingSpinner size="sm" /> : 'Salvar'}</Button>`).
*   **Sucesso:**
    *   **Mensagens Globais/Toast:** Uso de um sistema de "toast" notifications (ex: `react-hot-toast` ou similar) para feedback não intrusivo de sucesso (ex: "Categoria salva com sucesso!"). O `FeedbackMessage.tsx` pode ser um wrapper para isso.
    *   **Atualização de UI:** A UI deve refletir o estado atualizado imediatamente (ex: nova linha na tabela, dados do formulário resetados/atualizados).
*   **Erro:**
    *   **Mensagens Globais/Toast:** Para erros genéricos da API ou de rede.
    *   **Feedback no Formulário:** Erros de validação do backend ou específicos de uma operação devem ser exibidos próximos aos campos relevantes ou em uma área de sumário de erros no formulário/modal.
    *   **Páginas de Erro Dedicadas:** Para erros críticos (404, 500), usar as convenções do Next.js (`not-found.tsx`, `error.tsx`).
*   **Consistência:** O feedback visual e textual deve ser consistente em toda a aplicação.

### 5.5. Controle de Permissões por Perfil (Frontend)

*   **Obtenção de Permissões:**
    *   As informações do perfil do usuário (incluindo seu papel/permissões) devem ser carregadas no momento do login e disponibilizadas globalmente, preferencialmente via React Context (`AuthContext` em `lib/auth.ts`).
    *   Um hook `useAuth()` ou `usePermissions()` em `lib/auth.ts` fornecerá acesso a essas informações.
    ```typescript
    // Exemplo em lib/auth.ts
    // interface AuthContextType {
    //   user: User | null;
    //   hasPermission: (permission: string) => boolean; // ou roles: string[]
    //   isAdmin: boolean;
    // }
    // export const useAuth = () => useContext(AuthContext);
    ```
*   **Aplicação de Permissões:**
    1.  **Nível de Rota/Layout:**
        *   Em `app/configuracoes/layout.tsx`, verificar se o usuário é Administrador. Se não, redirecionar para uma página de "Acesso Negado" ou para a home.
        *   Componentes Server Side podem verificar permissões e redirecionar ou retornar UI alternativa.
    2.  **Nível de Componente/Elemento:**
        *   Renderização condicional de botões, links ou seções da UI.
        *   Ex: `<Button disabled={!auth.isAdmin} onClick={handleNovaCategoria}>Nova Categoria</Button>`
        *   Ocultar ou desabilitar elementos com base nas permissões.
*   **Segurança:** A verificação de permissões no frontend é para UX. A aplicação real da segurança **DEVE** ser feita no backend.

## 6. Diagrama de Fluxo (Exemplo Simplificado)

```mermaid
graph TD
    A[Usuário acessa /configuracoes] --> B{Perfil Admin?};
    B -- Sim --> C[Menu de Configurações Visível];
    B -- Não --> D[Redireciona/Oculta Menu];

    C --> E[/configuracoes/categorias-servicos];
    E --> F{DataTable Categorias};
    F -- Nova Categoria --> G[Modal com FormularioCategoriaServico];
    G -- Salvar --> H{Validação Client-Side};
    H -- Válido --> I[API POST /categorias-servicos];
    I -- Sucesso --> J[Atualiza DataTable, Exibe Sucesso];
    I -- Erro --> K[Exibe Erro no Formulário/Modal];
    H -- Inválido --> L[Exibe Erro de Validação no Formulário];

    F -- Editar Categoria --> M[Modal com FormularioCategoriaServico (dados preenchidos)];
    M -- Salvar --> N{Validação Client-Side};
    N -- Válido --> O[API PUT /categorias-servicos/:id];
    O -- Sucesso --> P[Atualiza DataTable, Exibe Sucesso];
    O -- Erro --> Q[Exibe Erro no Formulário/Modal];
    N -- Inválido --> R[Exibe Erro de Validação no Formulário];

    F -- Ativar/Inativar --> S[AlertDialog Confirmação];
    S -- Confirmar --> T[API PUT /categorias-servicos/:id/status];
    T -- Sucesso --> U[Atualiza DataTable, Exibe Sucesso];
    T -- Erro --> V[Exibe Erro];
```
*(Este diagrama pode ser expandido para incluir os outros casos de uso, como Tipos de Serviços, Status de Pedidos e Perfil de Usuário, seguindo fluxos similares de CRUD e interação com modais/API.)*

### 6.1. Diagrama de Fluxo Geral do Módulo de Configurações

```mermaid
graph TD
    subgraph "Autenticação e Autorização"
        Start(Início) --> CheckAuth{Usuário Autenticado?};
        CheckAuth -- Não --> LoginPage[Página de Login];
        CheckAuth -- Sim --> CheckAdmin{Usuário é Admin?};
    end

    subgraph "Módulo de Configurações (Admin)"
        CheckAdmin -- Sim --> ConfigMenu[Acesso ao Menu Configurações];
        ConfigMenu --> CatServ[/configuracoes/categorias-servicos];
        ConfigMenu --> TipServ[/configuracoes/tipos-servicos];
        ConfigMenu --> StatPed[/configuracoes/status-pedidos];

        CatServ --> OpCat{Operações CRUD Categorias};
        TipServ --> OpTip{Operações CRUD Tipos};
        StatPed --> OpStat{Operações CRUD Status};

        OpCat --> API_Cat[API Endpoints Categorias];
        OpTip --> API_Tip[API Endpoints Tipos];
        OpStat --> API_Stat[API Endpoints Status];

        API_Cat --> FeedbackCat[Feedback UI Categorias];
        API_Tip --> FeedbackTip[Feedback UI Tipos];
        API_Stat --> FeedbackStat[Feedback UI Status];
    end

    subgraph "Módulo Perfil de Usuário (Usuário Autenticado)"
        CheckAdmin -- Não --> UserProfileAccess{Acesso ao Perfil?};
        UserProfileAccess -- Sim --> PerfilPage[/perfil-usuario];
        LoginPage -- Sucesso Login --> DecidePath{Verifica Perfil Pós-Login};
        DecidePath -- Admin --> ConfigMenu;
        DecidePath -- User --> PerfilPage;

        PerfilPage --> ViewPerfil[Visualizar Perfil];
        PerfilPage --> EditPerfilModal[Abrir Modal Edição Perfil];
        EditPerfilModal --> SubmitEditPerfil{Submeter Edição};
        SubmitEditPerfil --> API_Perfil[API Endpoint Perfil];
        API_Perfil --> FeedbackPerfil[Feedback UI Perfil];
    end

    style LoginPage fill:#f9f,stroke:#333,stroke-width:2px
    style ConfigMenu fill:#ccf,stroke:#333,stroke-width:2px
    style PerfilPage fill:#cfc,stroke:#333,stroke-width:2px
```

## 7. Mapeamento de Permissões

| Rota                                  | Ação             | Perfil Administrador | Perfil Usuário Autenticado |
| ------------------------------------- | ---------------- | -------------------- | -------------------------- |
| `/configuracoes/*`                    | Acesso à Rota    | Permitido            | Negado                     |
| `/configuracoes/categorias-servicos`  | Listar           | Permitido            | Negado                     |
| `/configuracoes/categorias-servicos`  | Criar            | Permitido            | Negado                     |
| `/configuracoes/categorias-servicos`  | Editar           | Permitido            | Negado                     |
| `/configuracoes/categorias-servicos`  | Ativar/Inativar  | Permitido            | Negado                     |
| `/configuracoes/tipos-servicos`       | Listar           | Permitido            | Negado                     |
| `/configuracoes/tipos-servicos`       | Criar            | Permitido            | Negado                     |
| `/configuracoes/tipos-servicos`       | Editar           | Permitido            | Negado                     |
| `/configuracoes/tipos-servicos`       | Excluir          | Permitido            | Negado                     |
| `/configuracoes/status-pedidos`       | Listar           | Permitido            | Negado                     |
| `/configuracoes/status-pedidos`       | Criar            | Permitido            | Negado                     |
| `/configuracoes/status-pedidos`       | Editar           | Permitido            | Negado                     |
| `/configuracoes/status-pedidos`       | Excluir          | Permitido            | Negado                     |
| `/perfil-usuario`                     | Acesso à Rota    | Permitido            | Permitido                  |
| `/perfil-usuario`                     | Visualizar       | Permitido            | Permitido (próprio perfil) |
| `/perfil-usuario`                     | Editar           | Permitido (verificar escopo) | Permitido (próprio perfil) |

## 8. Estratégia de Testes Automatizados

*   **Testes Unitários (Jest + React Testing Library):**
    *   Testar componentes individuais (renderização, props, estado inicial).
    *   Testar funções utilitárias e hooks customizados (ex: `usePermission`, validadores).
    *   Mockar chamadas de serviço para isolar a lógica do componente.
    *   Exemplo: Testar se o `FormularioCategoriaServico.tsx` renderiza os campos corretos e se a validação de `nome` funciona.
*   **Testes de Integração (Jest + React Testing Library):**
    *   Testar a interação entre múltiplos componentes em uma página.
    *   Exemplo: Testar o fluxo completo de abrir o modal de nova categoria, preencher o formulário, submeter e verificar se a tabela é atualizada (com serviços mockados).
*   **Testes End-to-End (Cypress ou Playwright):**
    *   Testar fluxos completos do usuário através da interface.
    *   Exemplo:
        1.  Login como Administrador.
        2.  Navegar para `/configuracoes/categorias-servicos`.
        3.  Criar uma nova categoria.
        4.  Verificar se a categoria aparece na tabela.
        5.  Editar a categoria.
        6.  Inativar a categoria.
        7.  Logout.
*   **Cobertura de Teste:** Definir um objetivo de cobertura de código (ex: 70-80%) para garantir a qualidade.

## 9. Observações sobre Reutilização de Componentes

*   **Componentes de Formulário Genéricos:** Se houver muitos formulários com estruturas semelhantes, criar componentes genéricos como `ManagedForm`, `ManagedInput`, `ManagedSelect` que encapsulem lógica de estado, validação e integração com bibliotecas de formulário (como `react-hook-form` se adotada).
*   **DataTable Genérica:** O componente `DataTable` deve ser configurável o suficiente para ser usado em todas as listagens, aceitando definições de colunas, dados e callbacks para ações.
*   **Modal/Dialog de Confirmação:** `ConfirmacaoDialog.tsx` pode ser reutilizado para todas as ações que exigem confirmação do usuário (excluir, ativar/inativar).
*   **Feedback de Ações:** O componente `FeedbackMessage.tsx` (para exibir sucesso/erro) deve ser padronizado e reutilizado após todas as interações com o backend.
*   **Layout de Página:** Um componente `PageLayout` pode ser criado para encapsular a estrutura comum das páginas do módulo de configurações (título, botões de ação principais).

## 10. Considerações Finais

*   A nomenclatura de arquivos e componentes deve seguir um padrão consistente (ex: PascalCase para componentes React, camelCase para funções e variáveis).
*   Comentários no código devem ser adicionados para explicar lógicas complexas ou decisões de design.
*   A performance deve ser monitorada, especialmente em listagens com grande volume de dados (considerar virtualização se necessário).
*   Manter as dependências atualizadas e seguir as melhores práticas de segurança para desenvolvimento frontend.

Este documento serve como guia inicial e pode ser atualizado conforme o desenvolvimento avança e novos requisitos surgem.
