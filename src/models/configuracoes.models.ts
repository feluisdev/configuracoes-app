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
  codigo: string;
  descricao?: string;
  prazoEstimado?: number;
  valorBase?: number;
  requerVistoria?: boolean;
  requerAnaliseTec?: boolean;
  requerAprovacao?: boolean;
  disponivelPortal?: boolean;
}

/**
 * DTO para criar um novo Tipo de Serviço.
 * Baseado em CriarTiposServicosDTO.java
 */
export interface CreateTiposServicosCommand {
  categoriaId: string; // No backend é categoriaId
  codigo: string;
  nome: string;
  descricao?: string;
  prazoEstimado?: number;
  valorBase?: number;
  requerVistoria?: boolean;
  requerAnaliseTec?: boolean;
  requerAprovacao?: boolean;
  disponivelPortal?: boolean;
  ativo?: boolean;
}

/**
 * Comando para atualizar um Tipo de Serviço.
 * Baseado em UpdateTipoServicoCommand.java
 */
export interface UpdateTiposServicosCommand {
  tipoServicoId: string; // ID do tipo de serviço a ser atualizado
  criartiposservicos: CreateTiposServicosCommand; // Todos os campos são reenviados
}

/**
 * Wrapper para a lista paginada de Tipos de Serviço.
 * Baseado em WrapperListaTipoServicoDTO.java
 */
export interface WrapperListaTipoServicoDTO {
  content: TipoServico[]; // Ajustado para usar a interface TipoServico unificada
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}


// --- Modelos para Status de Pedidos (CUF16) ---

/**
 * Representa um Status de Pedido como exibido na UI.
 * Baseado em StatusPedidoResponseDTO.java
 */
export interface StatusPedido {
  id: number; // Backend usa Integer para ID
  // statusPedidoId?: string; // O backend parece usar apenas 'id' (Integer) como identificador principal
  codigo: string;
  nome: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  ordem?: number;
  visivelPortal?: boolean;
  // Para consistência com outras entidades na UI, podemos adicionar 'estado'
  estado?: 'ATIVO' | 'INATIVO'; // Derivado de visivelPortal ou outra lógica de ativação
}

/**
 * DTO para criar um novo Status de Pedido.
 * Baseado em CreateStatusPedidoDTO.java
 */
export interface CreateStatusPedidoCommand {
  codigo: string;
  nome: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  ordem?: number;
  visivelPortal: boolean; // Obrigatório no backend DTO
}

/**
 * Comando para atualizar um Status de Pedido.
 * Baseado em UpdateStatusPedidoCommand.java (que tem campos individuais)
 */
export interface UpdateStatusPedidoCommand {
  id: number; // ID do status a ser atualizado
  codigo?: string;
  nome?: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  ordem?: number;
  visivelPortal?: boolean;
}

/**
 * Representa a estrutura de página do Spring Data Page<StatusPedidoResponseDTO>.
 */
export interface PageStatusPedidoResponse {
  content: StatusPedido[]; // StatusPedidoResponseDTO mapeado para nossa interface StatusPedido
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page number (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements?: number;
  // Adicionar outros campos de Pageable se necessário (sort, pageable, etc.)
  // sort?: { sorted: boolean; unsorted: boolean; empty: boolean };
  // pageable?: { offset: number; pageNumber: number; pageSize: number; paged: boolean; unpaged: boolean; };
}
