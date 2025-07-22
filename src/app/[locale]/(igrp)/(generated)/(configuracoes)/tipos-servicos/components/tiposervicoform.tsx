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
	IGRPSelect,
	IGRPTextarea,
	IGRPSwitch,
	IGRPInputNumber 
} from "@igrp/igrp-framework-react-design-system";
import { useTiposServicos } from '@/app/[locale]/(myapp)/hooks/use-tipos-servicos'
import { useCategorias } from '@/app/[locale]/(myapp)/hooks/use-categorias'

export default function Tiposervicoform({ id, onSubmit, afterSubmit, formRef } : { id?: string, onSubmit?: boolean, afterSubmit?: () => void, formRef?: React.RefObject<IGRPFormHandle<any>> }) {
// Corrigido o nome da prop de onSuvmit para onSubmit

  // Definição do schema de validação do formulário
  const formTipoServico = z.object({
    nome: z.string().min(1, { message: "Nome é obrigatório" }),
    codigo: z.string().min(1, { message: "Código é obrigatório" }),
    categoriaId: z.string().min(1, { message: "Categoria é obrigatória" }),
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

// Valores iniciais do formulário
const initFormTipoServico: z.infer<FormTipoServicoZodType> = {
    nome: ``,
    codigo: ``,
    categoriaId: ``,
    descricao: ``,
    prazoEstimado: undefined,
    valorBase: undefined,
    requerVistoria: false,
    requerAnaliseTec: false,
    requerAprovacao: false,
    disponivelPortal: false,
    ativo: true
}

  // Hooks e estados
  const formformTipoServicoRef = useRef<IGRPFormHandle<FormTipoServicoZodType> | null>(null);
  const [formTipoServicoData, setFormTipoServicoData] = useState<any>(initFormTipoServico);
  const [selectCategoriaOptions, setSelectCategoriaOptions] = useState<IGRPOptionsProps[]>([]);
  
  const { igrpToast } = useIGRPToast();
  const { getTipoServicoById, createTipoServicoMutation, updateTipoServicoMutation } = useTiposServicos();
  const { categorias } = useCategorias();

  // Função para lidar com o envio do formulário
  async function handleSubmit(values: z.infer<any>): Promise<void | undefined> {
    try {
      // Preparar os dados para envio
        const categoriaIdValue = typeof values.categoriaId === 'object' && values.categoriaId !== null
          ? (values.categoriaId as any).value ?? ''
          : values.categoriaId ?? '';

        const tipoServicoData = {
        nome: values.nome || '',
        codigo: values.codigo || '',
        categoriaId: categoriaIdValue,
        descricao: values.descricao,
        prazoEstimado: values.prazoEstimado,
        valorBase: values.valorBase,
        requerVistoria: values.requerVistoria,
        requerAnaliseTec: values.requerAnaliseTec,
        requerAprovacao: values.requerAprovacao,
        disponivelPortal: values.disponivelPortal,
        ativo: values.ativo !== undefined ? values.ativo : true
      };

      if (id) {
        // Modo de edição - atualizar tipo de serviço existente
        await updateTipoServicoMutation.mutateAsync({
          id,
          data: tipoServicoData
        });
        igrpToast({ type: 'success', title: 'Tipo de serviço atualizado com sucesso!' });
      } else {
        // Modo de criação - criar novo tipo de serviço
        await createTipoServicoMutation.mutateAsync(tipoServicoData);
        igrpToast({ type: 'success', title: 'Tipo de serviço criado com sucesso!' });
        
        // Limpar o formulário após criação bem-sucedida
        formformTipoServicoRef.current?.reset(initFormTipoServico);
      }
      
      // Formulário submetido com sucesso
    } catch (error) {
      console.error('Erro ao salvar tipo de serviço:', error);
      igrpToast({ type: 'error', title: `Erro ao ${id ? 'atualizar' : 'criar'} tipo de serviço. Por favor, tente novamente.` });
      
      // Se ocorrer um erro, registramos no console e mostramos uma mensagem ao usuário
    }
  }

  // Carregar dados do tipo de serviço para edição
  useEffect(() => {
    const loadTipoServico = async () => {
      if (id) {
        try {
          const tipoServico = await getTipoServicoById(id);
            console.log('[TIPO_SERVICO_FORM][LOAD] Tipo de serviço carregado', tipoServico);
          
          // Mapear os dados do tipo de serviço para o formulário
          const loadedData = {
            // mapeamento dos campos recebidos para o formato do formulário

            nome: tipoServico.nome,
            codigo: tipoServico.codigo,
            categoriaId: tipoServico.categoriaId ?? tipoServico.categoria?.categoriaId ?? tipoServico.idCategoria ?? '',
            descricao: tipoServico.descricao,
            prazoEstimado: tipoServico.prazoEstimado,
            valorBase: tipoServico.valorBase,
            requerVistoria: tipoServico.requerVistoria,
            requerAnaliseTec: tipoServico.requerAnaliseTec,
            requerAprovacao: tipoServico.requerAprovacao,
            disponivelPortal: tipoServico.disponivelPortal,
            ativo: tipoServico.ativo !== undefined ? tipoServico.ativo : tipoServico.estado === 'ATIVO'
          };
          console.log('[TIPO_SERVICO_FORM][LOAD] Dados mapeados para formulário', loadedData);
          console.log('[TIPO_SERVICO_FORM][LOAD] Opções de categorias disponíveis', categorias);
          setFormTipoServicoData(loadedData);
          // Atualiza o formulário já montado para refletir a categoria e outros campos
          if (formformTipoServicoRef.current) {
            formformTipoServicoRef.current.reset(loadedData as any);
          }
        } catch (error) {
          console.error('Erro ao carregar tipo de serviço:', error);
          igrpToast({ type: 'error', title: 'Erro ao carregar dados do tipo de serviço. Por favor, tente novamente.' });
        }
      }
    };

    loadTipoServico();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Carregar opções de categorias para o select
  useEffect(() => {
    if (categorias && Array.isArray(categorias)) {
      const options = categorias
        .filter(categoria => categoria.ativo !== false) // Filtrar apenas categorias ativas
        .map(categoria => ({
          label: categoria.nome,
          value: categoria.categoriaId
        }));
      setSelectCategoriaOptions(options);
    }
  }, [categorias]);

  // Quando as opções de categoria estiverem carregadas, garanta que o valor selecionado seja aplicado
  useEffect(() => {
    if (selectCategoriaOptions.length > 0 && formTipoServicoData.categoriaId) {
      if (formformTipoServicoRef.current) {
        formformTipoServicoRef.current.setValue?.('categoriaId' as any, formTipoServicoData.categoriaId as any);
      }
    }
  }, [selectCategoriaOptions, formTipoServicoData.categoriaId]);

  // Removido o useEffect que lidava com onSubmit e afterSubmit
  // Agora o formulário é submetido diretamente pelo componente pai através do formRef
  
  // Sincronizar o formRef interno com o formRef externo, se fornecido
  useEffect(() => {
    if (formRef && formformTipoServicoRef.current) {
      formRef.current = formformTipoServicoRef.current;
    }
  }, [formRef]);


  return (
<div className={ cn('component',)}    >
	<IGRPForm
  schema={ formTipoServico }
  validationMode={ `onBlur` }
  gridClassName={ `flex flex-col` }
formRef={ formformTipoServicoRef }
  className={ cn() }
  onSubmit={ handleSubmit }
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
</IGRPTextarea>
<IGRPSwitch
  name={ `ativo` }
  label={ `Ativo?` }
gridSize={ `full` }

required={ false }
  

  
>
</IGRPSwitch></div>
<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<div className={ cn('grid','grid-cols-1 ','md:grid-cols-2 ','lg:grid-cols-2 ',' gap-4',)}    >
	<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPInputNumber
  name={ `prazoEstimado` }
  label={ `Prazo Estimado (dias)` }

min={ 0 }
max={ 9999999 }
step={ 1 }
required={ false }


  
  
>
</IGRPInputNumber></div>
<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPInputNumber
  name={ `valorBase` }
  label={ `Valor Base (ECV)` }

max={ 9999999 }
step={ 0.01 }
required={ false }


min={ 0 }
  
  
>
</IGRPInputNumber></div></div>
<div className={ cn('grid','grid-cols-1 ','md:grid-cols-2 ','lg:grid-cols-4 ',' gap-4',)}    >
	<div className={ cn('col-span-1 flex flex-col gap-6 ',)}    >
	<IGRPSwitch
  name={ `requerVistoria` }
  label={ `Requer Vistoria?` }
gridSize={ `full` }

  className={ cn() }
  

  
>
</IGRPSwitch></div>
<div className={ cn('col-span-3 flex flex-col gap-6',)}    >
	<IGRPSwitch
  name={ `requerAnaliseTec` }
  label={ `Requer Analise Tecnica?` }
gridSize={ `full` }

  

  
>
</IGRPSwitch></div>
<div className={ cn('col-span-3 flex flex-col gap-6',)}    >
	<IGRPSwitch
  name={ `requerAprovacao` }
  label={ `Requer Aprovação?` }
gridSize={ `full` }

  

  
>
</IGRPSwitch></div>
<div className={ cn('col-span-3 flex flex-col gap-6',)}    >
	<IGRPSwitch
  name={ `disponivelPortal` }
  label={ `Disponivel no Portal?` }
gridSize={ `full` }

  

  
>
</IGRPSwitch></div></div></div></div>
</>
</IGRPForm></div>
  );
}