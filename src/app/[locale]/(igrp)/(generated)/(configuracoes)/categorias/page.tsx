'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
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


export default function PageCategoriasComponent() {


  type Table1 = {
    categoria: string;
    descricao: string;
    ordem: number;
    estado: string;
    id: string;
  }

  const [contentTabletable1, setContentTabletable1] = useState<Table1[]>([]);
  const [dropdownFiltertableDropdownFilter1Options, setDropdownFiltertableDropdownFilter1Options] = useState<IGRPOptionsProps[]>([]);


  const [categoriaFilrer, setCategoriaFilrer] = useState<string>(``);
  const [estadoFilter, setEstadoFilter] = useState<string>(``);
  const router = useRouter();
  const { igrpToast: toast } = useIGRPToast();


  // Usar o hook useCategorias para buscar os dados
  const {
    categorias,
    total,
    options,
    isLoading,
    isError,
    error,
    getStatusBadge,
    deleteCategoriaMutation
  } = useCategorias();

  useEffect(() => {
    // Mapear as categorias para o formato esperado pela tabela
    if (categorias && categorias.length > 0) {
      const mappedData = categorias.map(categoria => ({
        categoria: categoria.nome,
        descricao: categoria.descricao || '',
        ordem: categoria.ordem || 0,
        estado: categoria.estado || 'ATIVO',
        id: categoria.categoriaId
      }));

      setContentTabletable1(mappedData);

      // Configurar opções para o filtro de estado
      if (options && options.length > 0) {
        setDropdownFiltertableDropdownFilter1Options(options);
      }
    }
  }, [categorias, options]);

  function goTonova(row?: any): void {
    router.push(`/categorias/nova`);
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
      // Para cada ID selecionado, chamar a mutation de delete
      ids.forEach(id => {
        deleteCategoriaMutation.mutate(id, {
          onSuccess: () => {
            toast({
              title: 'Sucesso',
              description: 'Categoria eliminada com sucesso',
              type: 'success'
            });
          },
          onError: (error) => {
            toast({
              title: 'Erro',
              description: `Erro ao eliminar categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
              type: 'error'
            });
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
                  if (row.value && row.value !== 'on') { // Ignorar o checkbox de selecionar todos
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

        <IGRPDataTable<Table1, Table1>
          showFilter={true}
          showToggleColumn={true}
          className={cn('', 'block',)}
          //isLoading={isLoading}
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
                  const rowData = row.original;
                  const estado = row.getValue("estado") as string;

                  // Criar um objeto de badge baseado no estado
                  let variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" = "default";
                  
                  if (estado === 'ATIVO') {
                    variant = "success";
                  } else if (estado === 'INATIVO') {
                    variant = "destructive";
                  }

                  return <IGRPDataTableCellBadge
                    label={estado}
                    variant={estado === 'ATIVO' ? 'solid' : 'outline'}
                    badgeClassName={estado === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  />
                },
                filterFn: IGRPDataTableFacetedFilterFn
              },
              {
                header: ({ table }) => <IGRPDataTableHeaderRowsSelect table={table} title={`X`} />
                , accessorKey: 'id',
                cell: ({ row }) => {
                  return <IGRPDataTableCellCheckbox
                    row={row}
                  >
                  </IGRPDataTableCellCheckbox>
                },
                filterFn: IGRPDataTableFacetedFilterFn
              },
            ]
          }
          clientFilters={
            [
              {
                columnId: `categoria`,
                component: (column) => (
                  <IGRPDataTableFilterInput column={column} />
                )
              },
              {
                columnId: `estado`,
                component: (column) => (
                  <IGRPDataTableFilterDropdown
                    column={column}
                    placeholder={`Estado...`}

                    options={dropdownFiltertableDropdownFilter1Options}
                  />
                )
              },
            ]
          }

          data={contentTabletable1}
        /></div></div>
  );
}
