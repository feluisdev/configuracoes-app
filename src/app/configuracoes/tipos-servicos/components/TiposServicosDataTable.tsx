"use client";

import React from 'react';
import { TipoServico } from '@/models/configuracoes.models';
import {
  IGRPButton,
  IGRPDataTable,
  IGRPDataTableRowAction,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuLink,
  IGRPDataTableCellBadge,
} from '@igrp/igrp-framework-react-design-system';

interface TiposServicosDataTableProps {
  data: TipoServico[];
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  isLoading?: boolean;
}

const TiposServicosDataTable: React.FC<TiposServicosDataTableProps> = ({
  data,
  onEdit,
  onToggleStatus,
  isLoading,
}) => {

  const columns: any[] = [
    {
      header: 'Nome',
      accessorKey: 'nome',
    },
    {
      header: 'Código',
      accessorKey: 'codigo',
    },
    {
      header: 'Categoria',
      accessorKey: 'categoria', // No ListaTipoServicoDTO, 'categoria' é o nome da categoria
      cell: ({ row }: any) => row.original.categoria?.nome || row.original.categoria || 'N/A'
    },
    {
      header: 'Status',
      accessorKey: 'estado',
      cell: ({ row }: any) => {
        const estado = row.original.estado;
        return (
          <IGRPDataTableCellBadge
            label={estado === 'ATIVO' ? 'Ativo' : 'Inativo'}
            variant={estado === 'ATIVO' ? 'success' : 'destructive'}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }: any) => {
        const tipoServico = row.original as TipoServico;
        const idParaAcao = tipoServico.tipoServicoId;
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
                    action: () => onEdit(idParaAcao),
                  }
                },
                {
                  component: IGRPButton,
                  props: {
                    variant: "ghost",
                    className: "w-full justify-start px-2 py-1.5 text-sm",
                    children: tipoServico.estado === 'ATIVO' ? 'Inativar' : 'Ativar',
                    iconName: tipoServico.estado === 'ATIVO' ? 'ToggleLeft' : 'ToggleRight',
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
    return <div className="text-center p-4">Nenhum tipo de serviço encontrado.</div>;
  }

  return <IGRPDataTable columns={columns} data={data} />;
};

export default TiposServicosDataTable;
