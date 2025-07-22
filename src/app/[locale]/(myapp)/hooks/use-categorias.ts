/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { 
  fetchCategorias, 
  fetchCategoriaById, 
  createCategoria, 
  updateCategoria, 
  deleteCategoria,
  getStatusBadge,
  FetchCategoriasResponse,
  FetchCategoriasOptions
} from '../actions/categorias';
import { CategoriaServico, CreateCategoriasServicosCommand, UpdateCategoriasServicosCommand } from '../types/categorias';

// Chaves para o React Query
const QUERY_KEYS = {
  CATEGORIAS: 'categorias',
  CATEGORIA: (id: string) => ['categoria', id],
};

// Configurações específicas para as queries de categorias
// As configurações globais são definidas no ReactQueryProvider
const DEFAULT_QUERY_CONFIG = {
  // Estas configurações sobrescrevem as configurações globais quando necessário
  refetchOnMount: true,
};

/**
 * Hook para gerenciar operações de categorias usando React Query
 * 
 * @param options - Opções para filtrar, paginar e ordenar a lista de categorias
 * @returns Objeto com queries, mutations e funções utilitárias para gerenciar categorias
 * 
 * @example
 * // Uso básico para listar categorias
 * const { categoriasQuery } = useCategorias();
 * 
 * @example
 * // Buscar categoria específica
 * const { useCategoriaById } = useCategorias();
 * const { data: categoria } = useCategoriaById('123');
 * 
 * @example
 * // Criar nova categoria
 * const { createCategoriaMutation } = useCategorias();
 * createCategoriaMutation.mutate(novaCategoriaData);
 */
export function useCategorias(options: FetchCategoriasOptions = {}) {
  const { igrpToast } = useIGRPToast();

  const queryClient = useQueryClient();
  
  // Função utilitária para invalidar o cache de categorias
  const invalidateCategoriasCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIAS] });
  }, [queryClient]);

  // Buscar lista de categorias
  const categoriasQuery = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIAS, options],
    queryFn: () => fetchCategorias(options),
    ...DEFAULT_QUERY_CONFIG,
    // Atualizar a cada 2 minutos se a lista estiver visível
    refetchInterval: (query) => {
      const data = query.state.data as FetchCategoriasResponse | undefined;
      return data?.list?.length ? 2 * 60 * 1000 : false;
    },
  });

  // Hook para buscar categoria por ID
  const useCategoriaById = (id: string) => {
    return useQuery({
      queryKey: QUERY_KEYS.CATEGORIA(id),
      queryFn: () => fetchCategoriaById(id),
      enabled: !!id,
      ...DEFAULT_QUERY_CONFIG,
      // Aumentar o staleTime para detalhes de categoria
      staleTime: 10 * 60 * 1000, // 10 minutos
    });
  };
  
  // Função para buscar categoria por ID (não é um hook)
  const getCategoriaById = async (id: string): Promise<CategoriaServico> => {
    try {
      return await fetchCategoriaById(id);
    } catch (error) {
      console.error(`Erro ao buscar categoria ${id}:`, error);
      throw error instanceof Error 
        ? error 
        : new Error(`Erro desconhecido ao buscar categoria ${id}`);
    }
  };

  // Mutation para criar categoria
  const createCategoriaMutation = useMutation({
    mutationFn: (data: CreateCategoriasServicosCommand) => createCategoria(data),
    onSuccess: () => {
      // Invalidação automática do cache após mutação bem-sucedida
      invalidateCategoriasCache();
      // Feedback de sucesso ao usuário
      igrpToast({
        type: 'success',
        title: 'Categoria criada',
        description: 'A categoria foi criada com sucesso.',
      });
    },
    // O tratamento de erros é feito pelo ReactQueryProvider
  });

  // Mutation para atualizar categoria
  const updateCategoriaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoriasServicosCommand | UpdateCategoriasServicosCommand }) => 
      updateCategoria(id, data),
    onSuccess: (data, variables) => {
      // Invalidação automática do cache após mutação bem-sucedida
      invalidateCategoriasCache();
      // Também invalidar a query específica da categoria
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIA(variables.id) });
      // Feedback de sucesso ao usuário
      igrpToast({
        type: 'success',
        title: 'Categoria atualizada',
        description: 'A categoria foi atualizada com sucesso.',
      });
    },
    // O tratamento de erros é feito pelo ReactQueryProvider
  });

  // Mutation para inativar categoria
  const deleteCategoriaMutation = useMutation({
    mutationFn: (id: string) => deleteCategoria(id),
    onSuccess: (data, variables) => {
      // Invalidação automática do cache após mutação bem-sucedida
      invalidateCategoriasCache();
      // Também invalidar a query específica da categoria
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIA(variables) });
      // Feedback de sucesso ao usuário
      igrpToast({
        type: 'success',
        title: 'Categoria inativada',
        description: 'A categoria foi inativada com sucesso.',
      });
    },
    // O tratamento de erros é feito pelo ReactQueryProvider
  });

  // Retornar as funções e dados necessários
  return useMemo(() => ({
    // Dados e estado
    categorias: categoriasQuery.data?.list || [],
    total: categoriasQuery.data?.total || 0,
    options: categoriasQuery.data?.options || [],
    message: categoriasQuery.data?.message,
    isLoading: categoriasQuery.isLoading,
    isError: categoriasQuery.isError,
    error: categoriasQuery.error,
    categoriasQuery,

    // Funções de query
    getCategoriaById,
    useCategoriaById,
    
    // Mutations
    createCategoriaMutation,
    updateCategoriaMutation,
    deleteCategoriaMutation,

    // Utilitários
    getStatusBadge,
    invalidateCategoriasCache,
    resetMutationState: () => {
      createCategoriaMutation.reset();
      updateCategoriaMutation.reset();
      deleteCategoriaMutation.reset();
    },
  }), [categoriasQuery, createCategoriaMutation, updateCategoriaMutation, deleteCategoriaMutation, invalidateCategoriasCache]);
}