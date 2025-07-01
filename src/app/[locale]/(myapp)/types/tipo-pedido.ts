
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
