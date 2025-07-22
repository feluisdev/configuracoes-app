/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusPedido, CreateStatusPedidoCommand, UpdateStatusPedidoCommand, PageStatusPedidoResponse } from "../types/status-pedido";

// Constantes para URLs da API
const API_ENDPOINTS = {
  STATUS_PEDIDOS: '/api/status-pedido',
  STATUS_PEDIDO_BY_ID: (id: string) => `/api/status-pedido/${id}`
};

// Tipos de resposta para as funções
export type FetchStatusPedidosResponse = {
  list: StatusPedido[];
  options: Array<{ label: string; value: string }>;
  total: number;
  message: string;
};

type StatusBadgeResponse = {
  iconName?: string;
  bgClass?: string;
  textClass?: string;
  label?: string;
  className?: string;
};

// Opções para filtrar status de pedido
export type FetchStatusPedidosOptions = {
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
};


/**
 * Busca status de pedido com opções de filtragem e paginação
 * 
 * @param {FetchStatusPedidosOptions} options - Opções para filtragem e paginação
 * @param {string} options.search - Termo de busca para filtrar por nome ou código
 * @param {number} options.page - Número da página para paginação
 * @param {number} options.size - Tamanho da página para paginação
 * @param {string} options.sort - Campo e direção para ordenação
 * @returns {Promise<FetchStatusPedidosResponse>} Dados dos status de pedido filtrados e metadados
 * @throws {Error} Se a requisição falhar
 */
export async function fetchStatusPedidos(options: FetchStatusPedidosOptions = {}): Promise<FetchStatusPedidosResponse> {
    const { search = '', page, size, sort } = options;
    
    try {
        // Construir query params para paginação e ordenação
        const queryParams = new URLSearchParams();
        if (page !== undefined) queryParams.append('page', page.toString());
        if (size !== undefined) queryParams.append('size', size.toString());
        if (sort) queryParams.append('sort', sort);
        
        const queryString = queryParams.toString();
        const url = `${API_ENDPOINTS.STATUS_PEDIDOS}${queryString ? `?${queryString}` : ''}`;
        
        const res = await fetch(url);

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao buscar status de pedido: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }

        const raw = await res.json();
        let statusPedidos: StatusPedido[] = [];
        let total = 0;
        
        // Verificar se a resposta é um wrapper de paginação ou array direto
        if (raw.content && Array.isArray(raw.content)) {
            // Resposta paginada
            const typedResponse = raw as PageStatusPedidoResponse;
            statusPedidos = typedResponse.content;
            total = typedResponse.totalElements || statusPedidos.length;
        } else if (Array.isArray(raw)) {
            // Array direto
            statusPedidos = raw as StatusPedido[];
            total = statusPedidos.length;
        }

        // Filtrar por termo de busca se necessário
        const filtered = search 
            ? statusPedidos.filter(
                (sp: StatusPedido) =>
                    sp.nome.toLowerCase().includes(search.toLowerCase()) ||
                    sp.codigo.toLowerCase().includes(search.toLowerCase())
              )
            : statusPedidos;

        return {
            list: filtered,
            options: [{ label: 'Ativo', value: 'ATIVO' }, { label: 'Inativo', value: 'INATIVO' }],
            total: filtered.length,
            message:
                filtered.length > 0 ? 'Dados carregados com sucesso' : 'Nenhum status de pedido encontrado',
        };
    } catch (error) {
        console.error('Erro ao buscar status de pedido:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao buscar status de pedido');
    }
}

/**
 * Busca um status de pedido pelo ID
 * 
 * @param {string} id - ID do status de pedido a ser buscado
 * @returns {Promise<StatusPedido>} Dados do status de pedido
 * @throws {Error} Se a requisição falhar ou o status de pedido não for encontrado
 */
export async function fetchStatusPedidoById(id: string): Promise<StatusPedido> {
    try {
        const res = await fetch(API_ENDPOINTS.STATUS_PEDIDO_BY_ID(id));
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao buscar status de pedido: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar status de pedido por ID:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao buscar status de pedido');
    }
}

/**
 * Cria um novo status de pedido
 * 
 * @param {CreateStatusPedidoCommand} data - Dados do status de pedido a ser criado
 * @returns {Promise<StatusPedido>} Dados do status de pedido criado
 * @throws {Error} Se a requisição falhar
 */
export async function createStatusPedido(data: CreateStatusPedidoCommand): Promise<StatusPedido> {
    try {
        console.log('[ACTION][CREATE_STATUS_PEDIDO] Enviando dados:', data);
        console.log('[ACTION][CREATE_STATUS_PEDIDO] URL:', API_ENDPOINTS.STATUS_PEDIDOS);
        
        const res = await fetch(API_ENDPOINTS.STATUS_PEDIDOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        console.log('[ACTION][CREATE_STATUS_PEDIDO] Resposta status:', res.status, res.statusText);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('[ACTION][CREATE_STATUS_PEDIDO] Erro texto completo:', errorText);
            
            let errorData = null;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                console.error('[ACTION][CREATE_STATUS_PEDIDO] Erro ao parsear resposta JSON:', e);
            }
            
            throw new Error(
                `Erro ao criar status de pedido: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ` - ${errorText}`}`
            );
        }
        
        const responseData = await res.json();
        console.log('[ACTION][CREATE_STATUS_PEDIDO] Resposta dados:', responseData);
        return responseData;
    } catch (error) {
        console.error('[ACTION][CREATE_STATUS_PEDIDO] Erro ao criar status de pedido:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao criar status de pedido');
    }
}

/**
 * Atualiza um status de pedido existente
 * 
 * @param {string} id - ID do status de pedido a ser atualizado
 * @param {UpdateStatusPedidoCommand} data - Dados atualizados do status de pedido
 * @returns {Promise<StatusPedido>} Dados do status de pedido atualizado
 * @throws {Error} Se a requisição falhar
 */
export async function updateStatusPedido(id: string, data: UpdateStatusPedidoCommand): Promise<StatusPedido> {
    try {
        const res = await fetch(API_ENDPOINTS.STATUS_PEDIDO_BY_ID(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao atualizar status de pedido: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao atualizar status de pedido:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao atualizar status de pedido');
    }
}

/**
 * Inativa um status de pedido
 * 
 * @param {string} id - ID do status de pedido a ser inativado
 * @returns {Promise<StatusPedido>} Dados do status de pedido inativado
 * @throws {Error} Se a requisição falhar
 */
export async function deleteStatusPedido(id: string): Promise<StatusPedido> {
    try {
        const res = await fetch(API_ENDPOINTS.STATUS_PEDIDO_BY_ID(id), {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao inativar status de pedido: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao inativar status de pedido:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao inativar status de pedido');
    }
}

/**
 * Retorna as classes CSS e informações para exibir o badge de status do status de pedido
 * 
 * @param {StatusPedido | undefined} statusPedido - Status de pedido para o qual gerar o badge
 * @returns {StatusBadgeResponse} Objeto com classes CSS e texto para o badge
 */
export function getStatusBadge(statusPedido?: StatusPedido): StatusBadgeResponse {
    if (!statusPedido) return {};
    
    const isAtivo = statusPedido.estado === 'ATIVO' || statusPedido.visivelPortal === true;
    
    const bgClass = isAtivo
        ? 'bg-green-100 text-green-800 hover:bg-green-100'
        : 'bg-red-100 text-red-800 hover:bg-red-100';

    const label = statusPedido.estado || (isAtivo ? 'ATIVO' : 'INATIVO');
    const iconName = isAtivo ? 'check-circle' : 'x-circle';
    
    return { 
        label, 
        bgClass,
        iconName
    };
}