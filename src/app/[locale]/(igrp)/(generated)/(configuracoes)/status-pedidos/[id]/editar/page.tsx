'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import StatusPedidoForm from '@/app/[locale]/(igrp)/(generated)/statusPedidos/components/statuspedidoform'
import { 
  IGRPPageHeader,
	IGRPButton 
} from "@igrp/igrp-framework-react-design-system";


export default function PageEditarstatuspedidoComponent() {

  
  
  

  return (
<div className={ cn('page',)}    >
	<div className={ cn('section',' space-y-6',)}    >
	<IGRPPageHeader
  title={ `Editar Status de Pedido` }
  description={ `Atualizar status de pedido existente` }
  showBackButton={ true }
  urlBackButton={ `/configuracoes/status-pedidos` }
>
  <div className="flex items-center gap-2">
    <IGRPButton
  
variant={ `default` }
showIcon={ true }
iconName={ `SaveAll` }
  onClick={ () => {} }
>
  Atualizar
</IGRPButton>
</div>
</IGRPPageHeader>

<StatusPedidoForm  id={ {{routeParams.id}} }   ></StatusPedidoForm></div></div>
  );
}
