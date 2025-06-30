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


export default function PageNovotiposervicoComponent() {

  
  
  

  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-y-6 space-x-6',)}    >
	<IGRPPageHeader
  title={ `Novo Tipo de Serviço` }
  description={ `Registar novo tipo de serviço` }
  iconBackButton={ `Search` }
  showBackButton={ true }
  urlBackButton={ `/configuracoes/tipos-servicos` }
  variant={ `h3` }
  
>
  <div className="flex items-center gap-2">
    <IGRPButton
  name={ `button1` }
  
variant={ `default` }
size={ `lg` }
showIcon={ true }
iconName={ `Save` }

  className={ cn() }
  onClick={ () => {} }
  
>
  Gravar
</IGRPButton>
</div>
</IGRPPageHeader>

<TipoServicoForm    ></TipoServicoForm></div></div>
  );
}
