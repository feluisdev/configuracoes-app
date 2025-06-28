"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusPedido, CreateStatusPedidoCommand, UpdateStatusPedidoCommand } from '@/models/configuracoes.models';
import { StatusPedidoFormSchema, StatusPedidoFormValues } from '@/lib/zod-schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox'; // Supondo que Checkbox venha de ui ou seja um placeholder

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

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<StatusPedidoFormValues>({
    resolver: zodResolver(StatusPedidoFormSchema),
    defaultValues: {
      codigo: '',
      nome: '',
      descricao: '',
      cor: '#000000',
      icone: '',
      ordem: 0,
      visivelPortal: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('codigo', initialData.codigo || '');
      setValue('nome', initialData.nome || '');
      setValue('descricao', initialData.descricao || '');
      setValue('cor', initialData.cor || '#000000');
      setValue('icone', initialData.icone || '');
      setValue('ordem', initialData.ordem || 0);
      setValue('visivelPortal', initialData.visivelPortal === undefined ? true : initialData.visivelPortal);
    } else {
      reset(); // Reseta para defaultValues
    }
  }, [initialData, setValue, reset]);

  const handleFormSubmit = (data: StatusPedidoFormValues) => {
    if (isEditMode && initialData) {
      const command: UpdateStatusPedidoCommand = {
        id: initialData.id, // ID é number
        codigo: data.codigo,
        nome: data.nome,
        descricao: data.descricao || undefined,
        cor: data.cor || undefined,
        icone: data.icone || undefined,
        ordem: data.ordem ?? undefined, // Envia undefined se null, pois no DTO é Integer
        visivelPortal: data.visivelPortal, // Zod schema tem default, então sempre terá valor
      };
      onSubmit(command);
    } else {
      const command: CreateStatusPedidoCommand = {
        codigo: data.codigo,
        nome: data.nome,
        descricao: data.descricao || undefined,
        cor: data.cor || undefined,
        icone: data.icone || undefined,
        ordem: data.ordem ?? undefined,
        visivelPortal: data.visivelPortal,
      };
      onSubmit(command);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
      <div>
        <Label htmlFor="codigo">Código *</Label>
        <Controller name="codigo" control={control} render={({ field }) => <Input id="codigo" {...field} />} />
        {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>}
      </div>

      <div>
        <Label htmlFor="nome">Nome *</Label>
        <Controller name="nome" control={control} render={({ field }) => <Input id="nome" {...field} />} />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Controller name="descricao" control={control} render={({ field }) => <Input id="descricao" {...field} />} />
        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="cor">Cor</Label>
            <Controller
                name="cor"
                control={control}
                render={({ field }) => <Input id="cor" type="color" {...field} className="h-10 p-1 w-full" />}
            />
            {errors.cor && <p className="text-red-500 text-xs mt-1">{errors.cor.message}</p>}
        </div>
        <div>
            <Label htmlFor="icone">Ícone (classe CSS)</Label>
            <Controller name="icone" control={control} render={({ field }) => <Input id="icone" {...field} />} />
            {errors.icone && <p className="text-red-500 text-xs mt-1">{errors.icone.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="ordem">Ordem de Exibição</Label>
        <Controller
            name="ordem"
            control={control}
            render={({ field }) => <Input id="ordem" type="number" {...field}
            onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value,10))}
            min="0"
            step="1"/>}
        />
        {errors.ordem && <p className="text-red-500 text-xs mt-1">{errors.ordem.message}</p>}
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Controller
            name="visivelPortal"
            control={control}
            render={({ field }) => <Checkbox id="visivelPortal" checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Label htmlFor="visivelPortal" className="mb-0">Visível no Portal</Label>
        {errors.visivelPortal && <p className="text-red-500 text-xs mt-1">{errors.visivelPortal.message}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Status')}
        </Button>
      </div>
    </form>
  );
};

export default FormularioStatusPedido;
