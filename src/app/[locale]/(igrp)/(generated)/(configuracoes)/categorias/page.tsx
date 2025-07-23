'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useMemo } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPDataTableFacetedFilterFn, IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import {
  IGRPPageHeader,
  IGRPButton,
  IGRPDataTable,
  IGRPDataTableRowAction,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuLink,
  IGRPDataTableCellBadge,
  IGRPDataTableCellCheckbox,
  IGRPDataTableFilterInput,
  IGRPDataTableFilterDropdown
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from "next/navigation";
import { useCategorias } from '@/app/[locale]/(myapp)/hooks/use-categorias';
import { useDebounce } from '@/app/[locale]/(myapp)/hooks/use-debounce';
import { JSX } from 'react/jsx-runtime';


export default function PageCategoriasComponent() {


  type Table1 = {
    categoria: string;
    descricao: string;
    ordem: number;
    estado: string;
    id: string;
  }





  const [categoriaFilter, setCategoriaFilter] = useState<string>(``);
  const [estadoFilter, setEstadoFilter] = useState<string>(``);
  const router = useRouter();
  const { igrpToast: toast } = useIGRPToast();


  const {
    categorias,
    total,
    options,
    isLoading,
    isError,
    error,
    setSearch,
    getStatusBadge,
    deleteCategoriaMutation,
    invalidateCategoriasCache
  } = useCategorias();

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const contentTabletable1 = useMemo<Table1[]>(() => {
    if (!categorias) {
      return [];
    }
    return categorias.map(categoria => ({
      categoria: categoria.nome || '',
      descricao: categoria.descricao || '',
      ordem: categoria.ordem || 0,
      estado: categoria.estado || 'ATIVO',
      id: categoria.categoriaId || ''
    }));
  }, [categorias]);

  const dropdownFiltertableDropdownFilter1Options = useMemo<IGRPOptionsProps[]>(() => {
    if (options && Array.isArray(options) && options.length > 0) {
      return options;
    }
    return [
      { label: 'Ativo', value: 'ATIVO' },
      { label: 'Inativo', value: 'INATIVO' }
    ];
  }, [options]);

  function goTonova(row?: any): void {
    router.push(`categorias/nova`);
  }

  function handleDelete(ids: string[]) {
    if (ids.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Selecione pelo menos uma categoria para eliminar',
        type: 'warning'
      });
      return;
    }

    // Confirmar antes de eliminar
    if (confirm(`Tem certeza que deseja eliminar ${ids.length > 1 ? 'estas categorias' : 'esta categoria'}?`)) {
      // Contador para acompanhar operações bem-sucedidas
      let successCount = 0;
      let errorCount = 0;
      
      // Para cada ID selecionado, chamar a mutation de delete
      ids.forEach(id => {
        deleteCategoriaMutation.mutate(id, {
          onSuccess: () => {
            successCount++;
            
            // Verificar se todas as operações foram concluídas
            if (successCount + errorCount === ids.length) {
              // Mostrar mensagem de sucesso apenas uma vez ao final
              toast({
                title: 'Sucesso',
                description: `${successCount} ${successCount === 1 ? 'categoria foi eliminada' : 'categorias foram eliminadas'} com sucesso`,
                type: 'success'
              });
              
              // Limpar seleções de checkbox após exclusão
              const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
              checkboxes.forEach((checkbox: any) => {
                checkbox.checked = false;
              });
            }
          },
          onError: (error) => {
            errorCount++;
            
            toast({
              title: 'Erro',
              description: `Erro ao eliminar categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
              type: 'error'
            });
            
            // Verificar se todas as operações foram concluídas
            if (successCount + errorCount === ids.length && successCount > 0) {
              toast({
                title: 'Resultado Parcial',
                description: `${successCount} ${successCount === 1 ? 'categoria foi eliminada' : 'categorias foram eliminadas'} com sucesso, mas ocorreram erros em ${errorCount} ${errorCount === 1 ? 'operação' : 'operações'}.`,
                type: 'warning'
              });
            }
          }
        });
      });
    }
  }


  return (
    <div className={cn('page', 'space-y-6',)}    >
      <div className={cn('section', ' space-x-6 space-y-6',)}    >
        <IGRPPageHeader
          title={`Categorias de Serviços`}
          description={`Categorias de Serviços`}
          iconBackButton={`Search`}
          variant={`h3`}

        >
          <div className="flex items-center gap-2">
            <IGRPButton
              name={`novaBt`}

              variant={`default`}
              size={`lg`}
              showIcon={true}
              iconName={`SquarePlus`}

              className={cn()}
              onClick={() => goTonova()}

            >
              Nova
            </IGRPButton>
            <IGRPButton
              name={`eliminarBt`}

              variant={`secondary`}
              size={`lg`}
              showIcon={true}
              iconName={`Delete`}

              className={cn()}
              onClick={() => {
                // Obter IDs selecionados da tabela
                const selectedRows = document.querySelectorAll('input[type="checkbox"]:checked');
                const ids: string[] = [];
                selectedRows.forEach((row: any) => {
                  // Verificar se o checkbox tem um valor e não é o checkbox de selecionar todos
                  if (row.value && row.value !== 'on' && row.value !== 'true') {
                    ids.push(row.value);
                  }
                });
                handleDelete(ids);
              }}

            >
              Eliminar
            </IGRPButton>
          </div>
        </IGRPPageHeader>

        {isError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-lg font-medium text-red-800">Erro ao carregar categorias</h3>
            <p className="mt-2 text-sm text-red-700">
              {error instanceof Error ? error.message : 'Ocorreu um erro ao carregar as categorias. Tente novamente mais tarde.'}
            </p>
            <button 
              className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
              onClick={() => invalidateCategoriasCache()}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <IGRPDataTable<Table1, Table1>
            showFilter={true}
            showToggleColumn={true}
            className={cn('', 'block',)}
            notFoundLabel="Nenhuma categoria encontrada"
          columns={
            [
              {
                header: ' '
                , accessorKey: 'tableActionListCell1',
                enableHiding: false, cell: ({ row }) => {
                  const rowData = row.original;

                  return (
                    <IGRPDataTableRowAction>
                      <IGRPDataTableDropdownMenu
                        items={
                          [
                            {
                              component: IGRPDataTableDropdownMenuLink,
                              props: {
                                labelTrigger: `Editar`, icon: `SquarePen`, href: `/categorias/${row.original.id}/editar`, showIcon: true, action: () => { },
                              }
                            },
                          ]
                        }
                      >
                      </IGRPDataTableDropdownMenu>
                    </IGRPDataTableRowAction>
                  );
                },
                filterFn: IGRPDataTableFacetedFilterFn
              },
              {
                header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title={`Categoria`} />
                , accessorKey: 'categoria',
                cell: ({ row }) => {
                  return row.getValue("categoria")
                },
                filterFn: IGRPDataTableFacetedFilterFn
              },
              {
                header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title={`Descricao`} />
                , accessorKey: 'descricao',
                cell: ({ row }) => {
                  return row.getValue("descricao")
                },
                filterFn: IGRPDataTableFacetedFilterFn
              },
              {
                header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title={`Ordem`} />)
                , accessorKey: 'ordem',
                cell: ({ row }) => {
                  return row.getValue("ordem")
                },
                filterFn: IGRPDataTableFacetedFilterFn
              },
              {
                header: 'Estado'
                , accessorKey: 'estado',
                cell: ({ row }) => {
                  const estado = row.getValue("estado") as string;

                  // Determinar o estilo do badge com base no estado
                  const isAtivo = estado === 'ATIVO';
                  
                  return <IGRPDataTableCellBadge
                    label={estado}
                    variant={isAtivo ? 'solid' : 'outline'}
                    badgeClassName={isAtivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    iconName={isAtivo ? 'CheckCircle' : 'XCircle'}
                  />
                },
                filterFn: (row, id, value) => {
                  if (!value) return true;
                  return row.getValue(id) === value;
                }
              },
              {
                id: 'select',
                header: ({ table }) => <IGRPDataTableHeaderRowsSelect table={table} title={`X`} />,
                accessorKey: 'id',
                cell: ({ row }) => {
                  return <IGRPDataTableCellCheckbox
                    row={row}
                    value={row.original.id}
                  />
                },
                enableSorting: false,
                enableHiding: false,
                filterFn: IGRPDataTableFacetedFilterFn
              },
            ]
          }
          clientFilters={
            [
              {
                columnId: `categoria`,
                component: (column): JSX.Element => (
                  <IGRPDataTableFilterInput
                    column={column}
                    placeholder="Filtrar por categoria..."
                    onChange={handleSearchChange}
                  />
                )
              },
              {
                columnId: `estado`,
                component: (column): JSX.Element => {
                  // Set up column filter when component mounts
                  const EstadoFilterComponent = () => {
                    useEffect(() => {
                      if (estadoFilter && column) {
                        column.setFilterValue(estadoFilter);
                      }
                    }, []);
                    
                    return (
                      <IGRPDataTableFilterDropdown
                        column={column}
                        placeholder={`Estado...`}
                        options={dropdownFiltertableDropdownFilter1Options}
                      />
                    );
                  }
                  
                  return <EstadoFilterComponent />
                }
              },
            ]
          }

          data={contentTabletable1}
        />
        )}
      </div>
    </div>
  );
}
