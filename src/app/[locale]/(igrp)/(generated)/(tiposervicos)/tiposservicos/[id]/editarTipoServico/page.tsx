'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPFormHandle } from "@igrp/igrp-framework-react-design-system";
import { z } from "@igrp/igrp-framework-react-design-system"
import TipoServicoComp from '@/app/[locale]/(igrp)/(generated)/(tiposervicos)/tiposservicos/components/tiposervicocomp'
import { 
  IGRPForm 
} from "@igrp/igrp-framework-react-design-system";


export default function PageEditartiposervicoComponent() {

  const [contentFormform1, setContentFormform1] = useState<z.infer<anyZodType>>(null);
  const formform1Ref = useRef<IGRPFormHandle<anyZodType> | null>(null);
  

  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-x-6 space-y-6',)}    >
	<IGRPForm
  validationMode={ `onBlur` }
  gridClassName={ `grid grid-cols-4` }
formRef={ formform1Ref }
  onSubmit={ (e) => {} }
  defaultValues={ contentFormform1 }
>
  <>
  <div className={ cn('grid','grid-cols-4 ',' gap-1',)}    >
	<TipoServicoComp    ></TipoServicoComp></div>
</>
</IGRPForm></div></div>
  );
}
