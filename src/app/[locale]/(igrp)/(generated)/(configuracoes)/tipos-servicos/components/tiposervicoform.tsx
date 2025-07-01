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
	IGRPSelect,
	IGRPTextarea,
	IGRPInputNumber 
} from "@igrp/igrp-framework-react-design-system";

export default function Tiposervicoform({ id } : { id?: string }) {

  
  const formTipoServico = z.object({
    nome: z.string().optional(),
    codigo: z.string().optional(),
    categoriaId: z.string().optional(),
    descricao: z.string().optional(),
    prazoEstimado: z.number().optional(),
    valorBase: z.number().optional(),
    requerVistoria: z.boolean().optional(),
    requerAnaliseTec: z.boolean().optional(),
    requerAprovacao: z.boolean().optional(),
    disponivelPortal: z.boolean().optional(),
    ativo: z.boolean().optional()
})

type FormTipoServicoZodType = typeof formTipoServico;

const initFormTipoServico: z.infer<FormTipoServicoZodType> = {
    nome: ``,
    codigo: ``,
    categoriaId: ``,
    descricao: ``,
    prazoEstimado: undefined,
    valorBase: undefined,
    requerVistoria: undefined,
    requerAnaliseTec: undefined,
    requerAprovacao: undefined,
    disponivelPortal: undefined,
    ativo: undefined
}

  const formformTipoServicoRef = useRef<IGRPFormHandle<FormTipoServicoZodType> | null>(null);
  const [formTipoServicoData, setFormTipoServicoData] = useState<any>(initFormTipoServico);
  const [selectCategoriaOptions, setSelectCategoriaOptions] = useState<IGRPOptionsProps[]>([]);
  const [requerVistoriaOptions, setRequerVistoriaOptions] = useState<IGRPOptionsProps[]>([{"label":"Sim","value":"true"},{"label":"Não","value":"false"}]);
  const [requerVistoriaValue, setRequerVistoriaValue] = useState<string>(`false`);
  const [requerAnaliseTecOptions, setRequerAnaliseTecOptions] = useState<IGRPOptionsProps[]>([{"label":"Sim","value":"true"},{"label":"Não","value":"false"}]);
  const [requerAnaliseTecValue, setRequerAnaliseTecValue] = useState<string>(`false`);
  const [requerAprovacaoOptions, setRequerAprovacaoOptions] = useState<IGRPOptionsProps[]>([{"label":"Sim","value":"true"},{"label":"Não","value":"false"}]);
  const [requerAprovacaoValue, setRequerAprovacaoValue] = useState<string>(`false`);
  const [disponivelPortalOptions, setDisponivelPortalOptions] = useState<IGRPOptionsProps[]>([{"label":"Sim","value":"true"},{"label":"Não","value":"false"}]);
  const [disponivelPortalValue, setDisponivelPortalValue] = useState<string>(`true`);
  const [ativoOptionsTS, setAtivoOptionsTS] = useState<IGRPOptionsProps[]>([{"label":"Sim","value":"true"},{"label":"Não","value":"false"}]);
  const [ativoValueTS, setAtivoValueTS] = useState<string>(`true`);
  
const { igrpToast } = useIGRPToast()


  return (
<div className={ cn('component',)}    >
	<IGRPForm
  schema={ formTipoServico }
  validationMode={ `onBlur` }
  gridClassName={ `flex flex-col` }
formRef={ formformTipoServicoRef }
  onSubmit={ (e) => {} }
  defaultValues={ formTipoServicoData }
>
  <>
  <div className={ cn('grid','grid-cols-12',' gap-4',)}    >
	<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPInputText
  name={ `nome` }
  label={ `Nome` }
showIcon={ false }
required={ true }


placeholder={ `Nome do Tipo de Serviço` }
  
  
>
</IGRPInputText>
<IGRPInputText
  name={ `codigo` }
  label={ `Código` }
showIcon={ false }
required={ true }


placeholder={ `Código do Tipo de Serviço` }
  
  
>
</IGRPInputText>
<IGRPSelect
  name={ `categoriaId` }
  label={ `Categoria` }
placeholder={ `Selecione uma categoria` }

required={ true }
gridSize={ `full` }


  onValueChange={ () => {} }
  options={ selectCategoriaOptions }
>
</IGRPSelect>
<IGRPTextarea
  name={ `descricao` }
  label={ `Descrição` }

rows={ 5 }
required={ false }


placeholder={ `Introduza uma descrição para o tipo de serviço` }
  
  
>
</IGRPTextarea></div>
<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPInputNumber
  name={ `prazoEstimado` }
  label={ `Prazo Estimado (dias)` }

min={ 0 }
max={ 9999999 }
step={ 1 }
required={ false }


  
  
>
</IGRPInputNumber>
<IGRPInputNumber
  name={ `valorBase` }
  label={ `Valor Base (CVE)` }

min={ 0 }
max={ 9999999 }
step={ 0.01 }
required={ false }


  
  
>
</IGRPInputNumber>
<IGRPSelect
  name={ `requerVistoria` }
  label={ `Requer Vistoria?` }

required={ false }



  
  options={ requerVistoriaOptions }
value={ requerVistoriaValue }
>
</IGRPSelect>
<IGRPSelect
  name={ `requerAnaliseTec` }
  label={ `Requer Análise Técnica?` }

required={ false }



  
  options={ requerAnaliseTecOptions }
value={ requerAnaliseTecValue }
>
</IGRPSelect>
<IGRPSelect
  name={ `requerAprovacao` }
  label={ `Requer Aprovação?` }

required={ false }



  
  options={ requerAprovacaoOptions }
value={ requerAprovacaoValue }
>
</IGRPSelect>
<IGRPSelect
  name={ `disponivelPortal` }
  label={ `Disponível no Portal?` }

required={ false }



  
  options={ disponivelPortalOptions }
value={ disponivelPortalValue }
>
</IGRPSelect>
<IGRPSelect
  name={ `ativo` }
  label={ `Ativo?` }

required={ false }



  
  options={ ativoOptionsTS }
value={ ativoValueTS }
>
</IGRPSelect></div></div>
</>
</IGRPForm></div>
  );
}