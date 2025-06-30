"use client";

import React from 'react';
import { StatusPedido } from '@/models/configuracoes.models';
import {
  IGRPButton,
  IGRPDataTable,
  IGRPDataTableRowAction,
  IGRPDataTableDropdownMenu,
  IGRPDataTableDropdownMenuLink,
  IGRPDataTableCellBadge,
} from '@igrp/igrp-framework-react-design-system';

interface StatusPedidosDataTableProps {
  data: StatusPedido[];
  onEdit: (id: number) => void;
  onToggleStatus: (id: number) => void;
  isLoading?: boolean;
}

const StatusPedidosDataTable: React.FC<StatusPedidosDataTableProps> = ({
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
      header: 'Cor',
      accessorKey: 'cor',
      cell: ({ row }: any) => {
        const cor = row.original.cor;
        return (
          <div className="flex items-center">
            <span style={{ backgroundColor: cor, width: '20px', height: '20px', borderRadius: '3px', marginRight: '8px', border: '1px solid #ccc' }}></span>
            {cor}
          </div>
        )
      }
    },
    {
      header: 'Ordem',
      accessorKey: 'ordem',
      // TODO: Adicionar ordenação por esta coluna se IGRPDataTable suportar
    },
    {
      header: 'Visível no Portal',
      accessorKey: 'estado', // Mapeado de 'visivelPortal' no service
      cell: ({ row }: any) => {
        const estado = row.original.estado;
        return (
          <IGRPDataTableCellBadge
            label={estado === 'ATIVO' ? 'Sim' : 'Não'}
            variant={estado === 'ATIVO' ? 'success' : 'default'} // 'default' para 'Não' pode ser cinza
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }: any) => {
        const status = row.original as StatusPedido;
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
                    action: () => onEdit(status.id),
                  }
                },
                {
                  component: IGRPButton,
                  props: {
                    variant: "ghost",
                    className: "w-full justify-start px-2 py-1.5 text-sm",
                    children: status.estado === 'ATIVO' ? 'Tornar Não Visível' : 'Tornar Visível',
                    iconName: status.estado === 'ATIVO' ? 'EyeOff' : 'Eye',
                    showIcon: true,
                    onClick: () => onToggleStatus(status.id),
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
    return <div className="text-center p-4">Nenhum status de pedido encontrado.</div>;
  }

  return <IGRPDataTable columns={columns} data={data} />;
};

export default StatusPedidosDataTable;
