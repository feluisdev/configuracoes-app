"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoriaServico, CreateCategoriasServicosCommand, UpdateCategoriasServicosCommand } from '@/models/configuracoes.models';
import { CategoriaServicoFormSchema, CategoriaServicoFormValues } from '@/lib/zod-schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; // Supondo Input de ui
import { Label } from '@/components/ui/Label'; // Supondo Label de ui
// import { Checkbox } from '@/components/ui/Checkbox'; // Supondo Checkbox de ui

// Mock Checkbox
const Checkbox: React.FC<any> = ({ checked, onCheckedChange, id, ...props }) => (
  <input type="checkbox" id={id} checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} {...props} />
);


interface FormularioCategoriaServicoProps {
  initialData?: CategoriaServico | null; // CategoriaServico tem 'id' e 'ativo' (boolean)
                                        // CreateCategoriasServicosCommand tem 'nome', 'codigo', 'ativo' (boolean) etc.
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

  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<CategoriaServicoFormValues>({
    resolver: zodResolver(CategoriaServicoFormSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      descricao: '',
      icone: '',
      cor: '#000000', // Default color
      ordem: 0,
      ativo: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('nome', initialData.nome || '');
      setValue('codigo', initialData.codigo || '');
      setValue('descricao', initialData.descricao || '');
      setValue('icone', initialData.icone || '');
      setValue('cor', initialData.cor || '#000000');
      setValue('ordem', initialData.ordem || 0);
      // O campo 'ativo' no DTO de criação/atualização é boolean.
      // 'initialData.ativo' (boolean) vem do CategoriaServicosResponseDTO (GET by ID)
      // 'initialData.estado' (string) vem do ListaCategoriaDTO
      const isActive = typeof initialData.ativo === 'boolean' ? initialData.ativo : initialData.estado === 'ATIVO';
      setValue('ativo', isActive);
    } else {
      reset({ // Valores padrão para novo formulário
        nome: '',
        codigo: '',
        descricao: '',
        icone: '',
        cor: '#000000',
        ordem: 0,
        ativo: true,
      });
    }
  }, [initialData, reset, setValue]);

  const handleFormSubmit = (data: CategoriaServicoFormValues) => {
    const commandPayload: CreateCategoriasServicosCommand = {
      nome: data.nome,
      codigo: data.codigo,
      descricao: data.descricao || undefined, // Enviar undefined se vazio para não enviar string vazia se backend não gostar
      icone: data.icone || undefined,
      cor: data.cor || undefined,
      ordem: data.ordem, // Zod schema já garante que é number
      ativo: data.ativo === undefined ? true : data.ativo, // Default true se não fornecido
    };

    if (isEditMode) {
      const updateCommand: UpdateCategoriasServicosCommand = {
        categoriaServicoId: initialData!.categoriaId, // initialData e categoriaId são garantidos no modo de edição
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
        <Label htmlFor="nome">Nome *</Label>
        <Controller
          name="nome"
          control={control}
          render={({ field }) => <Input id="nome" {...field} placeholder="Ex: Manutenção Preventiva" />}
        />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <Label htmlFor="codigo">Código *</Label>
        <Controller
          name="codigo"
          control={control}
          render={({ field }) => <Input id="codigo" {...field} placeholder="Ex: MAN_PREV_001" />}
        />
        {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo.message}</p>}
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Controller
          name="descricao"
          control={control}
          render={({ field }) => <Input id="descricao" {...field} placeholder="Detalhes sobre a categoria" />}
        />
        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icone">Ícone (classe CSS ou URL)</Label>
          <Controller
            name="icone"
            control={control}
            render={({ field }) => <Input id="icone" {...field} placeholder="Ex: fa fa-wrench" />}
          />
          {errors.icone && <p className="text-red-500 text-xs mt-1">{errors.icone.message}</p>}
        </div>

        <div>
          <Label htmlFor="cor">Cor</Label>
          <Controller
            name="cor"
            control={control}
            render={({ field }) => <Input id="cor" type="color" {...field} className="h-10 p-1" />}
          />
          {errors.cor && <p className="text-red-500 text-xs mt-1">{errors.cor.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="ordem">Ordem de Exibição</Label>
        <Controller
          name="ordem"
          control={control}
          render={({ field }) => <Input id="ordem" type="number" {...field}
            onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value,10))} // Permitir limpar ou setar como null/undefined
            onBlur={e => { // Garantir que o valor seja 0 se inválido ou vazio ao perder foco, se desejado
                if (e.target.value === '' || isNaN(parseInt(e.target.value, 10))) {
                    setValue('ordem', 0);
                }
            }}
            placeholder="0"
            min="0"
            step="1"
            />}
        />
        {errors.ordem && <p className="text-red-500 text-xs mt-1">{errors.ordem.message}</p>}
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Controller
          name="ativo"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="ativo"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="ativo" className="mb-0">Ativo</Label>
        {errors.ativo && <p className="text-red-500 text-xs">{errors.ativo.message}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Categoria')}
        </Button>
      </div>
    </form>
  );
};

export default FormularioCategoriaServico;
