'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import CategoriaForm from '@/app/[locale]/(igrp)/(generated)/(configuracoes)/categorias/components/categoriaform'
import { 
  IGRPPageHeader,
	IGRPButton 
} from "@igrp/igrp-framework-react-design-system";


export default function PageEditarComponent({ params }: { params: { id: string } }) {
  const formRef = useRef<HTMLFormElement>(null);
  const categoriaFormRef = useRef<any>(null);
  // Usar React.use para acessar params.id de forma segura
  const { id } = params;

  const handleSubmit = () => {
    // Acionar o submit do formulário através da referência ao componente CategoriaForm
    if (categoriaFormRef.current && categoriaFormRef.current.submitForm) {
      categoriaFormRef.current.submitForm();
    }
  };

  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-x-6 space-y-6',)}    >
	<IGRPPageHeader
  title={ `Atualizar Categoria` }
  description={ `Atualizar Categoria de Serviço` }
  iconBackButton={ `Search` }
  showBackButton={ true }
  urlBackButton={ `/categorias` }
  variant={ `h3` }
  
>
  <div className="flex items-center gap-2">
    <IGRPButton
  name={ `button1` }
  
variant={ `default` }
size={ `lg` }
showIcon={ true }
iconName={ `SaveAll` }

  className={ cn() }
  onClick={handleSubmit}
  
>
  Atualizar
</IGRPButton>
</div>
</IGRPPageHeader>

<div>
  <CategoriaForm id={id} ref={categoriaFormRef}></CategoriaForm>
</div></div></div>
  );
}
