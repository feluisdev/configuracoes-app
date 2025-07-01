/* eslint-disable @typescript-eslint/no-unused-vars */
import { TipoServico, CreateTiposServicosCommand, UpdateTiposServicosCommand, WrapperListaTipoServicoDTO } from "../types/tipo-pedido";

// Constantes para URLs da API
const API_ENDPOINTS = {
  TIPOS_SERVICOS: '/api/tipos-servicos',
  TIPO_SERVICO_BY_ID: (id: string) => `/api/tipos-servicos/${id}`
};

// Tipos de resposta para as funções
export type FetchTiposServicosResponse = {
  list: TipoServico[];
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

// Opções para filtrar tipos de serviço
export type FetchTiposServicosOptions = {
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
  categoriaId?: string;
};


/**
 * Busca tipos de serviço com opções de filtragem e paginação
 * 
 * @param {FetchTiposServicosOptions} options - Opções para filtragem e paginação
 * @param {string} options.search - Termo de busca para filtrar por nome ou código
 * @param {number} options.page - Número da página para paginação
 * @param {number} options.size - Tamanho da página para paginação
 * @param {string} options.sort - Campo e direção para ordenação
 * @param {string} options.categoriaId - ID da categoria para filtrar tipos de serviço
 * @returns {Promise<FetchTiposServicosResponse>} Dados dos tipos de serviço filtrados e metadados
 * @throws {Error} Se a requisição falhar
 */
export async function fetchTiposServicos(options: FetchTiposServicosOptions = {}): Promise<FetchTiposServicosResponse> {
    const { search = '', page, size, sort, categoriaId } = options;
    
    try {
        // Construir query params para paginação e ordenação
        const queryParams = new URLSearchParams();
        if (page !== undefined) queryParams.append('page', page.toString());
        if (size !== undefined) queryParams.append('size', size.toString());
        if (sort) queryParams.append('sort', sort);
        if (categoriaId) queryParams.append('categoriaId', categoriaId);
        
        const queryString = queryParams.toString();
        const url = `${API_ENDPOINTS.TIPOS_SERVICOS}${queryString ? `?${queryString}` : ''}`;
        
        const res = await fetch(url);

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao buscar tipos de serviço: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }

        const raw = await res.json();
        let tiposServicos: TipoServico[] = [];
        let total = 0;
        
        // Verificar se a resposta é um wrapper de paginação ou array direto
        if (raw.content && Array.isArray(raw.content)) {
            // Resposta paginada
            const typedResponse = raw as WrapperListaTipoServicoDTO;
            tiposServicos = typedResponse.content;
            total = typedResponse.totalElements || tiposServicos.length;
        } else if (Array.isArray(raw)) {
            // Array direto
            tiposServicos = raw as TipoServico[];
            total = tiposServicos.length;
        }

        // Filtrar por termo de busca se necessário
        const filtered = search 
            ? tiposServicos.filter(
                (ts: TipoServico) =>
                    ts.nome.toLowerCase().includes(search.toLowerCase()) ||
                    ts.codigo.toLowerCase().includes(search.toLowerCase()) ||
                    (ts.categoria?.nome && ts.categoria.nome.toLowerCase().includes(search.toLowerCase()))
              )
            : tiposServicos;

        return {
            list: filtered,
            options: [{ label: 'Ativo', value: 'ATIVO' }, { label: 'Inativo', value: 'INATIVO' }],
            total: filtered.length,
            message:
                filtered.length > 0 ? 'Dados carregados com sucesso' : 'Nenhum tipo de serviço encontrado',
        };
    } catch (error) {
        console.error('Erro ao buscar tipos de serviço:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao buscar tipos de serviço');
    }
}

/**
 * Busca um tipo de serviço pelo ID
 * 
 * @param {string} id - ID do tipo de serviço a ser buscado
 * @returns {Promise<TipoServico>} Dados do tipo de serviço
 * @throws {Error} Se a requisição falhar ou o tipo de serviço não for encontrado
 */
export async function fetchTipoServicoById(id: string): Promise<TipoServico> {
    try {
        const res = await fetch(API_ENDPOINTS.TIPO_SERVICO_BY_ID(id));
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao buscar tipo de serviço: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar tipo de serviço por ID:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao buscar tipo de serviço');
    }
}

/**
 * Cria um novo tipo de serviço
 * 
 * @param {CreateTiposServicosCommand} data - Dados do tipo de serviço a ser criado
 * @returns {Promise<TipoServico>} Dados do tipo de serviço criado
 * @throws {Error} Se a requisição falhar
 */
export async function createTipoServico(data: CreateTiposServicosCommand): Promise<TipoServico> {
    try {
        const res = await fetch(API_ENDPOINTS.TIPOS_SERVICOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao criar tipo de serviço: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao criar tipo de serviço:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao criar tipo de serviço');
    }
}

/**
 * Atualiza um tipo de serviço existente
 * 
 * @param {string} id - ID do tipo de serviço a ser atualizado
 * @param {CreateTiposServicosCommand | UpdateTiposServicosCommand} data - Dados atualizados do tipo de serviço
 * @returns {Promise<TipoServico>} Dados do tipo de serviço atualizado
 * @throws {Error} Se a requisição falhar
 */
export async function updateTipoServico(id: string, data: CreateTiposServicosCommand | UpdateTiposServicosCommand): Promise<TipoServico> {
    try {
        const res = await fetch(API_ENDPOINTS.TIPO_SERVICO_BY_ID(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao atualizar tipo de serviço: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao atualizar tipo de serviço:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao atualizar tipo de serviço');
    }
}

/**
 * Inativa um tipo de serviço
 * 
 * @param {string} id - ID do tipo de serviço a ser inativado
 * @returns {Promise<TipoServico>} Dados do tipo de serviço inativado
 * @throws {Error} Se a requisição falhar
 */
export async function deleteTipoServico(id: string): Promise<TipoServico> {
    try {
        const res = await fetch(API_ENDPOINTS.TIPO_SERVICO_BY_ID(id), {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                `Erro ao inativar tipo de serviço: ${res.status} ${res.statusText}${errorData ? ` - ${errorData.message || JSON.stringify(errorData)}` : ''}`
            );
        }
        
        return await res.json();
    } catch (error) {
        console.error('Erro ao inativar tipo de serviço:', error);
        throw error instanceof Error ? error : new Error('Erro desconhecido ao inativar tipo de serviço');
    }
}

/**
 * Retorna as classes CSS e informações para exibir o badge de status do tipo de serviço
 * 
 * @param {TipoServico | undefined} tipoServico - Tipo de serviço para o qual gerar o badge
 * @returns {StatusBadgeResponse} Objeto com classes CSS e texto para o badge
 */
export function getStatusBadge(tipoServico?: TipoServico): StatusBadgeResponse {
    if (!tipoServico) return {};
    
    const isAtivo = tipoServico.estado === 'ATIVO';
    
    const bgClass = isAtivo
        ? 'bg-green-100 text-green-800 hover:bg-green-100'
        : 'bg-red-100 text-red-800 hover:bg-red-100';

    const label = tipoServico.estado;
    const iconName = isAtivo ? 'check-circle' : 'x-circle';
    
    return { 
        label, 
        bgClass,
        iconName
    };
}