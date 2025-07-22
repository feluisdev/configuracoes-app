'use client'

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
import { useTiposServicos } from '@/app/[locale]/(myapp)/hooks/use-tipos-servicos';
import { TipoServico } from '@/app/[locale]/(myapp)/types/tipo-pedido';
import { getStatusBadge } from '@/app/[locale]/(myapp)/actions/tipos-servicos';
import { useDebounce } from '@/app/[locale]/(myapp)/hooks/use-debounce';


// Definir tipo específico para as linhas da tabela
type TipoServicoTableRow = {
  tipoServicoId_col_ref: string;
  tableTextCell1: string;
  tableTextCell2: string;
  tableTextCell3: string;
  tableBadgeCell1: string;
  _original: TipoServico;
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

export default function PageTiposservicosComponent() {
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

  // Usar o hook de tipos de serviços
  const {
    tiposServicos,
    total,
    isLoading,
    isError,
    error,
    tiposServicosQuery
  } = useTiposServicos({
    search: searchTerm,
    page: currentPage,
    size: pageSize,
    sort: sortField
  });

  // Usar useMemo para formatar os dados da tabela
  const contentTableTiposServicos = useMemo<TipoServicoTableRow[]>(() => {
    if (!tiposServicos || tiposServicos.length === 0) return [];

    return tiposServicos.map((tipoServico: TipoServico) => {
      const statusBadge = getStatusBadge(tipoServico);

      return {
        tipoServicoId_col_ref: tipoServico.tipoServicoId,
        tableTextCell1: tipoServico.nome,
        tableTextCell2: tipoServico.codigo,
        tableTextCell3: tipoServico.categoria?.nome || 'Sem categoria',
        tableBadgeCell1: tipoServico.ativo ? 'Ativo' : 'Inativo',
        _original: tipoServico // Manter referência ao objeto original
      };
    });
  }, [tiposServicos]);

  const router = useRouter()

  function goToNovo(row?: any): void {
    router.push(`/tipos-servicos/novo`);
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
        title: 'Erro ao carregar tipos de serviço',
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
    tiposServicosQuery.refetch();
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
        tableTextCell3: 'categoria.nome',
        tableBadgeCell1: 'ativo',
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
            message="Erro ao carregar os tipos de serviço. Por favor, tente novamente."
            onRetry={handleRetry}
          />
        )}
        <IGRPPageHeader
          title={`Gerenciar Tipos de Serviços`}
          description={`Crie, edite e gerencie os tipos de serviços.`}
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

              onClick={() => goToNovo()}

            >
              Novo Tipo de Serviço
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
                            href: `/tipos-servicos/${row.original.tipoServicoId_col_ref}/editar`,
                            showIcon: true,
                            action: () => { },
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
                return row.getValue("tableTextCell1")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title={`Código`} />,
              accessorKey: 'tableTextCell2',
              cell: ({ row }) => {
                return row.getValue("tableTextCell2")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title={`Categoria`} />,
              accessorKey: 'tableTextCell3',
              cell: ({ row }) => {
                return row.getValue("tableTextCell3")
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
            {
              header: 'Status',
              accessorKey: 'tableBadgeCell1',
              cell: ({ row }) => {
                const status = row.getValue("tableBadgeCell1");
                const variant = status === 'Ativo' ? 'success' : 'destructive';

                return (
                  <IGRPDataTableCellBadge
                    label={status as string}
                    variant={`soft`}
                    badgeClassName={status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                  </IGRPDataTableCellBadge>
                );
              },
              filterFn: IGRPDataTableFacetedFilterFn
            },
          ]}
          clientFilters={[
            // Filtros do lado do cliente, se necessário
          ]}
          data={contentTableTiposServicos}
        /></div></div>
  );
}
