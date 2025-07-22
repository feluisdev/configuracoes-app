/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { 
  fetchTiposServicos, 
  fetchTipoServicoById, 
  createTipoServico, 
  updateTipoServico, 
  deleteTipoServico,
  getStatusBadge,
  FetchTiposServicosResponse,
  FetchTiposServicosOptions
} from '../actions/tipos-servicos';
import { TipoServico, CreateTiposServicosCommand, UpdateTiposServicosCommand } from '../types/tipo-pedido';

// Chaves para o React Query
const QUERY_KEYS = {
  TIPOS_SERVICOS: 'tipos-servicos',
  TIPO_SERVICO: (id: string) => ['tipo-servico', id],
};

// Configurações específicas para as queries de tipos de serviços
// As configurações globais são definidas no ReactQueryProvider
const DEFAULT_QUERY_CONFIG = {
  // Estas configurações sobrescrevem as configurações globais quando necessário
  refetchOnMount: true,
};

/**
 * Hook para gerenciar operações de tipos de serviços usando React Query
 * 
 * @param options - Opções para filtrar, paginar e ordenar a lista de tipos de serviços
 * @returns Objeto com queries, mutations e funções utilitárias para gerenciar tipos de serviços
 * 
 * @example
 * // Uso básico para listar tipos de serviços
 * const { tiposServicosQuery } = useTiposServicos();
 * 
 * @example
 * // Buscar tipo de serviço específico
 * const { useTipoServicoById } = useTiposServicos();
 * const { data: tipoServico } = useTipoServicoById('123');
 * 
 * @example
 * // Criar novo tipo de serviço
 * const { createTipoServicoMutation } = useTiposServicos();
 * createTipoServicoMutation.mutate(novoTipoServicoData);
 */
export function useTiposServicos(options: FetchTiposServicosOptions = {}) {
  const { igrpToast } = useIGRPToast();

  const queryClient = useQueryClient();
  
  // Função utilitária para invalidar o cache de tipos de serviços
  const invalidateTiposServicosCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIPOS_SERVICOS] });
  }, [queryClient]);

  // Buscar lista de tipos de serviços
  const tiposServicosQuery = useQuery({
    queryKey: [QUERY_KEYS.TIPOS_SERVICOS, options],
    queryFn: () => fetchTiposServicos(options),
    ...DEFAULT_QUERY_CONFIG,
    // Atualizar a cada 2 minutos se a lista estiver visível
    refetchInterval: (query) => {
      const data = query.state.data as FetchTiposServicosResponse | undefined;
      return data?.list?.length ? 2 * 60 * 1000 : false;
    },
  });

  // Hook para buscar tipo de serviço por ID
  const useTipoServicoById = (id: string) => {
    return useQuery({
      queryKey: QUERY_KEYS.TIPO_SERVICO(id),
      queryFn: () => fetchTipoServicoById(id),
      enabled: !!id,
      ...DEFAULT_QUERY_CONFIG,
      // Aumentar o staleTime para detalhes de tipo de serviço
      staleTime: 10 * 60 * 1000, // 10 minutos
    });
  };
  
  // Função para buscar tipo de serviço por ID (não é um hook)
  const getTipoServicoById = async (id: string): Promise<TipoServico> => {
    try {
      return await fetchTipoServicoById(id);
    } catch (error) {
      console.error(`Erro ao buscar tipo de serviço ${id}:`, error);
      throw error instanceof Error 
        ? error 
        : new Error(`Erro desconhecido ao buscar tipo de serviço ${id}`);
    }
  };

  // Mutation para criar tipo de serviço
  const createTipoServicoMutation = useMutation({
    mutationFn: (data: CreateTiposServicosCommand) => createTipoServico(data),
    onSuccess: () => {
      // Invalidação automática do cache após mutação bem-sucedida
      invalidateTiposServicosCache();
      // Feedback de sucesso ao usuário
      igrpToast({
        type: 'success',
        title: 'Tipo de serviço criado',
        description: 'O tipo de serviço foi criado com sucesso.',
      });
    },
    // O tratamento de erros é feito pelo ReactQueryProvider
  });

  // Mutation para atualizar tipo de serviço
  const updateTipoServicoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateTiposServicosCommand | UpdateTiposServicosCommand }) => 
      updateTipoServico(id, data),
    onSuccess: (data, variables) => {
      // Invalidação automática do cache após mutação bem-sucedida
      invalidateTiposServicosCache();
      // Também invalidar a query específica do tipo de serviço
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TIPO_SERVICO(variables.id) });
      // Feedback de sucesso ao usuário
      igrpToast({
        type: 'success',
        title: 'Tipo de serviço atualizado',
        description: 'O tipo de serviço foi atualizado com sucesso.',
      });
    },
    // O tratamento de erros é feito pelo ReactQueryProvider
  });

  // Mutation para inativar tipo de serviço
  const deleteTipoServicoMutation = useMutation({
    mutationFn: (id: string) => deleteTipoServico(id),
    onSuccess: (data, variables) => {
      // Invalidação automática do cache após mutação bem-sucedida
      invalidateTiposServicosCache();
      // Também invalidar a query específica do tipo de serviço
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TIPO_SERVICO(variables) });
      // Feedback de sucesso ao usuário
      igrpToast({
        type: 'success',
        title: 'Tipo de serviço inativado',
        description: 'O tipo de serviço foi inativado com sucesso.',
      });
    },
    // O tratamento de erros é feito pelo ReactQueryProvider
  });

  // Retornar as funções e dados necessários
  return {
    // Dados e estado
    tiposServicos: tiposServicosQuery.data?.list || [],
    total: tiposServicosQuery.data?.total || 0,
    options: tiposServicosQuery.data?.options || [],
    message: tiposServicosQuery.data?.message,
    isLoading: tiposServicosQuery.isLoading,
    isError: tiposServicosQuery.isError,
    error: tiposServicosQuery.error,
    tiposServicosQuery,

    // Funções de query
    getTipoServicoById,
    useTipoServicoById,
    
    // Mutations
    createTipoServicoMutation,
    updateTipoServicoMutation,
    deleteTipoServicoMutation,

    // Utilitários
    getStatusBadge,
    invalidateTiposServicosCache,
    resetMutationState: () => {
      createTipoServicoMutation.reset();
      updateTipoServicoMutation.reset();
      deleteTipoServicoMutation.reset();
    },
  };
}