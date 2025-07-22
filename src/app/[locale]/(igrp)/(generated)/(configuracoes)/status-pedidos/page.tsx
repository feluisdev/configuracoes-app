'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useMemo } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPDataTableFacetedFilterFn, IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import {
  IGRPPageHeader,
  IGRPButton,
  IGRPDataTable,
  IGRPDataTableRowAction,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuLink,
  IGRPDataTableCellBadge
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from "next/navigation";
import { useStatusPedidos } from '@/app/[locale]/(myapp)/hooks/use-status-pedido';
import { StatusPedido } from '@/app/[locale]/(myapp)/types/status-pedido';
import { getStatusBadge } from '@/app/[locale]/(myapp)/actions/status-pedido';
import { useDebounce } from '@/app/[locale]/(myapp)/hooks/use-debounce';

// Definir tipo específico para as linhas da tabela
type StatusPedidoTableRow = {
  id_col_sp_ref: string;
  tableTextCell1: string;
  tableTextCell2: string;
  tableTextCell3: string;
  tableTextCell4: string;
  tableBadgeCell1: string;
  _original: StatusPedido;
};

// Componente de mensagem de erro reutilizável
const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
    <p className="font-bold">Erro:</p>
    <p>{message}</p>
    <button
      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      onClick={onRetry}
    >
      Tentar novamente
    </button>
  </div>
);

export default function PageStatuspedidosComponent() {
  // Estado para pesquisa com debounce
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch] = useDebounce(searchInput, 500);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<string>('nome,asc');

  // Estado para o termo de pesquisa após debounce
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Atualizar searchTerm quando o valor debounced mudar
  useEffect(() => {
    setSearchTerm(debouncedSearch);
  }, [debouncedSearch]);

  // Usar o hook de status de pedidos
  const {
    statusPedidos,
    total,
    isLoading,
    isError,
    error,
    statusPedidosQuery
  } = useStatusPedidos({
    search: searchTerm,
    page: currentPage,
    size: pageSize,
    sort: sortField
  });

  const router = useRouter();

  // Usar useMemo para formatar os dados da tabela
  const contentTableStatusPedidos = useMemo<StatusPedidoTableRow[]>(() => {
    if (!statusPedidos || statusPedidos.length === 0) return [];

    return statusPedidos.map((statusPedido: StatusPedido) => {
      console.log('[STATUS_PEDIDOS][MAP] StatusPedido:', statusPedido);
      return {
        id_col_sp_ref: statusPedido.statusPedidoId || '',
        tableTextCell1: statusPedido.nome,
        tableTextCell2: statusPedido.codigo,
        tableTextCell3: statusPedido.cor || '',
        tableTextCell4: statusPedido.ordem?.toString() || '',
        tableBadgeCell1: statusPedido.visivelPortal ? 'Sim' : 'Não',
        _original: statusPedido // Manter referência ao objeto original
      };
    });

  }, [statusPedidos]);

  function goTonovoStatusPedido(row?: any): void {
    router.push(`/status-pedidos/novo`);
  }


  // Toast para mensagens de erro
  const toast = useIGRPToast();

  // Referência para controlar se o toast já foi exibido
  const errorToastShown = useRef(false);

  // Exibir mensagem de erro se houver
  useEffect(() => {
    if (isError && error && !errorToastShown.current) {
      errorToastShown.current = true;
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao carregar os dados.';
      toast.igrpToast({
        title: 'Erro ao carregar status de pedido',
        description: errorMessage,
        type: 'default',
      });
    } else if (!isError) {
      // Resetar o controle quando não há erro
      errorToastShown.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]); // Remover toast das dependências

  // Função para recarregar os dados
  const handleRetry = () => {
    statusPedidosQuery.refetch();
  };

  // Manipulador para pesquisa
  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  // Manipulador para mudança de paginação
  const handlePaginationChange = (pagination: { pageIndex: number; pageSize: number }) => {
    setCurrentPage(pagination.pageIndex);
    setPageSize(pagination.pageSize);
  };

  // Manipulador para mudança de ordenação
  const handleSortingChange = (sorting: any[]) => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      // Mapear o ID da coluna para o campo correspondente no backend
      const fieldMap: Record<string, string> = {
        tableTextCell1: 'nome',
        tableTextCell2: 'codigo',
        tableTextCell3: 'cor',
        tableTextCell4: 'ordem',
        tableBadgeCell1: 'visivelPortal',
      };
      const field = fieldMap[id] || id;
      setSortField(`${field},${desc ? 'desc' : 'asc'}`);
    }
  };

  return (
    <div className={cn('page', 'space-y-6')}>
      <div className={cn('section', ' space-x-6 space-y-6')}>
        {/* Exibir mensagem de erro ou carregamento */}
        {isError && (
          <ErrorMessage
            message="Erro ao carregar os status de pedido. Por favor, tente novamente."
            onRetry={handleRetry}
          />
        )}
        <IGRPPageHeader
          title={`Gerenciar Status de Pedidos`}
          description={`Crie, edite e gerencie os status dos pedidos.`}
          iconBackButton={`Search`}
          variant={`h3`}
        >
          <div className="flex items-center gap-2">
            <IGRPButton
              name={`novoBt`}
              variant={`default`}
              size={`lg`}
              showIcon={true}
              iconName={`SquarePlus`}
              onClick={() => goTonovoStatusPedido()}
            >
              Novo Status de Pedido
            </IGRPButton>
          </div>
        </IGRPPageHeader>
        <IGRPDataTable<any, any>
          showFilter={true}
          showToggleColumn={true}
          columns={[
            {
              header: 'Ações',
              accessorKey: 'tableActionListCell1',
              enableHiding: false,
              cell: ({ row }) => {
                const rowData = row.original;
                return (
                  <IGRPDataTableRowAction>
                    <IGRPDataTableDropdownMenu
                      items={[
                        {
                          component: IGRPDataTableDropdownMenuLink,
                          props: {
                            labelTrigger: `Editar`,
                            icon: `SquarePen`,
                            href: `/status-pedidos/${row.original.id_col_sp_ref}/editar`,
                            showIcon: true,
                            action: () => { 
                              router.push(`/status-pedidos/${row.original.id_col_sp_ref}/editar`);
                            },
                          }
                        },
                      ]}
                    >
                    </IGRPDataTableDropdownMenu>
                  </IGRPDataTableRowAction>
                );
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title={`Nome`} />,
              accessorKey: 'tableTextCell1',
              cell: ({ row }) => {
                return (
                  <div 
                    className="cursor-pointer hover:underline text-blue-600" 
                    onClick={() => router.push(`/status-pedidos/${row.original.id_col_sp_ref}/editar`)}
                  >
                    {row.getValue("tableTextCell1")}
                  </div>
                )
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title={`Código`} />,
              accessorKey: 'tableTextCell2',
              cell: ({ row }) => {
                return (
                  <div 
                    className="cursor-pointer hover:underline text-blue-600" 
                    onClick={() => router.push(`/status-pedidos/${row.original.id_col_sp_ref}/editar`)}
                  >
                    {row.getValue("tableTextCell2")}
                  </div>
                )
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: 'Cor',
              accessorKey: 'tableTextCell3',
              cell: ({ row }) => {
                const cor = row.getValue("tableTextCell3") as string;
                if (!cor) return null;
                return (
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full mr-2" 
                      style={{ backgroundColor: cor }}
                    />
                    {cor}
                  </div>
                );
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Ordem`} />),
              accessorKey: 'tableTextCell4',
              cell: ({ row }) => {
                return row.getValue("tableTextCell4")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: 'Visível no Portal',
              accessorKey: 'tableBadgeCell1',
              cell: ({ row }) => {
                const status = row.getValue("tableBadgeCell1");
                const variant = status === 'Sim' ? 'success' : 'destructive';

                return (
                  <IGRPDataTableCellBadge
                    label={status as string}
                    variant={`soft`}
                    badgeClassName={status === 'Sim' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                  </IGRPDataTableCellBadge>
                );
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
          ]}
          clientFilters={[]}
          data={contentTableStatusPedidos}
        />
      </div>
    </div>
  );
}
