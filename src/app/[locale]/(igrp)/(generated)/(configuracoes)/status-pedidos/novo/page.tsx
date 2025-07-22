'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import StatusPedidoForm from '@/app/[locale]/(igrp)/(generated)/(configuracoes)/status-pedidos/components/statuspedidoform'
import {
  IGRPPageHeader,
  IGRPButton
} from "@igrp/igrp-framework-react-design-system";
import { IGRPFormHandle } from "@igrp/igrp-framework-react-design-system";
import { useRouter } from 'next/navigation';


export default function PageNovostatuspedidoComponent() {
  const router = useRouter();
  const { igrpToast } = useIGRPToast();
  const formRef = useRef<IGRPFormHandle<any>>(null);
  
  // Função para salvar o formulário
  const handleSave = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  // Função a ser executada após o envio bem-sucedido do formulário
  const afterSubmit = () => {
    // Navegar de volta para a lista após salvar com sucesso
    router.push('/status-pedidos');
  };

  return (
<div className={cn('page', 'space-y-6')}>
  <div className={cn('section', ' space-y-6 space-x-6')}>
    <IGRPPageHeader
      title={`Novo Status de Pedido`}
      description={`Registar novo status de pedido`}
      iconBackButton={`ArrowLeft`}
      showBackButton={true}
      urlBackButton={`/status-pedidos`}
      variant={`h3`}
    >
      <div className="flex items-center gap-2">
        <IGRPButton
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

    <StatusPedidoForm 
      formRef={formRef as React.RefObject<IGRPFormHandle<any>>} 
      afterSubmit={afterSubmit} 
    />
  </div>
</div>
  );
}
