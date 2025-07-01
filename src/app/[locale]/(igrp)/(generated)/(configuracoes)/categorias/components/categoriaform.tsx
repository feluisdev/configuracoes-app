/* eslint-disable react/display-name */
'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { cn, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPFormHandle } from "@igrp/igrp-framework-react-design-system";
import { z } from "@igrp/igrp-framework-react-design-system"
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import { useRouter } from "next/navigation";
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

// Importar o hook useCategorias para operações de categorias
import { useCategorias } from '@/app/[locale]/(myapp)/hooks/use-categorias';
import { CategoriaServico } from '@/app/[locale]/(myapp)/types/categorias';

const Categoriaform = forwardRef(({ id }: { id?: string }, ref) => {


  const form1 = z.object({
    nome: z.string().optional(),
    codigo: z.string().optional(),
    descricao: z.string().optional(),
    ordem: z.number().optional(),
    boolean: z.boolean().optional(),
    cor: z.string().optional()
  })

  type Form1ZodType = typeof form1;

  const initForm1: z.infer<Form1ZodType> = {
    nome: ``,
    codigo: ``,
    descricao: ``,
    ordem: undefined,
    boolean: undefined,
    cor: undefined
  }

  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);
  const [selectbooleanValue, setSelectbooleanValue] = useState<string>(``);
  const [selectbooleanOptions, setSelectbooleanOptions] = useState<IGRPOptionsProps[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Referência para o botão de submit oculto
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Expor o método submitForm para o componente pai
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      // Acionar o botão de submit oculto
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  }));

  // Obter funções e dados do hook useCategorias
  const {
    useCategoriaById,
    createCategoriaMutation,
    updateCategoriaMutation } = useCategorias();

  // Buscar categoria por ID se estiver editando
  const { data: categoriaData } = useCategoriaById(id || '');

  const { igrpToast } = useIGRPToast();
  const router = useRouter();

  useEffect(() => {
    // Configurar opções para o select de status (ativo/inativo)
    setSelectbooleanOptions([
      { label: 'Ativo', value: 'true' },
      { label: 'Inativo', value: 'false' }
    ]);

    // Verificar se está editando (id fornecido) ou criando nova categoria
    setIsEditing(!!id);

    // Se estiver editando e os dados da categoria foram carregados
    if (isEditing && categoriaData) {
      // Preencher o formulário com os dados da categoria
      // Garantir que a cor esteja no formato correto (#rrggbb)
      const corFormatada = categoriaData.cor && categoriaData.cor !== 'string' 
        ? categoriaData.cor 
        : '#000000';
        
      setForm1Data({
        nome: categoriaData.nome || '',
        codigo: categoriaData.codigo || '',
        descricao: categoriaData.descricao || '',
        ordem: categoriaData.ordem,
        boolean: categoriaData.ativo,
        cor: corFormatada
      });

      // Atualizar o valor do select de status
      setSelectbooleanValue(categoriaData.ativo ? 'true' : 'false');
    }
  }, [id, categoriaData, isEditing]);

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (data: any) => {
    try {
      // Preparar os dados para envio à API
      const categoriaData = {
        nome: data.nome,
        codigo: data.codigo, // Usar o código fornecido pelo usuário
        descricao: data.descricao,
        ordem: data.ordem,
        ativo: data.boolean,
        cor: data.cor,
        icone: 'Heart' // Valor fixo por enquanto
      };

      if (isEditing && id) {
        // Atualizar categoria existente
        await updateCategoriaMutation.mutateAsync({
          id,
          data: categoriaData
        });
        igrpToast({
          type: 'success',
          title: 'Categoria atualizada com sucesso!'
        });
      } else {
        // Criar nova categoria
        await createCategoriaMutation.mutateAsync(categoriaData);
        igrpToast({
          type: 'success',
          title: 'Categoria criada com sucesso!'
        });
      }

      // Voltar para a lista de categorias
      router.push('/categorias');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      igrpToast({
        type: 'error',
        title: `Erro ao ${isEditing ? 'atualizar' : 'criar'} categoria. Tente novamente.`
      });
    }
  };

  return (
    <div className={cn('component',)}    >
      <IGRPForm
        schema={form1}
        validationMode={`onBlur`}
        gridClassName={`flex flex-col`}
        formRef={formform1Ref}
        className={cn()}
        onSubmit={handleSubmit}
        defaultValues={form1Data}
      >
        <>
          {/* Botão de submit oculto */}
          <button
            type="submit"
            ref={submitButtonRef}
            style={{ display: 'none' }}
          />
          <div className={cn('grid', 'grid-cols-12', ' gap-4',)}    >
            <div className={cn('col-span-6 flex flex-col gap-6',)}    >
              <IGRPInputText
                name={`nome`}
                label={`Nome`}
                showIcon={false}
                required={true}


                placeholder={`O Nome da Categoria de serviço`}


              >
              </IGRPInputText>
              <IGRPInputText
                name={`codigo`}
                label={`Código`}
                showIcon={false}
                required={true}


                placeholder={`Código único da categoria`}


              >
              </IGRPInputText>
              <IGRPTextarea
                name={`descricao`}

                label={`Descrição`}
                rows={10}
                required={false}


                placeholder={`Introduza uma descrição para a categoria de serviço`}


              >
              </IGRPTextarea></div>
            <div className={cn('col-span-6 flex flex-col gap-6',)}    >
              <div className={cn('grid', 'grid-cols-12', ' gap-4',)}    >
                <div className={cn('col-span-6 flex flex-col gap-6',)}    >
                  <IGRPInputNumber
                    name={`ordem`}
                    label={`Ordem`}

                    max={9999999}
                    step={1}
                    required={false}


                    description={`Organize a sua categoria`}


                  >
                  </IGRPInputNumber>
                  <IGRPSelect
                    name={`boolean`}
                    label={`Ativo?`}
                    placeholder={`Select an option...`}

                    gridSize={`full`}


                    onValueChange={(value) => setSelectbooleanValue(value)}
                    value={selectbooleanValue}
                    options={selectbooleanOptions}
                  >
                  </IGRPSelect></div>
                <div className={cn('col-span-6 flex flex-col gap-6',)}    >
                  <IGRPIcon
                    name={`icone`}
                    iconName={`Heart`}
                    size={24}



                  >
                  </IGRPIcon>
                  <IGRPInputColor
                    name={`cor`}
                    label={`Cor`}

                    defaultValue={`#000000`}
                    showHexValue={true}
                    required={false}




                  >
                  </IGRPInputColor></div></div></div></div>
        </>
      </IGRPForm></div>
  );
});

export default Categoriaform;