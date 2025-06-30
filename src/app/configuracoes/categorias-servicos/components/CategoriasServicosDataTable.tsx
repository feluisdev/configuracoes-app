"use client";

import React from 'react';
import { CategoriaServico } from '@/models/configuracoes.models';
import {
  IGRPButton,
  IGRPDataTable,
  IGRPDataTableRowAction,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuLink,
  IGRPDataTableCellBadge,
  // IGRPDataTableColumnHeader, // Para usar com ordenação, etc.
  // type IGRPDataTableColumn // Para tipar as colunas
} from '@igrp/igrp-framework-react-design-system';
import { useRouter } from 'next/navigation'; // Para navegação no link de edição

interface CategoriasServicosDataTableProps {
  data: CategoriaServico[];
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  isLoading?: boolean;
}

const CategoriasServicosDataTable: React.FC<CategoriasServicosDataTableProps> = ({
  data,
  onEdit,
  onToggleStatus,
  isLoading,
}) => {
  const router = useRouter();

  const columns: any[] = [ // Substituir 'any' por IGRPDataTableColumn[] quando tiver a tipagem exata
    {
      header: 'Nome',
      accessorKey: 'nome',
    },
    {
      header: 'Código',
      accessorKey: 'codigo',
    },
    {
      header: 'Status',
      accessorKey: 'estado',
      cell: ({ row }: any) => {
        const estado = row.original.estado;
        return (
          <IGRPDataTableCellBadge
            label={estado === 'ATIVO' ? 'Ativo' : 'Inativo'}
            variant={estado === 'ATIVO' ? 'success' : 'destructive'} // Ou 'default' / 'warning'
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }: any) => {
        const categoria = row.original as CategoriaServico;
        const idParaAcao = categoria.categoriaId;
        return (
          <IGRPDataTableRowAction>
            <IGRPDataTableDropdownMenu
              items={[
                {
                  component: IGRPDataTableDropdownMenuLink,
                  props: {
                    labelTrigger: 'Editar',
                    icon: 'SquarePen',
                    showIcon: true,
                    // O href aqui é apenas um exemplo, a ação de edição abre um modal.
                    // Se fosse navegação direta: href: `/configuracoes/categorias-servicos/${idParaAcao}/editar`
                    // Como é modal, usamos o onClick do IGRPButton ou a prop action do item.
                    action: () => onEdit(idParaAcao),
                  }
                },
                {
                  component: IGRPButton, // Usando IGRPButton diretamente para ter mais controle no onClick
                  props: {
                    variant: "ghost",
                    className: "w-full justify-start px-2 py-1.5 text-sm",
                    children: categoria.estado === 'ATIVO' ? 'Inativar' : 'Ativar',
                    iconName: categoria.estado === 'ATIVO' ? 'ToggleLeft' : 'ToggleRight',
                    showIcon: true,
                    onClick: () => onToggleStatus(idParaAcao),
                  }
                }
              ]}
            />
          </IGRPDataTableRowAction>
        );
      },
    },
  ];

  if (isLoading && (!data || data.length === 0)) {
    return <div className="text-center p-4">Carregando dados da tabela...</div>;
  }
  if (!isLoading && (!data || data.length === 0)) {
    return <div className="text-center p-4">Nenhuma categoria encontrada.</div>;
  }

  return (
    <IGRPDataTable
      columns={columns}
      data={data}
      // showFilter={true} // Ativar se necessário, requer configuração de clientFilters
      // showToggleColumn={true} // Ativar se necessário
      // Adicionar outras props do IGRPDataTable conforme necessário (pagination, etc.)
    />
  );
};

export default CategoriasServicosDataTable;
