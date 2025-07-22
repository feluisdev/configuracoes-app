'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Comentado temporariamente até que a dependência seja instalada
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';

// Tipos de erro para tratamento centralizado
type ErrorWithMessage = {
  message: string;
  status?: number;
  name?: string;
};

// Configurações padrão para o cache
const defaultCacheTime = 5 * 60 * 1000; // 5 minutos
const defaultStaleTime = 2 * 60 * 1000; // 2 minutos


/**
 * Provider para o React Query com configurações otimizadas
 * - Gerenciamento de cache: Configurações de staleTime e cacheTime otimizadas
 * - Invalidação automática: Configurada nas mutations dos hooks
 * - Tratamento de erros centralizado: Handler global para erros de queries e mutations
 */
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const { igrpToast }  = useIGRPToast();
  const [queryClient] = useState(
    () => {
      // Criar caches para queries e mutations
      const queryCache = new QueryClient().getQueryCache();
      const mutationCache = new QueryClient().getMutationCache();
      
      // Adicionar listeners para tratamento centralizado de erros
      queryCache.subscribe(event => {
        if (event.type === 'updated' && event.query.state.status === 'error' && event.query.state.error) {
          const err = event.query.state.error as ErrorWithMessage;
          console.error('Query error:', err);
          igrpToast({
            type: 'error',
            title: 'Erro ao carregar dados',
            description: err.message || 'Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.',
          });
        }
      });
      
      mutationCache.subscribe(event => {
        if (event.mutation?.state.status === 'error' && event.mutation.state.error) {
          const err = event.mutation.state.error as ErrorWithMessage;
          console.error('Mutation error:', err);
          igrpToast({
            type: 'error',
            title: 'Erro ao processar operação',
            description: err.message || 'Ocorreu um erro ao processar a operação. Tente novamente mais tarde.',
          });
        }
      });
      
      return new QueryClient({
        queryCache,
        mutationCache,
        defaultOptions: {
          queries: {
            // Configurações globais para queries
            staleTime: defaultStaleTime,
            gcTime: defaultCacheTime,
            refetchOnWindowFocus: true,
            retry: (failureCount, error) => {
              // Não tentar novamente para erros 4xx
              const err = error as ErrorWithMessage;
              if (err.status && err.status >= 400 && err.status < 500) {
                return false;
              }
              // Tentar novamente até 3 vezes para outros erros
              return failureCount < 3;
            },
          },
          mutations: {
            // Configurações para mutations
          },
        },
      });
    }
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Comentado temporariamente até que a dependência seja instalada */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />} 
    </QueryClientProvider>
  );
}