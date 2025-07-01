/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { 
  fetchStatusPedidos, 
  fetchStatusPedidoById, 
  createStatusPedido, 
  updateStatusPedido, 
  deleteStatusPedido,
  getStatusBadge,
  FetchStatusPedidosResponse,
  FetchStatusPedidosOptions
} from '../actions/status-pedido';
import { StatusPedido, CreateStatusPedidoCommand, UpdateStatusPedidoCommand } from '../types/status-pedido';

// Chaves para o React Query
const QUERY_KEYS = {
  STATUS_PEDIDOS: 'status-pedidos',
  STATUS_PEDIDO: (id: string) => ['status-pedido', id],
};

// Configurações padrão para as queries
const DEFAULT_QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  retry: 2,
};

/**
 * Hook para gerenciar operações de status de pedido usando React Query
 * 
 * @param options - Opções para filtrar, paginar e ordenar a lista de status de pedido
 * @returns Objeto com queries, mutations e funções utilitárias para gerenciar status de pedido
 * 
 * @example
 * // Uso básico para listar status de pedido
 * const { statusPedidosQuery } = useStatusPedidos();
 * 
 * @example
 * // Buscar status de pedido específico
 * const { useStatusPedidoById } = useStatusPedidos();
 * const { data: statusPedido } = useStatusPedidoById('123');
 * 
 * @example
 * // Criar novo status de pedido
 * const { createStatusPedidoMutation } = useStatusPedidos();
 * createStatusPedidoMutation.mutate(novoStatusPedidoData);
 */
export function useStatusPedidos(options: FetchStatusPedidosOptions = {}) {
  const queryClient = useQueryClient();
  
  // Função utilitária para invalidar o cache de status de pedido
  const invalidateStatusPedidosCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS_PEDIDOS] });
  }, [queryClient]);

  // Buscar lista de status de pedido
  const statusPedidosQuery = useQuery({
    queryKey: [QUERY_KEYS.STATUS_PEDIDOS, options],
    queryFn: () => fetchStatusPedidos(options),
    ...DEFAULT_QUERY_CONFIG,
    // Atualizar a cada 2 minutos se a lista estiver visível
    refetchInterval: (query) => {
      const data = query.state.data as FetchStatusPedidosResponse | undefined;
      return data?.list?.length ? 2 * 60 * 1000 : false;
    },
  });

  // Hook para buscar status de pedido por ID
  const useStatusPedidoById = (id: string) => {
    return useQuery({
      queryKey: QUERY_KEYS.STATUS_PEDIDO(id),
      queryFn: () => fetchStatusPedidoById(id),
      enabled: !!id,
      ...DEFAULT_QUERY_CONFIG,
      // Aumentar o staleTime para detalhes de status de pedido
      staleTime: 10 * 60 * 1000, // 10 minutos
    });
  };
  
  // Função para buscar status de pedido por ID (não é um hook)
  const getStatusPedidoById = async (id: string): Promise<StatusPedido> => {
    try {
      return await fetchStatusPedidoById(id);
    } catch (error) {
      console.error(`Erro ao buscar status de pedido ${id}:`, error);
      throw error instanceof Error 
        ? error 
        : new Error(`Erro desconhecido ao buscar status de pedido ${id}`);
    }
  };

  // Mutation para criar status de pedido
  const createStatusPedidoMutation = useMutation({
    mutationFn: (data: CreateStatusPedidoCommand) => createStatusPedido(data),
    onSuccess: () => {
      invalidateStatusPedidosCache();

    },
    onError: (error) => {
      console.error('Erro ao criar status de pedido:', error);

    },
  });

  // Mutation para atualizar status de pedido
  const updateStatusPedidoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusPedidoCommand }) => 
      updateStatusPedido(id, data),
    onSuccess: (data, variables) => {
      invalidateStatusPedidosCache();
      // Também invalidar a query específica do status de pedido
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATUS_PEDIDO(variables.id) });

    },
    onError: (error) => {
      console.error('Erro ao atualizar status de pedido:', error);

    },
  });

  // Mutation para inativar status de pedido
  const deleteStatusPedidoMutation = useMutation({
    mutationFn: (id: string) => deleteStatusPedido(id),
    onSuccess: (data, variables) => {
      invalidateStatusPedidosCache();
      // Também invalidar a query específica do status de pedido
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATUS_PEDIDO(variables) });

    },
    onError: (error) => {
      console.error('Erro ao inativar status de pedido:', error);

    },
  });

  // Retornar as funções e dados necessários
  return {
    // Dados e estado
    statusPedidos: statusPedidosQuery.data?.list || [],
    total: statusPedidosQuery.data?.total || 0,
    options: statusPedidosQuery.data?.options || [],
    message: statusPedidosQuery.data?.message,
    isLoading: statusPedidosQuery.isLoading,
    isError: statusPedidosQuery.isError,
    error: statusPedidosQuery.error,
    statusPedidosQuery,

    // Funções de query
    getStatusPedidoById,
    useStatusPedidoById,
    
    // Mutations
    createStatusPedidoMutation,
    updateStatusPedidoMutation,
    deleteStatusPedidoMutation,

    // Utilitários
    getStatusBadge,
    invalidateStatusPedidosCache,
    resetMutationState: () => {
      createStatusPedidoMutation.reset();
      updateStatusPedidoMutation.reset();
      deleteStatusPedidoMutation.reset();
    },
  };
}