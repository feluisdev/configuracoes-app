'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import TipoServicoForm from '@/app/[locale]/(igrp)/(generated)/tipos-servicos/components/tiposervicoform'
import { 
  IGRPPageHeader,
	IGRPButton 
} from "@igrp/igrp-framework-react-design-system";


export default function PageEditartiposervicoComponent() {

  
  
  

  return (
<div className={ cn('page',)}    >
	<div className={ cn('section',' space-y-6',)}    >
	<IGRPPageHeader
  title={ `Editar Tipo de Serviço` }
  description={ `Atualizar tipo de serviço existente` }
  showBackButton={ true }
  urlBackButton={ `/configuracoes/tipos-servicos` }
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

<TipoServicoForm  id={ {{routeParams.id}} }   ></TipoServicoForm></div></div>
  );
}
