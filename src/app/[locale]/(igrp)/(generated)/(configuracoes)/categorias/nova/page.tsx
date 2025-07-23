'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@igrp/igrp-framework-react-design-system';
import CategoriaFormulario from '@/app/[locale]/(igrp)/(generated)/(configuracoes)/categorias/components/categoriaformulario'
import { 
  IGRPPageHeader,
  IGRPButton 
} from '@igrp/igrp-framework-react-design-system';

export default function PageNovaComponent() {
  const router = useRouter();
  const [onSubmit, setOnSubmit] = useState<boolean>(false);

  // Função para lidar com o clique no botão de gravar
  const handleSave = () => {
    setOnSubmit(true);
  };

  // Função para redirecionar após o envio bem-sucedido
  const afterSubmit = () => {
    router.push('/categorias');
  };

  return (
    <div className={cn('page', 'space-y-6')}>
      <div className={cn('section', ' space-x-6 space-y-6')}>
        <IGRPPageHeader
          name={`pageHeader1`}
          title={`Nova Categoria`}
          description={`Registar nova categoria`}
          iconBackButton={`ArrowLeft`}
          showBackButton={true}
          urlBackButton={`/categorias`}
          variant={`h3`}
        >
          <div className="flex items-center gap-2">
            <IGRPButton
              name={`button1`}
              variant={`default`}
              size={`lg`}
              showIcon={true}
              iconName={`Save`}
              className={cn()}
              onClick={handleSave}
            >
              Gravar
            </IGRPButton>
          </div>
        </IGRPPageHeader>

        <CategoriaFormulario 
          onSubmit={onSubmit} 
          afterSubmit={afterSubmit} 
        />
      </div>
    </div>
  );
}
