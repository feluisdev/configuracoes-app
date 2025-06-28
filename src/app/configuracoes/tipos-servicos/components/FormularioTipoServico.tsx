"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TipoServico, CreateTiposServicosCommand, UpdateTiposServicosCommand, CategoriaServico } from '@/models/configuracoes.models';
import { TipoServicoFormSchema, TipoServicoFormValues } from '@/lib/zod-schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox'; // Supondo que Checkbox venha de ui ou seja um placeholder
// Mock Select - substitua por ShadCN Select quando integrado
const SelectMock: React.FC<any & {ref: any}> = React.forwardRef(({ children, ...props }, ref) => <select {...props} ref={ref}>{children}</select>);


interface FormularioTipoServicoProps {
  initialData?: TipoServico | null;
  categorias: CategoriaServico[]; // Para popular o select de categorias
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

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<TipoServicoFormValues>({
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

  useEffect(() => {
    if (initialData) {
      setValue('nome', initialData.nome || '');
      setValue('codigo', initialData.codigo || '');
      // `initialData.categoriaId` é esperado ser o ID string da categoria.
      // `TiposServicosResponseDTO` tem `categoriaId` (String).
      // `ListaTipoServicoDTO` tem `categoria` (String, nome da categoria) e `id` (Integer do tipo de serviço), `tipoServicoId` (String).
      // A service `getTipoServicoById` mapeia `dto.categoriaId` para `idCategoria`.
      setValue('categoriaId', initialData.idCategoria || initialData.categoria?.categoriaId || '');
      setValue('descricao', initialData.descricao || '');
      setValue('prazoEstimado', initialData.prazoEstimado || null); // Permitir nulo
      setValue('valorBase', initialData.valorBase || null); // Permitir nulo
      setValue('requerVistoria', initialData.requerVistoria || false);
      setValue('requerAnaliseTec', initialData.requerAnaliseTec || false);
      setValue('requerAprovacao', initialData.requerAprovacao || false);
      setValue('disponivelPortal', initialData.disponivelPortal === undefined ? true : initialData.disponivelPortal);
      const isActive = typeof initialData.ativo === 'boolean' ? initialData.ativo : initialData.estado === 'ATIVO';
      setValue('ativo', isActive);
    } else {
      reset(); // Reseta para defaultValues
    }
  }, [initialData, setValue, reset]);

  const handleFormSubmit = (data: TipoServicoFormValues) => {
    const commandPayload: CreateTiposServicosCommand = {
      nome: data.nome,
      codigo: data.codigo,
      categoriaId: data.categoriaId, // Este é o ID da categoria selecionada
      descricao: data.descricao || undefined,
      prazoEstimado: data.prazoEstimado ?? undefined, // Envia undefined se null
      valorBase: data.valorBase ?? undefined, // Envia undefined se null
      requerVistoria: data.requerVistoria || false,
      requerAnaliseTec: data.requerAnaliseTec || false,
      requerAprovacao: data.requerAprovacao || false,
      disponivelPortal: data.disponivelPortal === undefined ? true : data.disponivelPortal,
      ativo: data.ativo === undefined ? true : data.ativo,
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
        <Label htmlFor="nome">Nome *</Label>
        <Controller name="nome" control={control} render={({ field }) => <Input id="nome" {...field} />} />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <Label htmlFor="codigo">Código *</Label>
        <Controller name="codigo" control={control} render={({ field }) => <Input id="codigo" {...field} />} />
        {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>}
      </div>

      <div>
        <Label htmlFor="categoriaId">Categoria *</Label>
        <Controller
          name="categoriaId"
          control={control}
          render={({ field }) => (
            <SelectMock id="categoriaId" {...field} className="w-full p-2 border rounded">
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat.categoriaId} value={cat.categoriaId}>{cat.nome}</option>
              ))}
            </SelectMock>
          )}
        />
        {errors.categoriaId && <p className="text-red-500 text-xs mt-1">{errors.categoriaId.message}</p>}
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Controller name="descricao" control={control} render={({ field }) => <Input id="descricao" {...field} />} />
        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prazoEstimado">Prazo Estimado (dias)</Label>
          <Controller
            name="prazoEstimado"
            control={control}
            render={({ field }) => <Input id="prazoEstimado" type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value,10))} min="0" />}
          />
          {errors.prazoEstimado && <p className="text-red-500 text-xs mt-1">{errors.prazoEstimado.message}</p>}
        </div>
        <div>
          <Label htmlFor="valorBase">Valor Base (€)</Label>
          <Controller
            name="valorBase"
            control={control}
            render={({ field }) => <Input id="valorBase" type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} step="0.01" min="0"/>}
          />
          {errors.valorBase && <p className="text-red-500 text-xs mt-1">{errors.valorBase.message}</p>}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center space-x-2">
          <Controller name="requerVistoria" control={control} render={({ field }) => <Checkbox id="requerVistoria" checked={field.value} onCheckedChange={field.onChange} />} />
          <Label htmlFor="requerVistoria" className="mb-0">Requer Vistoria</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller name="requerAnaliseTec" control={control} render={({ field }) => <Checkbox id="requerAnaliseTec" checked={field.value} onCheckedChange={field.onChange} />} />
          <Label htmlFor="requerAnaliseTec" className="mb-0">Requer Análise Técnica</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller name="requerAprovacao" control={control} render={({ field }) => <Checkbox id="requerAprovacao" checked={field.value} onCheckedChange={field.onChange} />} />
          <Label htmlFor="requerAprovacao" className="mb-0">Requer Aprovação</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller name="disponivelPortal" control={control} render={({ field }) => <Checkbox id="disponivelPortal" checked={field.value} onCheckedChange={field.onChange} />} />
          <Label htmlFor="disponivelPortal" className="mb-0">Disponível no Portal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller name="ativo" control={control} render={({ field }) => <Checkbox id="ativo" checked={field.value} onCheckedChange={field.onChange} />} />
          <Label htmlFor="ativo" className="mb-0">Ativo</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Tipo de Serviço')}
        </Button>
      </div>
    </form>
  );
};

export default FormularioTipoServico;
