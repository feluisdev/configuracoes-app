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
	IGRPInputHidden,
	IGRPInputNumber,
	IGRPSelect,
	IGRPIcon,
	IGRPInputColor 
} from "@igrp/igrp-framework-react-design-system";

export default function Categoriaform({ {{id}} } : { {{id}}?: string }) {

  const formform1Ref = useRef<IGRPFormHandle<anyZodType> | null>(null);
  const [contentFormform1, setContentFormform1] = useState<z.infer<anyZodType>>(null);
  const [selectselect1Value, setSelectselect1Value] = useState<string>(``);
  const [selectselect1Options, setSelectselect1Options] = useState<IGRPOptionsProps[]>([]);
  
const { igrpToast } = useIGRPToast()


  return (
<div className={ cn('component',)}    >
	<IGRPForm
  validationMode={ `onBlur` }
  gridClassName={ `flex flex-col` }
formRef={ formform1Ref }
  onSubmit={ (e) => {} }
  defaultValues={ contentFormform1 }
>
  <>
  <div className={ cn('grid','grid-cols-12',' gap-4',)}    >
	<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPInputText
  name={ `inputText1` }
  label={ `Nome` }
showIcon={ false }
required={ false }


placeholder={ `O Nome da Categoria de serviço` }
  
  
>
</IGRPInputText>
<IGRPTextarea
  name={ `inputTextarea1` }
  
label={ `Descrição` }
rows={ 10 }
required={ false }


placeholder={ `Introduza uma descrição para a categoria de serviço` }
  
  
>
</IGRPTextarea>
<IGRPInputHidden
  name={ `inputHidden1` }
  label={ `id` }
required={ false }


  
  
>
</IGRPInputHidden></div>
<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<div className={ cn('grid','grid-cols-12',' gap-4',)}    >
	<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPInputNumber
  name={ `inputNumber1` }
  label={ `Ordem` }

max={ 9999999 }
step={ 1 }
required={ false }


description={ `Organize a sua categoria` }
  
  
>
</IGRPInputNumber>
<IGRPSelect
  name={ `select1` }
  label={ `Ativo?` }
placeholder={ `Select an option...` }

gridSize={ `full` }


  onValueChange={ () => {} }
  value={ selectselect1Value }
options={ selectselect1Options }
>
</IGRPSelect></div>
<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPIcon
  name={ `icone` }
  iconName={ `Heart` }
size={ 24 }

  
  
>
</IGRPIcon>
<IGRPInputColor
  name={ `inputColor1` }
  label={ `Cor` }

defaultValue={ `#000000` }
showHexValue={ true }
required={ false }


  
  
>
</IGRPInputColor></div></div></div></div>
</>
</IGRPForm></div>
  );
}