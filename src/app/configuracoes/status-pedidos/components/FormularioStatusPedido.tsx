"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusPedido, CreateStatusPedidoCommand, UpdateStatusPedidoCommand } from '@/models/configuracoes.models';
import { StatusPedidoFormSchema, StatusPedidoFormValues } from '@/lib/zod-schemas';
import {
  IGRPButton,
  IGRPInputText,
  IGRPLabel,
  IGRPTextarea,
  IGRPInputNumber,
  IGRPInputColor,
  IGRPIcon,
  IGRPSelect,
  IGRPOptionsProps,
  // IGRPCheckbox // Se existir
} from '@igrp/igrp-framework-react-design-system';

interface FormularioStatusPedidoProps {
  initialData?: StatusPedido | null;
  onSubmit: (data: CreateStatusPedidoCommand | UpdateStatusPedidoCommand) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const FormularioStatusPedido: React.FC<FormularioStatusPedidoProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const isEditMode = !!initialData?.id;

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<StatusPedidoFormValues>({
    resolver: zodResolver(StatusPedidoFormSchema),
    defaultValues: {
      codigo: '',
      nome: '',
      descricao: '',
      cor: '#000000',
      icone: '',
      ordem: 0,
      visivelPortal: true, // Backend DTO Create tem NotNull para este campo
    },
  });

  const booleanAsSelectOptions: IGRPOptionsProps[] = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
  ];
  const boolToSelectVal = (val: boolean | undefined) => val ? 'true' : 'false';
  const selectValToBool = (val: string) => val === 'true';

  useEffect(() => {
    if (initialData) {
      setValue('codigo', initialData.codigo || '');
      setValue('nome', initialData.nome || '');
      setValue('descricao', initialData.descricao || '');
      setValue('cor', initialData.cor || '#000000');
      setValue('icone', initialData.icone || '');
      setValue('ordem', initialData.ordem ?? null); // Permitir null para o IGRPInputNumber se o schema permitir
      setValue('visivelPortal', initialData.visivelPortal === undefined ? true : initialData.visivelPortal);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const handleFormSubmit = (data: StatusPedidoFormValues) => {
    const commandPayload = { // Usado tanto para Create quanto para Update (parcial)
      codigo: data.codigo,
      nome: data.nome,
      descricao: data.descricao || undefined,
      cor: data.cor || undefined,
      icone: data.icone || undefined,
      ordem: data.ordem ?? undefined,
      visivelPortal: Boolean(data.visivelPortal), // Garante boolean
    };

    if (isEditMode && initialData) {
      const updateCommand: UpdateStatusPedidoCommand = {
        id: initialData.id,
        ...commandPayload, // Backend UpdateStatusPedidoCommand aceita campos parciais
      };
      onSubmit(updateCommand);
    } else {
      onSubmit(commandPayload as CreateStatusPedidoCommand); // CreateStatusPedidoCommand tem visivelPortal como obrigatório
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
      <div>
        <IGRPLabel htmlFor="codigo">Código *</IGRPLabel>
        <Controller name="codigo" control={control} render={({ field }) => <IGRPInputText id="codigo" {...field} />} />
        {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>}
      </div>

      <div>
        <IGRPLabel htmlFor="nome">Nome *</IGRPLabel>
        <Controller name="nome" control={control} render={({ field }) => <IGRPInputText id="nome" {...field} />} />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <IGRPLabel htmlFor="descricao">Descrição</IGRPLabel>
        <Controller name="descricao" control={control} render={({ field }) => <IGRPTextarea id="descricao" {...field} />} />
        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
            <IGRPLabel htmlFor="cor">Cor</IGRPLabel>
            <Controller
                name="cor"
                control={control}
                render={({ field }) => <IGRPInputColor id="cor" {...field} showHexValue className="h-10 p-1 w-full" />}
            />
            {errors.cor && <p className="text-red-500 text-xs mt-1">{errors.cor.message}</p>}
        </div>
        <div>
            <IGRPLabel htmlFor="icone">Ícone (Font Awesome)</IGRPLabel>
            <Controller name="icone" control={control} render={({ field }) => <IGRPInputText id="icone" {...field} placeholder="Ex: fa-check-circle" />} />
            {errors.icone && <p className="text-red-500 text-xs mt-1">{errors.icone.message}</p>}
        </div>
         {watch("icone") && <IGRPIcon iconName={watch("icone") as any} className="mb-2" size={24} />}
      </div>

      <div>
        <IGRPLabel htmlFor="ordem">Ordem de Exibição</IGRPLabel>
        <Controller
            name="ordem"
            control={control}
            render={({ field }) => <IGRPInputNumber id="ordem" {...field}
            value={field.value ?? 0}
            onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value,10))}
            min={0}
            step={1}/>}
        />
        {errors.ordem && <p className="text-red-500 text-xs mt-1">{errors.ordem.message}</p>}
      </div>

      <div>
        <IGRPLabel htmlFor="visivelPortal">Visível no Portal *</IGRPLabel>
         <Controller
            name="visivelPortal"
            control={control}
            render={({ field }) => (
              <IGRPSelect
                id="visivelPortal"
                options={booleanAsSelectOptions}
                value={boolToSelectVal(field.value)}
                onValueChange={(val) => field.onChange(selectValToBool(val))}
              />
            )}
          />
        {errors.visivelPortal && <p className="text-red-500 text-xs mt-1">{errors.visivelPortal.message}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <IGRPButton type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </IGRPButton>
        <IGRPButton type="submit" disabled={isLoading} iconName={isEditMode ? "Save" : "SquarePlus"} showIcon>
          {isLoading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Status')}
        </IGRPButton>
      </div>
    </form>
  );
};

export default FormularioStatusPedido;
