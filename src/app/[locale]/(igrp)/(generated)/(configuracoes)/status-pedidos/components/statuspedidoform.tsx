'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPFormHandle } from "@igrp/igrp-framework-react-design-system";
import { z } from "@igrp/igrp-framework-react-design-system"
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import { 
  IGRPForm,
	IGRPInputText,
	IGRPTextarea,
	IGRPInputColor,
	IGRPInputNumber,
	IGRPSelect 
} from "@igrp/igrp-framework-react-design-system";

export default function Statuspedidoform({ id }: { id?: string }) {

  
  const formStatusPedido = z.object({
    nome: z.string().optional(),
    codigo: z.string().optional(),
    descricao: z.string().optional(),
    cor: z.string().optional(),
    icone: z.string().optional(),
    ordem: z.number().optional(),
    visivelPortal: z.boolean().optional()
})

type FormStatusPedidoZodType = typeof formStatusPedido;

const initFormStatusPedido: z.infer<FormStatusPedidoZodType> = {
    nome: ``,
    codigo: ``,
    descricao: ``,
    cor: ``,
    icone: ``,
    ordem: undefined,
    visivelPortal: undefined
}

  const formformStatusPedidoRef = useRef<IGRPFormHandle<FormStatusPedidoZodType> | null>(null);
  const [formStatusPedidoData, setFormStatusPedidoData] = useState<any>(initFormStatusPedido);
  const [selectVisivelPortalOptionsSP, setSelectVisivelPortalOptionsSP] = useState<IGRPOptionsProps[]>([{"label":"Sim","value":"true"},{"label":"Não","value":"false"}]);
  const [selectVisivelPortalValueSP, setSelectVisivelPortalValueSP] = useState<string>(`true`);
  
const { igrpToast } = useIGRPToast()


  return (
<div className={ cn('component',)}    >
	<IGRPForm
  schema={ formStatusPedido }
  validationMode={ `onBlur` }
  gridClassName={ `flex flex-col` }
formRef={ formformStatusPedidoRef }
  onSubmit={ (e) => {} }
  defaultValues={ formStatusPedidoData }
>
  <>
  <div className={ cn('grid','grid-cols-12',' gap-4',)}    >
	<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPInputText
  name={ `nome` }
  label={ `Nome` }

placeholder={ `Nome do Status` }
required={ true }


  
  
>
</IGRPInputText>
<IGRPInputText
  name={ `codigo` }
  label={ `Código` }

placeholder={ `Código do Status` }
required={ true }


  
  
>
</IGRPInputText>
<IGRPTextarea
  name={ `descricao` }
  label={ `Descrição` }

rows={ 3 }
required={ false }


placeholder={ `Introduza uma descrição para o status` }
  
  
>
</IGRPTextarea></div>
<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPInputColor
  name={ `cor` }
  label={ `Cor` }

defaultValue={ `#007bff` }
showHexValue={ true }
required={ false }


  
  
>
</IGRPInputColor>
<IGRPInputText
  name={ `icone` }
  label={ `Ícone (Font Awesome)` }

placeholder={ `Ex: fa-circle-check` }
required={ false }


  
  
>
</IGRPInputText>
<IGRPInputNumber
  name={ `ordem` }
  label={ `Ordem` }

min={ 0 }
max={ 999 }
step={ 1 }
required={ false }


  
  
>
</IGRPInputNumber>
<IGRPSelect
  name={ `visivelPortal` }
  label={ `Visível no Portal?` }

required={ true }



  
  options={ selectVisivelPortalOptionsSP }
value={ selectVisivelPortalValueSP }
>
</IGRPSelect></div></div>
</>
</IGRPForm></div>
  );
}