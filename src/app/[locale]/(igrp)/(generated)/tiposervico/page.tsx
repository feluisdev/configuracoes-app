'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
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


export default function PageTiposervicoComponent() {

  const [contentTabletable1, setContentTabletable1] = useState<any[]>([]);
  const [dropdownFiltertableDropdownFilter1Options, setDropdownFiltertableDropdownFilter1Options] = useState<IGRPOptionsProps[]>([]);
  
  
const router = useRouter()

function goTonova (row?: any): void {
  router.push(`/categorias/nova`);
}


  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-x-6 space-y-6',)}    >
	<IGRPPageHeader
  title="Categorias de Serviços"
  description="Categorias de Serviços"
  iconBackButton="Search"
  variant="h3"
  
>
  <div className="flex items-center gap-2">
    <IGRPButton
  name={ `novaBt` }
  
variant={ "default" }
size={ "lg" }
showIcon={ true }
iconName={ "SquarePlus" }

  className={ cn() }
  onClick={ () => goTonova() }
  
>
  Nova
</IGRPButton>
    <IGRPButton
  name={ `eliminarBt` }
  
variant={ "secondary" }
size={ "lg" }
showIcon={ true }
iconName={ "Delete" }

  className={ cn() }
  onClick={ () => {} }
  
>
  Emilinar
</IGRPButton>
</div>
</IGRPPageHeader>

<IGRPDataTable<any, any>
  showFilter={ true }
  showToggleColumn={ true }
  columns={
    [
        {
          header: ' '
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
          labelTrigger: "Editar",icon: "SquarePen",href: `/categorias/${row.original.tableCheckboxCell1}/editar`,          showIcon: true,          action: (e) => {},
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
          header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title="Categoria" />
,accessorKey: 'tableTextCell1',
          cell: ({ row }) => {
          return row.getValue("tableTextCell1")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => <IGRPDataTableHeaderSortDropdown column={column} title="Descricao" />
,accessorKey: 'tableTextCell2',
          cell: ({ row }) => {
          return row.getValue("tableTextCell2")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ column }) => (<IGRPDataTableHeaderSortToggle column={column} title="Ordem" />)
,accessorKey: 'tableTextCell3',
          cell: ({ row }) => {
          return row.getValue("tableTextCell3")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Estado'
,accessorKey: 'tableBadgeCell1',
          cell: ({ row }) => {
          const rowData = row.original;


return <IGRPDataTableCellBadge
  label={ row.original.tableBadgeCell1 }
  variant="soft"
badgeClassName={ "" }
>

</IGRPDataTableCellBadge>
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: ({ table }) => <IGRPDataTableHeaderRowsSelect table={table} title="X" />
,accessorKey: 'tableCheckboxCell1',
          cell: ({ row }) => {
          return <IGRPDataTableCellCheckbox
  row={ row }
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
          columnId: "tableTextCell1",
          component: (column) => (
          <IGRPDataTableFilterInput column={column} />
          )
        },
        {
          columnId: "tableBadgeCell1",
          component: (column) => (
          <IGRPDataTableFilterDropdown
  column={column}
  placeholder="Filtar..."
  
  options={ dropdownFiltertableDropdownFilter1Options }
/>
          )
        },
    ]
  }
  
  data={ contentTabletable1 }
/></div></div>
  );
}
