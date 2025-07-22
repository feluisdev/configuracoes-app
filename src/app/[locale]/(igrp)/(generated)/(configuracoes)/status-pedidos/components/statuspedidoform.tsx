'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef, useCallback } from 'react';
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
  IGRPSelect,
  IGRPSwitch
} from "@igrp/igrp-framework-react-design-system";
import { useStatusPedidos } from '@/app/[locale]/(myapp)/hooks/use-status-pedido'

export default function Statuspedidoform({ id, onSubmit, afterSubmit, formRef } : { id?: string, onSubmit?: boolean, afterSubmit?: () => void, formRef?: React.RefObject<IGRPFormHandle<any>> }) {

  // Definição do schema de validação do formulário
  const formStatusPedido = z.object({
    nome: z.string().min(1, { message: "Nome é obrigatório" }),
    codigo: z.string().min(1, { message: "Código é obrigatório" }),
    descricao: z.string().optional(),
    cor: z.string().optional(),
    icone: z.string().optional(),
    ordem: z.number().optional(),
    visivelPortal: z.boolean().optional()
})

type FormStatusPedidoZodType = typeof formStatusPedido;

// Valores iniciais do formulário
const initFormStatusPedido: z.infer<FormStatusPedidoZodType> = {
    nome: ``,
    codigo: ``,
    descricao: ``,
    cor: `#007bff`,
    icone: ``,
    ordem: 0,
    visivelPortal: true
}

  // Hooks e estados
  const formformStatusPedidoRef = useRef<IGRPFormHandle<FormStatusPedidoZodType> | null>(null);
  const [formStatusPedidoData, setFormStatusPedidoData] = useState<any>(initFormStatusPedido);
  
  // Hooks de API para status de pedido
  const [selectVisivelPortalOptions, setSelectVisivelPortalOptions] = useState<IGRPOptionsProps[]>([
    {"label":"Sim","value":"true"},
    {"label":"Não","value":"false"}

  ]);
  
  const { igrpToast } = useIGRPToast();
  const { getStatusPedidoById, createStatusPedidoMutation, updateStatusPedidoMutation } = useStatusPedidos();


  // Função para lidar com o envio do formulário
  async function handleSubmit(values: z.infer<any>): Promise<void | undefined> {
    console.log('[STATUS_PEDIDO_FORM][SUBMIT] Valores recebidos do formulário:', values);
    try {
      // Preparar os dados para envio
      const visivelPortalValue = typeof values.visivelPortal === 'object' && values.visivelPortal !== null
        ? (values.visivelPortal as any).value ?? true
        : values.visivelPortal ?? true;

      // Garantir que os dados estejam no formato correto conforme a interface CreateStatusPedidoCommand
      const statusPedidoData = {
        nome: values.nome || '',
        codigo: values.codigo || '',
        descricao: values.descricao || '',
        cor: values.cor || '#007bff',
        icone: values.icone || '',
        ordem: typeof values.ordem === 'number' ? values.ordem : 0,
        visivelPortal: visivelPortalValue === 'true' ? true : visivelPortalValue === 'false' ? false : Boolean(visivelPortalValue)
      };
      
      console.log('[STATUS_PEDIDO_FORM][SUBMIT] Dados preparados para envio:', statusPedidoData);

      if (id) {
        // Modo de edição - atualizar status de pedido existente
        // Adicionar o id ao objeto de dados para atender ao requisito da interface UpdateStatusPedidoCommand
        const updateData = {
          ...statusPedidoData,
          id: parseInt(id, 10) // Converter o id de string para number conforme exigido pela interface
        };
        console.log('[STATUS_PEDIDO_FORM][UPDATE] Dados preparados para atualização:', updateData);
        
        await updateStatusPedidoMutation.mutateAsync({
          id,
          data: updateData
        });
        igrpToast({ type: 'success', title: 'Status de pedido atualizado com sucesso!' });
      } else {
        // Modo de criação - criar novo status de pedido
        await createStatusPedidoMutation.mutateAsync(statusPedidoData);
        igrpToast({ type: 'success', title: 'Status de pedido criado com sucesso!' });
        
        // Limpar o formulário após criação bem-sucedida
        formformStatusPedidoRef.current?.reset(initFormStatusPedido);
      }
      
      // Executar callback após submissão bem-sucedida, se fornecido
      if (afterSubmit) {
        afterSubmit();
      }
    } catch (error) {
      console.error('Erro ao salvar status de pedido:', error);
      igrpToast({ type: 'error', title: `Erro ao ${id ? 'atualizar' : 'criar'} status de pedido. Por favor, tente novamente.` });
    }
  }

  // Carregar dados do status de pedido para edição
  useEffect(() => {
    const loadStatusPedido = async () => {
      if (id) {
        try {
          const statusPedido = await getStatusPedidoById(id);
          console.log('[STATUS_PEDIDO_FORM][LOAD] Status de pedido carregado', statusPedido);
          
          // Mapear os dados do status de pedido para o formulário
          const loadedData = {
            nome: statusPedido.nome,
            codigo: statusPedido.codigo,
            descricao: statusPedido.descricao,
            cor: statusPedido.cor || '#007bff',
            icone: statusPedido.icone,
            ordem: statusPedido.ordem,
            visivelPortal: statusPedido.visivelPortal !== undefined ? statusPedido.visivelPortal : true
          };
          console.log('[STATUS_PEDIDO_FORM][LOAD] Dados mapeados para formulário', loadedData);
          setFormStatusPedidoData(loadedData);
          // Atualiza o formulário já montado
          if (formformStatusPedidoRef.current) {
            formformStatusPedidoRef.current.reset(loadedData as any);
          }
        } catch (error) {
          console.error('Erro ao carregar status de pedido:', error);
          igrpToast({ type: 'error', title: 'Erro ao carregar dados do status de pedido. Por favor, tente novamente.' });
        }
      }
    };

    loadStatusPedido();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Sincronizar o formRef interno com o formRef externo, se fornecido
  useEffect(() => {
    if (formRef && formformStatusPedidoRef.current) {
      // Usando type assertion para garantir compatibilidade de tipos
      (formRef as React.MutableRefObject<IGRPFormHandle<any>>).current = formformStatusPedidoRef.current;
    }
  }, [formRef]);

  return (
    <div className={cn('component')}>
      <IGRPForm
        schema={formStatusPedido}
        validationMode={`onBlur`}
        gridClassName={`flex flex-col`}
        formRef={formformStatusPedidoRef}
        className={cn()}
        onSubmit={handleSubmit}
        defaultValues={formStatusPedidoData}
      >
        <>
          <div className={cn('grid', 'grid-cols-12', ' gap-4')}>
            <div className={cn('col-span-6 flex flex-col gap-6')}>
              <IGRPInputText
                name={`nome`}
                label={`Nome`}
                placeholder={`Nome do Status`}
                required={true}
              >
              </IGRPInputText>
              <IGRPInputText
                name={`codigo`}
                label={`Código`}
                placeholder={`Código do Status`}
                required={true}
              >
              </IGRPInputText>
              <IGRPTextarea
                name={`descricao`}
                label={`Descrição`}
                rows={3}
                required={false}
                placeholder={`Introduza uma descrição para o status`}
              >
              </IGRPTextarea>
            </div>
            <div className={cn('col-span-6 flex flex-col gap-6')}>
              <IGRPInputColor
                name={`cor`}
                label={`Cor`}
                defaultValue={`#007bff`}
                showHexValue={true}
                required={false}
              >
              </IGRPInputColor>
              <IGRPInputText
                name={`icone`}
                label={`Ícone (Font Awesome)`}
                placeholder={`Ex: fa-circle-check`}
                required={false}
              >
              </IGRPInputText>
              <IGRPInputNumber
                name={`ordem`}
                label={`Ordem`}
                min={0}
                max={999}
                step={1}
                required={false}
              >
              </IGRPInputNumber>
              <IGRPSwitch
                name={`visivelPortal`}
                label={`Visível no Portal?`}
                gridSize={`full`}
                required={false}
              >
              </IGRPSwitch>
            </div>
          </div>
        </>
      </IGRPForm>
    </div>
  );
}