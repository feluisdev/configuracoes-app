"use client";

import React from 'react';
import { CategoriaServico } from '@/models/configuracoes.models';
// import { DataTable } from '@/components/ui/DataTable'; // Supondo um componente DataTable genérico
// import { ColumnDef } from "@tanstack/react-table"; // Se usar TanStack Table
import { Button } from '@/components/ui/Button';
// import LoadingSpinner from '@/components/shared/LoadingSpinner';

// Mock simples para DataTable por enquanto
const DataTableMock: React.FC<{ columns: any[], data: any[], isLoading?: boolean, renderRowActions?: (row: any) => React.ReactNode }> = ({ columns, data, isLoading, renderRowActions }) => {
  if (isLoading) return <p>Carregando dados da tabela...</p>;
  if (!data || data.length === 0) return <p>Nenhuma categoria encontrada.</p>;

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
          <tr key={item.id || item.categoriaId || index}>
            {columns.map((col) => (
              <td key={col.accessorKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item[col.accessorKey]}
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


interface CategoriasServicosDataTableProps {
  data: CategoriaServico[];
  onEdit: (id: string) => void; // ID pode ser string (categoriaId) ou number (id)
  onToggleStatus: (id: string) => void; // ID pode ser string (categoriaId) ou number (id)
  isLoading?: boolean;
}

const CategoriasServicosDataTable: React.FC<CategoriasServicosDataTableProps> = ({
  data,
  onEdit,
  onToggleStatus,
  isLoading,
}) => {
  // Definição de colunas para TanStack Table (exemplo)
  // const columns: ColumnDef<CategoriaServico>[] = [
  //   { accessorKey: 'nome', header: 'Nome' },
  //   { accessorKey: 'codigo', header: 'Código' },
  //   {
  //     accessorKey: 'estado',
  //     header: 'Status',
  //     cell: ({ row }) => row.original.estado === 'ATIVO' ?
  //       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span> :
  //       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inativo</span>
  //   },
  //   {
  //     id: 'actions',
  //     header: 'Ações',
  //     cell: ({ row }) => (
  //       <div className="space-x-2">
  //         <Button variant="outline" size="sm" onClick={() => onEdit(row.original.categoriaId || row.original.id!.toString())}>Editar</Button>
  //         <Button variant="outline" size="sm" onClick={() => onToggleStatus(row.original.categoriaId || row.original.id!.toString())}>
  //           {row.original.estado === 'ATIVO' ? 'Inativar' : 'Ativar'}
  //         </Button>
  //       </div>
  //     ),
  //   },
  // ];

  // Colunas para o DataTableMock
  // A interface CategoriaServico já tem 'estado' (String) e 'ativo' (boolean, opcional)
  // ListaCategoriaDTO do backend tem 'estado' (String)
  // CategoriasServicosResponseDTO do backend tem 'ativo' (boolean)
  // A service faz um mapeamento para garantir 'estado' e 'ativo' na interface CategoriaServico.
  const mockColumns = [
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'codigo', header: 'Código' },
    {
      accessorKey: 'estado',
      header: 'Status',
      renderCell: (value: string) => ( // Função para renderizar a célula de status de forma mais rica
        value === 'ATIVO' ?
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span> :
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inativo</span>
      )
    },
    // { accessorKey: 'descricao', header: 'Descrição' }, // Adicionar se necessário
  ];

  const renderRowActions = (row: CategoriaServico) => {
    // Usar categoriaId que é String e esperado pelo backend nos path params
    const idParaAcao = row.categoriaId;

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

  // Modificando o DataTableMock para usar renderCell
const DataTableMock: React.FC<{ columns: Array<{accessorKey: string, header: string, renderCell?: (value: any) => React.ReactNode}>, data: any[], isLoading?: boolean, renderRowActions?: (row: any) => React.ReactNode }> = ({ columns, data, isLoading, renderRowActions }) => {
  if (isLoading && (!data || data.length === 0) ) return <div className="text-center p-4">Carregando dados da tabela...</div>; // Mostrar loading apenas se não houver dados ainda
  if (!isLoading && (!data || data.length === 0)) return <div className="text-center p-4">Nenhuma categoria encontrada.</div>;

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
          <tr key={item.categoriaId || item.id || index}> {/* Priorizar categoriaId */}
            {columns.map((col) => (
              <td key={col.accessorKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {col.renderCell ? col.renderCell(item[col.accessorKey]) : item[col.accessorKey]}
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

  return <DataTableMock columns={mockColumns} data={data} isLoading={isLoading} renderRowActions={renderRowActions} />;
};

export default CategoriasServicosDataTable;
