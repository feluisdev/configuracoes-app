// Baseado na análise dos DTOs do backend (ex: CategoriasServicosResponseDTO, ListaCategoriaDTO, CriarCategoriasServicosDTO)

/**
 * Representa uma Categoria de Serviço como exibida na lista ou em detalhes.
 * Combina campos de CategoriasServicosResponseDTO e ListaCategoriaDTO.
 */
export interface CategoriaServico {
  id?: number; // Do CategoriasServicosResponseDTO e ListaCategoriaDTO (Integer no backend)
  categoriaId: string; // Do ListaCategoriaDTO (String no backend, parece ser o UUID/identificador principal para algumas operações)
  nome: string;
  codigo: string;
  descricao?: string;
  icone?: string;
  cor?: string;
  ordem?: number;
  ativo?: boolean; // Do CategoriasServicosResponseDTO (boolean)
  estado?: string; // Do ListaCategoriaDTO (String: "ATIVO", "INATIVO") - Usar para exibição na tabela, 'ativo' para lógica.
}

/**
 * DTO para criar uma nova Categoria de Serviço.
 * Baseado em CriarCategoriasServicosDTO.java
 */
export interface CreateCategoriasServicosCommand {
  nome: string;
  codigo: string;
  descricao?: string;
  icone?: string;
  cor?: string;
  ordem?: number;
  ativo?: boolean; // Backend espera boolean
}

/**
 * Comando para atualizar uma Categoria de Serviço.
 * Baseado em UpdateCategoriaServicoCommand.java
 * No backend, este comando encapsula um CriarCategoriasServicosDTO e o ID.
 */
export interface UpdateCategoriasServicosCommand {
  categoriaServicoId: string; // ID da categoria a ser atualizada
  criarcategoriasservicos: CreateCategoriasServicosCommand; // Todos os campos são reenviados
}


/**
 * Wrapper para a lista paginada de Categorias de Serviço.
 * Baseado em WrapperListaCategoriaServicoDTO.java
 */
export interface WrapperListaCategoriaServicoDTO {
  content: CategoriaServico[]; // Ajustado para usar a interface CategoriaServico unificada
  // Campos de PageDTO (do backend cv.igrp.simple.shared.application.dto.PageDTO)
  // Estes campos precisam ser confirmados olhando a definição de PageDTO no backend.
  // Exemplo:
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number; // número da página atual (geralmente 0-indexed)
  first?: boolean;
  last?: boolean;
  empty?: boolean;
  // Outros campos de paginação que possam existir...
}


// --- Modelos para Tipos de Serviços (CUF15) ---
export interface TipoServico {
  id?: number; // ou string se for UUID
  tipoServicoId: string; // Identificador principal
  nome: string;
  // categoriaId: string; // ID da categoria associada
  categoria?: { // Pode vir aninhado na resposta
    id?: number;
    categoriaId: string;
    nome: string;
  };
  idCategoria?: string; // Para envio no formulário, se não aninhado
  ativo?: boolean;
  estado?: string;
  // Outros campos conforme DTOs do backend (ex: TiposServicosResponseDTO, CriarTiposServicosDTO)
  codigo?: string; // Exemplo, verificar backend
  descricao?: string; // Exemplo, verificar backend
}

export interface CreateTiposServicosCommand {
  nome: string;
  idCategoria: string; // ID da CategoriaServico associada
  codigo?: string;
  descricao?: string;
  ativo?: boolean;
}

export interface UpdateTiposServicosCommand {
  tipoServicoId: string;
  // Similar ao UpdateCategoria, pode encapsular o DTO de criação
  criarTiposServicos: CreateTiposServicosCommand; // Ou campos individuais opcionais
}

export interface WrapperListaTipoServicoDTO {
  content: TipoServico[];
  totalPages?: number;
  totalElements?: number;
  // ... outros campos de PageDTO
}


// --- Modelos para Status de Pedidos (CUF16) ---
export interface StatusPedido {
  id?: number; // ou string
  statusPedidoId: string; // Identificador principal
  nome: string;
  cor: string; // ex: "#RRGGBB"
  ordem: number;
  ativo?: boolean;
  estado?: string;
  // Outros campos conforme DTOs do backend (ex: StatusPedidoResponseDTO, CreateStatusPedidoDTO)
  codigo?: string; // Exemplo, verificar backend
  descricao?: string; // Exemplo, verificar backend
}

export interface CreateStatusPedidoCommand {
  nome: string;
  cor: string;
  ordem: number;
  codigo?: string;
  descricao?: string;
  ativo?: boolean;
}

export interface UpdateStatusPedidoCommand {
  statusPedidoId: string;
  // Similar aos outros, pode encapsular o DTO de criação
  criarStatusPedido: CreateStatusPedidoCommand; // Ou campos individuais opcionais
}

export interface WrapperListaStatusPedidoDTO {
  content: StatusPedido[];
  totalPages?: number;
  totalElements?: number;
  // ... outros campos de PageDTO
}
