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

// Importar serviços e modelos necessários
import { fetchCategoriaById, createCategoria, updateCategoria } from '../../../../../(myapp)/actions/categorias';
import { CategoriaServico } from '../../../../../(myapp)/types/categorias';
import { useRouter } from 'next/navigation';

// Definir o schema de validação do formulário
const formSchema = z.object({
  inputText1: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  inputTextarea1: z.string().optional(),
  inputHidden1: z.string().optional(),
  inputNumber1: z.number().int().positive().optional(),
  select1: z.string(),
  icone: z.string().optional(),
  inputColor1: z.string().optional()
});

// Tipo para o schema de validação
type FormValues = z.infer<typeof formSchema>;
type anyZodType = typeof formSchema;

export default function Categoriaform({ id } : { id?: string }) {

  const formform1Ref = useRef<IGRPFormHandle<anyZodType> | null>(null);
  const [contentFormform1, setContentFormform1] = useState<FormValues | null>(null);
  const [selectselect1Options, setSelectselect1Options] = useState<IGRPOptionsProps[]>([
    { label: 'Ativo', value: 'true' },
    { label: 'Inativo', value: 'false' }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { igrpToast } = useIGRPToast();
  const router = useRouter();

  // Carregar os dados do servidor e preencher o formulário
  useEffect(() => {
    // Se tiver ID, buscar dados da categoria para edição
    if (id) {
      setLoading(true);
      setError(null);
      
      fetchCategoriaById(id)
        .then((categoria) => {
          // Mapear os dados da categoria para o formato do formulário
          const formData: FormValues = {
            inputText1: categoria.nome,
            inputTextarea1: categoria.descricao || '',
            inputHidden1: id,
            inputNumber1: categoria.ordem || 0,
            select1: categoria.ativo ? 'true' : 'false',
            icone: categoria.icone || 'Heart',
            inputColor1: categoria.cor || '#000000'
          };
          
          // Atualizar o estado do formulário
          setContentFormform1(formData);
        })
        .catch((err) => {
          console.error('Erro ao carregar categoria:', err);
          setError('Não foi possível carregar os dados da categoria. Por favor, tente novamente.');
          igrpToast({
            type: 'error',
            title: 'Erro ao carregar categoria',
            description: err.message
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Formulário em branco para nova categoria
      setContentFormform1({
        inputText1: '',
        inputTextarea1: '',
        inputHidden1: '',
        inputNumber1: 0,
        select1: 'true',
        icone: 'Heart',
        inputColor1: '#000000'
      });
    }
  }, [id, igrpToast]);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mapear os dados do formulário para o formato da API
      const categoriaData = {
        nome: data.inputText1,
        codigo: data.inputText1.toLowerCase().replace(/\s+/g, '-'), // Gerar código a partir do nome
        descricao: data.inputTextarea1,
        icone: data.icone,
        cor: data.inputColor1,
        ordem: data.inputNumber1,
        ativo: data.select1 === 'true'
      };
      
      let result;
      if (id) {
        // Atualizar categoria existente
        result = await updateCategoria(id, categoriaData);
        igrpToast({ type: 'success', title: 'Categoria atualizada com sucesso' });
      } else {
        // Criar nova categoria
        result = await createCategoria(categoriaData);
        igrpToast({ type: 'success', title: 'Categoria criada com sucesso' });
      }
      
      // Redirecionar para a lista de categorias
      router.push('./list');
    } catch (err: any) {
      console.error('Erro ao salvar categoria:', err);
      setError('Não foi possível salvar a categoria. Por favor, tente novamente.');
      igrpToast({ type: 'error', title: 'Erro ao salvar categoria', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
<div className={ cn('component',)}    >
	<IGRPForm
  validationMode={ `onBlur` }
  gridClassName={ `flex flex-col` }
  formRef={ formform1Ref }
  onSubmit={ handleSubmit }
  defaultValues={ contentFormform1 || undefined }
  schema={ formSchema }
>
  <>
  <div className={ cn('grid','grid-cols-12',' gap-4',)}    >
	<div className={ cn('col-span-6 flex flex-col gap-6',)}    >
	<IGRPInputText
  name={ `inputText1` }
  label={ `Nome` }
showIcon={ false }
required={ true }


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

  {/* Botões de ação */}
  <div className="flex justify-end gap-2 mt-6">
    <button 
      type="button" 
      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      onClick={() => router.push('./list')}
    >
      Cancelar
    </button>
    <button 
      type="submit" 
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      disabled={loading}
    >
      {loading ? 'Salvando...' : id ? 'Atualizar' : 'Criar'}
    </button>
  </div>

  {/* Mensagem de erro */}
  {error && (
    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
      {error}
    </div>
  )}
</>
</IGRPForm></div>
  );
}