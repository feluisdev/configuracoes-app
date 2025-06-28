"use client";

import React from 'react';
import { TipoServico } from '@/models/configuracoes.models';
import { Button } from '@/components/ui/Button';

// Mock simples para DataTable por enquanto (pode ser substituído por ShadCN Table)
const DataTableMock: React.FC<{ columns: Array<{accessorKey: string, header: string, renderCell?: (value: any, row: any) => React.ReactNode}>, data: any[], isLoading?: boolean, renderRowActions?: (row: any) => React.ReactNode }> = ({ columns, data, isLoading, renderRowActions }) => {
  if (isLoading && (!data || data.length === 0) ) return <div className="text-center p-4">Carregando dados da tabela...</div>;
  if (!isLoading && (!data || data.length === 0)) return <div className="text-center p-4">Nenhum tipo de serviço encontrado.</div>;

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
        {data.map((item, index) => (
          <tr key={item.tipoServicoId || item.id || index}>
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


interface TiposServicosDataTableProps {
  data: TipoServico[];
  onEdit: (id: string) => void; // tipoServicoId
  onToggleStatus: (id: string) => void; // tipoServicoId
  isLoading?: boolean;
}

const TiposServicosDataTable: React.FC<TiposServicosDataTableProps> = ({
  data,
  onEdit,
  onToggleStatus,
  isLoading,
}) => {

  const columns = [
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'codigo', header: 'Código' },
    {
      accessorKey: 'categoria',
      header: 'Categoria',
      renderCell: (value: any, row: TipoServico) => row.categoria?.nome || 'N/A' // ListaTipoServicoDTO tem 'categoria' como nome
    },
    {
      accessorKey: 'estado',
      header: 'Status',
      renderCell: (value: string) => (
        value === 'ATIVO' ?
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span> :
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inativo</span>
      )
    },
  ];

  const renderRowActions = (row: TipoServico) => {
    const idParaAcao = row.tipoServicoId;
    return (
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(idParaAcao)}>
          Editar
        </Button>
        <Button
          variant={row.estado === 'ATIVO' ? "destructive" : "default"}
          size="sm"
          onClick={() => onToggleStatus(idParaAcao)}
        >
          {row.estado === 'ATIVO' ? 'Inativar' : 'Ativar'}
        </Button>
      </div>
    );
  }

  return <DataTableMock columns={columns} data={data} isLoading={isLoading} renderRowActions={renderRowActions} />;
};

export default TiposServicosDataTable;
