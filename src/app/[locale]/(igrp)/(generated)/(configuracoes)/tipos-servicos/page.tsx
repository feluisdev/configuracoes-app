'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
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


export default function PageTiposservicosComponent() {

  const [contentTableTiposServicos, setContentTableTiposServicos] = useState<any[]>([]);
  
  
const router = useRouter()

function goToNovo (row?: any): void {
  router.push(`/configuracoes/tipos-servicos/novo`);
}


  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-x-6 space-y-6',)}    >
	<IGRPPageHeader
  title={ `Gerenciar Tipos de Serviços` }
  description={ `Crie, edite e gerencie os tipos de serviços.` }
  iconBackButton={ `Search` }
  variant={ `h3` }
>
  <div className="flex items-center gap-2">
    <IGRPButton
  name={ `novoBt` }
  
variant={ `default` }
size={ `lg` }
showIcon={ true }
iconName={ `SquarePlus` }

  onClick={ () => goToNovo() }
  
>
  Novo Tipo de Serviço
</IGRPButton>
</div>
</IGRPPageHeader>

<IGRPDataTable<any, any>
  showFilter={ true }
  showToggleColumn={ true }
  columns={
    [
        {
          header: 'Ações'
,accessorKey: 'tableActionListCell1',
          enableHiding: false,cell: ({ row }) => {
          const rowData = row.original;

return (
<IGRPDataTableRowAction>
  <IGRPDataTableDropdownMenu
  items={
    [
      {
        component: IGRPDataTableDropdownMenuLink,
        props: {
          labelTrigger: `Editar`,icon: `SquarePen`,href: `/configuracoes/tipos-servicos/${row.original.tipoServicoId_col_ref}/editar`,          showIcon: true,          action: (e) => {},
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
          header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title={ `Nome` } />
,accessorKey: 'tableTextCell1',
          cell: ({ row }) => {
          return row.getValue("tableTextCell1")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title={ `Código` } />
,accessorKey: 'tableTextCell2',
          cell: ({ row }) => {
          return row.getValue("tableTextCell2")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title={ `Categoria` } />
,accessorKey: 'tableTextCell3',
          cell: ({ row }) => {
          return row.getValue("tableTextCell3")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Status'
,accessorKey: 'tableBadgeCell1',
          cell: ({ row }) => {
          const rowData = row.original;


return <IGRPDataTableCellBadge
  label={ row.original.tableBadgeCell1 }
  variant={ `soft` }
badgeClassName={ `` }
>

</IGRPDataTableCellBadge>
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
]
  }
  clientFilters={
    [
    ]
  }
  
  data={ contentTableTiposServicos }
/></div></div>
  );
}
