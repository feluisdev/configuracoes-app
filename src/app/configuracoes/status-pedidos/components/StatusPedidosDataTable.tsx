"use client";

import React from 'react';
import { StatusPedido } from '@/models/configuracoes.models';
import { Button } from '@/components/ui/Button';

// Mock simples para DataTable (substituir por ShadCN Table)
const DataTableMock: React.FC<{ columns: Array<{accessorKey: string, header: string, renderCell?: (value: any, row: any) => React.ReactNode}>, data: any[], isLoading?: boolean, renderRowActions?: (row: any) => React.ReactNode }> = ({ columns, data, isLoading, renderRowActions }) => {
  if (isLoading && (!data || data.length === 0) ) return <div className="text-center p-4">Carregando dados da tabela...</div>;
  if (!isLoading && (!data || data.length === 0)) return <div className="text-center p-4">Nenhum status de pedido encontrado.</div>;

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col) => (
            <th key={col.accessorKey} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {col.header}
            </th>
          ))}
          {renderRowActions && (
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.accessorKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {col.renderCell ? col.renderCell(item[col.accessorKey], item) : item[col.accessorKey]}
              </td>
            ))}
            {renderRowActions && (
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {renderRowActions(item)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface StatusPedidosDataTableProps {
  data: StatusPedido[];
  onEdit: (id: number) => void; // ID é number
  onToggleStatus: (id: number) => void; // ID é number
  isLoading?: boolean;
}

const StatusPedidosDataTable: React.FC<StatusPedidosDataTableProps> = ({
  data,
  onEdit,
  onToggleStatus,
  isLoading,
}) => {

  const columns = [
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'codigo', header: 'Código' },
    {
      accessorKey: 'cor',
      header: 'Cor',
      renderCell: (value: string) => (
        <div className="flex items-center">
          <span style={{ backgroundColor: value, width: '20px', height: '20px', borderRadius: '50%', marginRight: '8px', border: '1px solid #ccc' }}></span>
          {value}
        </div>
      )
    },
    { accessorKey: 'ordem', header: 'Ordem' },
    {
      accessorKey: 'estado', // Usando o campo 'estado' que é mapeado a partir de 'visivelPortal'
      header: 'Status',
      renderCell: (value: string) => (
        value === 'ATIVO' ?
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo/Visível</span> :
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inativo/Não Visível</span>
      )
    },
  ];

  const renderRowActions = (row: StatusPedido) => {
    return (
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(row.id)}>
          Editar
        </Button>
        <Button
          variant={row.estado === 'ATIVO' ? "destructive" : "default"}
          size="sm"
          onClick={() => onToggleStatus(row.id)}
        >
          {row.estado === 'ATIVO' ? 'Tornar Não Visível' : 'Tornar Visível'}
        </Button>
      </div>
    );
  }

  return <DataTableMock columns={columns} data={data} isLoading={isLoading} renderRowActions={renderRowActions} />;
};

export default StatusPedidosDataTable;
