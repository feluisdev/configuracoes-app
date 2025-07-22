/**
 * Representa um Status de Pedido como exibido na UI.
 * Baseado em StatusPedidoResponseDTO.java
 */
export interface StatusPedido {
  id: number; // Backend usa Integer para ID
  statusPedidoId: string; // Backend usa UUID para ID
  codigo: string;
  nome: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  ordem?: number;
  visivelPortal?: boolean;
  estado?: 'ATIVO' | 'INATIVO'; 
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
