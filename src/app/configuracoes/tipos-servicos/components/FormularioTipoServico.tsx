"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TipoServico, CreateTiposServicosCommand, UpdateTiposServicosCommand, CategoriaServico } from '@/models/configuracoes.models';
import { TipoServicoFormSchema, TipoServicoFormValues } from '@/lib/zod-schemas';
import {
  IGRPButton,
  IGRPInputText,
  IGRPLabel,
  IGRPTextarea,
  IGRPInputNumber,
  IGRPSelect,
  IGRPOptionsProps,
  // IGRPCheckbox // Se existir, usar para os campos booleanos
} from '@igrp/igrp-framework-react-design-system';

// Usaremos IGRPSelect para booleanos por enquanto, como no CategoriaForm
const CheckboxMock: React.FC<any> = ({ checked, onCheckedChange, id, ...props }) => (
  <input type="checkbox" id={id} checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} {...props} />
);

interface FormularioTipoServicoProps {
  initialData?: TipoServico | null;
  categorias: CategoriaServico[];
  onSubmit: (data: CreateTiposServicosCommand | UpdateTiposServicosCommand) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const FormularioTipoServico: React.FC<FormularioTipoServicoProps> = ({
  initialData,
  categorias,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const isEditMode = !!initialData?.tipoServicoId;

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TipoServicoFormValues>({
    resolver: zodResolver(TipoServicoFormSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      categoriaId: '',
      descricao: '',
      prazoEstimado: 0,
      valorBase: 0,
      requerVistoria: false,
      requerAnaliseTec: false,
      requerAprovacao: false,
      disponivelPortal: true,
      ativo: true,
    },
  });

  const booleanAsSelectOptions: IGRPOptionsProps[] = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
  ];

  // Helper para converter booleano para string 'true'/'false' para IGRPSelect
  const boolToSelectVal = (val: boolean | undefined) => val ? 'true' : 'false';
  // Helper para converter valor do IGRPSelect ('true'/'false') para booleano
  const selectValToBool = (val: string) => val === 'true';


  useEffect(() => {
    if (initialData) {
      setValue('nome', initialData.nome || '');
      setValue('codigo', initialData.codigo || '');
      setValue('categoriaId', initialData.idCategoria || initialData.categoria?.categoriaId || '');
      setValue('descricao', initialData.descricao || '');
      setValue('prazoEstimado', initialData.prazoEstimado ?? null);
      setValue('valorBase', initialData.valorBase ?? null);
      setValue('requerVistoria', initialData.requerVistoria || false);
      setValue('requerAnaliseTec', initialData.requerAnaliseTec || false);
      setValue('requerAprovacao', initialData.requerAprovacao || false);
      setValue('disponivelPortal', initialData.disponivelPortal === undefined ? true : initialData.disponivelPortal);
      const isActive = typeof initialData.ativo === 'boolean' ? initialData.ativo : initialData.estado === 'ATIVO';
      setValue('ativo', isActive);
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const handleFormSubmit = (data: TipoServicoFormValues) => {
    const commandPayload: CreateTiposServicosCommand = {
      nome: data.nome,
      codigo: data.codigo,
      categoriaId: data.categoriaId,
      descricao: data.descricao || undefined,
      prazoEstimado: data.prazoEstimado ?? undefined,
      valorBase: data.valorBase ?? undefined,
      requerVistoria: Boolean(data.requerVistoria),
      requerAnaliseTec: Boolean(data.requerAnaliseTec),
      requerAprovacao: Boolean(data.requerAprovacao),
      disponivelPortal: Boolean(data.disponivelPortal),
      ativo: Boolean(data.ativo),
    };

    if (isEditMode) {
      const updateCommand: UpdateTiposServicosCommand = {
        tipoServicoId: initialData!.tipoServicoId,
        criartiposservicos: commandPayload,
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
        <Controller name="nome" control={control} render={({ field }) => <IGRPInputText id="nome" {...field} />} />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <IGRPLabel htmlFor="codigo">Código *</IGRPLabel>
        <Controller name="codigo" control={control} render={({ field }) => <IGRPInputText id="codigo" {...field} />} />
        {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>}
      </div>

      <div>
        <IGRPLabel htmlFor="categoriaId">Categoria *</IGRPLabel>
        <Controller
          name="categoriaId"
          control={control}
          render={({ field }) => (
            <IGRPSelect
              id="categoriaId"
              {...field}
              options={categorias.map(cat => ({ label: cat.nome, value: cat.categoriaId }))}
              placeholder="Selecione uma categoria"
            />
          )}
        />
        {errors.categoriaId && <p className="text-red-500 text-xs mt-1">{errors.categoriaId.message}</p>}
      </div>

      <div>
        <IGRPLabel htmlFor="descricao">Descrição</IGRPLabel>
        <Controller name="descricao" control={control} render={({ field }) => <IGRPTextarea id="descricao" {...field} />} />
        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <IGRPLabel htmlFor="prazoEstimado">Prazo Estimado (dias)</IGRPLabel>
          <Controller
            name="prazoEstimado"
            control={control}
            render={({ field }) => <IGRPInputNumber id="prazoEstimado" {...field} value={field.value ?? 0} onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value,10))} min={0} />}
          />
          {errors.prazoEstimado && <p className="text-red-500 text-xs mt-1">{errors.prazoEstimado.message}</p>}
        </div>
        <div>
          <IGRPLabel htmlFor="valorBase">Valor Base (€)</IGRPLabel>
          <Controller
            name="valorBase"
            control={control}
            render={({ field }) => <IGRPInputNumber id="valorBase" {...field} value={field.value ?? 0} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} step="0.01" min={0}/>}
          />
          {errors.valorBase && <p className="text-red-500 text-xs mt-1">{errors.valorBase.message}</p>}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {/* Substituir CheckboxMock por IGRPSelect para campos booleanos */}
        {(['requerVistoria', 'requerAnaliseTec', 'requerAprovacao', 'disponivelPortal', 'ativo'] as const).map(fieldName => (
          <div key={fieldName}>
            <IGRPLabel htmlFor={fieldName}>
              {fieldName === 'requerVistoria' ? 'Requer Vistoria' :
               fieldName === 'requerAnaliseTec' ? 'Requer Análise Técnica' :
               fieldName === 'requerAprovacao' ? 'Requer Aprovação' :
               fieldName === 'disponivelPortal' ? 'Disponível no Portal' : 'Ativo'}
            </IGRPLabel>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <IGRPSelect
                  id={fieldName}
                  options={booleanAsSelectOptions}
                  value={boolToSelectVal(field.value)}
                  onValueChange={(val) => field.onChange(selectValToBool(val))}
                />
              )}
            />
            {errors[fieldName] && <p className="text-red-500 text-xs mt-1">{errors[fieldName]?.message}</p>}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <IGRPButton type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </IGRPButton>
        <IGRPButton type="submit" disabled={isLoading} iconName={isEditMode ? "Save" : "SquarePlus"} showIcon>
          {isLoading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Tipo de Serviço')}
        </IGRPButton>
      </div>
    </form>
  );
};

export default FormularioTipoServico;
