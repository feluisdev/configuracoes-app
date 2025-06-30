"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoriaServico, CreateCategoriasServicosCommand, UpdateCategoriasServicosCommand } from '@/models/configuracoes.models';
import { CategoriaServicoFormSchema, CategoriaServicoFormValues } from '@/lib/zod-schemas';
import {
  IGRPButton,
  IGRPInputText,
  IGRPLabel,
  IGRPTextarea,
  IGRPInputNumber,
  IGRPInputColor,
  IGRPIcon,
  IGRPSelect, // Usaremos IGRPSelect para o campo 'ativo' por enquanto
  IGRPOptionsProps,
  // IGRPCheckbox // Se existir um IGRPCheckbox dedicado para formulários, usaríamos aqui
} from '@igrp/igrp-framework-react-design-system';

interface FormularioCategoriaServicoProps {
  initialData?: CategoriaServico | null;
  onSubmit: (data: CreateCategoriasServicosCommand | UpdateCategoriasServicosCommand) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const FormularioCategoriaServico: React.FC<FormularioCategoriaServicoProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const isEditMode = !!initialData?.categoriaId;

  const { control, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<CategoriaServicoFormValues>({
    resolver: zodResolver(CategoriaServicoFormSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      descricao: '',
      icone: '',
      cor: '#000000',
      ordem: 0,
      ativo: true, // Default para criação
    },
  });

  const ativoValue = watch('ativo'); // Para controlar o IGRPSelect

  const statusOptions: IGRPOptionsProps[] = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
  ];

  useEffect(() => {
    if (initialData) {
      setValue('nome', initialData.nome || '');
      setValue('codigo', initialData.codigo || '');
      setValue('descricao', initialData.descricao || '');
      setValue('icone', initialData.icone || '');
      setValue('cor', initialData.cor || '#000000');
      setValue('ordem', initialData.ordem || 0);
      const isActive = typeof initialData.ativo === 'boolean' ? initialData.ativo : initialData.estado === 'ATIVO';
      setValue('ativo', isActive);
    } else {
      reset(); // Reseta para defaultValues na criação
    }
  }, [initialData, setValue, reset]);

  const handleFormSubmit = (data: CategoriaServicoFormValues) => {
    const commandPayload: CreateCategoriasServicosCommand = {
      nome: data.nome,
      codigo: data.codigo,
      descricao: data.descricao || undefined,
      icone: data.icone || undefined,
      cor: data.cor || undefined,
      ordem: data.ordem,
      ativo: data.ativo === undefined ? true : Boolean(data.ativo), // Garante boolean
    };

    if (isEditMode) {
      const updateCommand: UpdateCategoriasServicosCommand = {
        categoriaServicoId: initialData!.categoriaId,
        criarcategoriasservicos: commandPayload,
      };
      onSubmit(updateCommand);
    } else {
      onSubmit(commandPayload);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
      <div>
        <IGRPLabel htmlFor="nome">Nome *</IGRPLabel>
        <Controller
          name="nome"
          control={control}
          render={({ field }) => <IGRPInputText id="nome" {...field} placeholder="Ex: Manutenção Preventiva" />}
        />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <IGRPLabel htmlFor="codigo">Código *</IGRPLabel>
        <Controller
          name="codigo"
          control={control}
          render={({ field }) => <IGRPInputText id="codigo" {...field} placeholder="Ex: MAN_PREV_001" />}
        />
        {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>}
      </div>

      <div>
        <IGRPLabel htmlFor="descricao">Descrição</IGRPLabel>
        <Controller
          name="descricao"
          control={control}
          render={({ field }) => <IGRPTextarea id="descricao" {...field} placeholder="Detalhes sobre a categoria" />}
        />
        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <IGRPLabel htmlFor="icone">Ícone (Font Awesome)</IGRPLabel>
          <Controller
            name="icone"
            control={control}
            render={({ field }) => <IGRPInputText id="icone" {...field} placeholder="Ex: fa-wrench" />}
          />
          {errors.icone && <p className="text-red-500 text-xs mt-1">{errors.icone.message}</p>}
        </div>
        {watch("icone") && <IGRPIcon iconName={watch("icone") as any} className="mb-2" size={24} />}
      </div>
       <div>
          <IGRPLabel htmlFor="cor">Cor</IGRPLabel>
          <Controller
            name="cor"
            control={control}
            render={({ field }) => <IGRPInputColor id="cor" {...field} showHexValue />}
          />
          {errors.cor && <p className="text-red-500 text-xs mt-1">{errors.cor.message}</p>}
        </div>


      <div>
        <IGRPLabel htmlFor="ordem">Ordem de Exibição</IGRPLabel>
        <Controller
          name="ordem"
          control={control}
          render={({ field }) => <IGRPInputNumber id="ordem" {...field}
            value={field.value ?? 0} // Ensure value is not null/undefined for IGRPInputNumber
            onChange={e => field.onChange(e.target.value === '' ? 0 : parseInt(e.target.value,10))}
            placeholder="0"
            min={0}
            step={1}
            />}
        />
        {errors.ordem && <p className="text-red-500 text-xs mt-1">{errors.ordem.message}</p>}
      </div>

       <div>
        <IGRPLabel htmlFor="ativo">Ativo</IGRPLabel>
        <Controller
          name="ativo"
          control={control}
          render={({ field }) => (
            <IGRPSelect
              id="ativo"
              options={statusOptions}
              value={field.value ? 'true' : 'false'}
              onValueChange={(val) => field.onChange(val === 'true')}
              placeholder="Selecione o estado"
            />
          )}
        />
         {errors.ativo && <p className="text-red-500 text-xs mt-1">{errors.ativo.message}</p>}
      </div>


      <div className="flex justify-end space-x-3 pt-4">
        <IGRPButton type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </IGRPButton>
        <IGRPButton type="submit" disabled={isLoading} iconName={isEditMode ? "Save" : "SquarePlus"} showIcon>
          {isLoading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Categoria')}
        </IGRPButton>
      </div>
    </form>
  );
};

export default FormularioCategoriaServico;
