"use client"; // Necessário para hooks como useState, useEffect

import React, { useState, useEffect, useCallback } from 'react';
import CategoriasServicosDataTable from './components/CategoriasServicosDataTable';
import FormularioCategoriaServico from './components/FormularioCategoriaServico';
import {
  IGRPButton,
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  IGRPModalDialogFooter,
  IGRPModalDialogClose,
  useIGRPToast,
  IGRPPageHeader,
  IGRPAlertDialog,
  IGRPAlertDialogAction,
  IGRPAlertDialogCancel,
  IGRPAlertDialogContent,
  IGRPAlertDialogDescription,
  IGRPAlertDialogFooter,
  IGRPAlertDialogHeader,
  IGRPAlertDialogTitle,
  IGRPAlertDialogTrigger,
} from '@igrp/igrp-framework-react-design-system';
import { CategoriaServico, CreateCategoriasServicosCommand, UpdateCategoriasServicosCommand } from '@/models/configuracoes.models';
import { getCategoriasServicos, createCategoriaServico, updateCategoriaServico, inativarCategoriaServico, getCategoriaServicoById } from '@/services/configuracao.service';
import { useModal } from '@/hooks/useModal'; // Mantemos para controle simples de visibilidade, IGRPModalDialog controla o seu próprio estado de abertura via props ou trigger
import LoadingSpinner from '@/components/shared/LoadingSpinner'; // Pode ser substituído por um spinner do IGRP-DS se disponível e preferido


export default function PaginaCategoriasServicos() {
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaServico | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para erros gerais ou de formulário se não tratados no local

  const { igrpToast } = useIGRPToast();

  // Para o modal de formulário
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Para o modal de confirmação (AlertDialog)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemParaToggle, setItemParaToggle] = useState<CategoriaServico | null>(null);


  const carregarCategorias = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsTableLoading(true);
    setError(null); // Limpa erro anterior ao tentar carregar
    try {
      const wrapper = await getCategoriasServicos();
      setCategorias(wrapper.content || []);
    } catch (err: any) {
      const errorMsg = err.message || 'Falha ao carregar categorias.';
      setError(errorMsg);
      igrpToast({ title: 'Erro!', description: errorMsg, variant: 'destructive' });
      console.error(err);
    } finally {
      if (showLoadingSpinner) setIsTableLoading(false);
    }
  }, [igrpToast]); // Adicionar igrpToast às dependências se usado dentro do callback

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  const openFormModal = () => setIsFormModalOpen(true);
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setCategoriaSelecionada(null); // Limpa seleção ao fechar
    setError(null); // Limpa erros do formulário ao fechar
  }

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setItemParaToggle(null);
  }


  const handleCriar = () => {
    setError(null);
    setCategoriaSelecionada(null);
    openFormModal();
  };

  const handleEditar = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const categoriaDetalhada = await getCategoriaServicoById(id);
        setCategoriaSelecionada(categoriaDetalhada);
        openFormModal();
    } catch (err: any) {
        setError(err.message || "Falha ao carregar dados da categoria para edição.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSalvar = async (data: CreateCategoriasServicosCommand | UpdateCategoriasServicosCommand) => {
    setIsLoading(true);
    setError(null);
    try {
      let successMessage = "";
      if ('categoriaServicoId' in data && data.categoriaServicoId) {
        await updateCategoriaServico(data.categoriaServicoId, data as UpdateCategoriasServicosCommand);
        successMessage = "Categoria atualizada com sucesso!";
      } else {
        await createCategoriaServico(data as CreateCategoriasServicosCommand);
        successMessage = "Categoria criada com sucesso!";
      }
      closeFormModal();
      igrpToast({ title: 'Sucesso!', description: successMessage, variant: 'success' });
      await carregarCategorias(false);
    } catch (err: any) {
      const errorMsg = err.message || 'Falha ao salvar categoria.';
      setError(errorMsg); // Erro pode ser exibido no formulário ou como toast
      igrpToast({ title: 'Erro ao Salvar!', description: errorMsg, variant: 'destructive' });
      console.error(err);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    setError(null);
    const categoria = categorias.find(cat => cat.categoriaId === id);
    if (categoria) {
      setItemParaToggle(categoria);
      openConfirmModal();
    }
  };

  const confirmarToggleStatus = async () => {
    if (!itemParaToggle) return;

    setIsLoading(true);
    setError(null);
    const atualmenteAtivo = itemParaToggle.estado === 'ATIVO';
    let successMessage = "";

    try {
      if (atualmenteAtivo) {
        await inativarCategoriaServico(itemParaToggle.categoriaId);
        successMessage = `Categoria "${itemParaToggle.nome}" inativada com sucesso!`;
      } else {
        let categoriaParaAtivar = itemParaToggle;
        if (!categoriaParaAtivar.descricao || !categoriaParaAtivar.icone || !categoriaParaAtivar.cor || typeof categoriaParaAtivar.ordem === 'undefined') {
             categoriaParaAtivar = await getCategoriaServicoById(itemParaToggle.categoriaId);
        }
        const updateCmd: UpdateCategoriasServicosCommand = {
          categoriaServicoId: itemParaToggle.categoriaId,
          criarcategoriasservicos: {
            nome: categoriaParaAtivar.nome,
            codigo: categoriaParaAtivar.codigo,
            descricao: categoriaParaAtivar.descricao,
            icone: categoriaParaAtivar.icone,
            cor: categoriaParaAtivar.cor,
            ordem: categoriaParaAtivar.ordem,
            ativo: true,
          },
        };
        await updateCategoriaServico(itemParaToggle.categoriaId, updateCmd);
        successMessage = `Categoria "${itemParaToggle.nome}" ativada com sucesso!`;
      }
      igrpToast({ title: 'Sucesso!', description: successMessage, variant: 'success' });
      await carregarCategorias(false);
    } catch (err: any) {
      const errorMsg = err.message || `Falha ao ${atualmenteAtivo ? 'inativar' : 'ativar'} categoria.`;
      setError(errorMsg);
      igrpToast({ title: 'Erro!', description: errorMsg, variant: 'destructive' });
      console.error(err);
    } finally {
      setIsLoading(false);
      closeConfirmModal();
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <IGRPPageHeader
        title="Gerenciar Categorias de Serviços"
        description="Crie, edite e gerencie as categorias de serviços da aplicação."
      >
        <IGRPButton onClick={handleCriar} iconName="SquarePlus" showIcon>
          Nova Categoria
        </IGRPButton>
      </IGRPPageHeader>

      {/* Exibição de erro geral da página, se houver. Erros de formulário são tratados localmente ou via toast. */}
      {error && !isFormModalOpen && <FeedbackMessage type="error" message={error} className="mb-4" />}


      {isTableLoading && !categorias.length ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <CategoriasServicosDataTable
          data={categorias}
          onEdit={handleEditar}
          onToggleStatus={handleToggleStatus}
          isLoading={isTableLoading}
        />
      )}

      <IGRPModalDialog open={isFormModalOpen} onOpenChange={(isOpen) => !isOpen && closeFormModal()}>
        <IGRPModalDialogContent>
          <IGRPModalDialogHeader>
            <IGRPModalDialogTitle>{categoriaSelecionada ? 'Editar Categoria' : 'Nova Categoria'}</IGRPModalDialogTitle>
          </IGRPModalDialogHeader>
          <FormularioCategoriaServico
            initialData={categoriaSelecionada}
            onSubmit={handleSalvar}
            onCancel={closeFormModal}
            isLoading={isLoading}
          />
          {/* Erros específicos do formulário podem ser exibidos dentro dele ou via toast */}
        </IGRPModalDialogContent>
      </IGRPModalDialog>

      {itemParaToggle && (
        <IGRPAlertDialog open={isConfirmModalOpen} onOpenChange={(isOpen) => !isOpen && closeConfirmModal()}>
        {/* <IGRPAlertDialogTrigger asChild>
          // O Trigger pode ser um botão escondido ou a lógica de abertura ser controlada por `isConfirmModalOpen`
        </IGRPAlertDialogTrigger> */}
        <IGRPAlertDialogContent>
          <IGRPAlertDialogHeader>
            <IGRPAlertDialogTitle>
              Confirmar {itemParaToggle.estado === 'ATIVO' ? 'Inativação' : 'Ativação'}
            </IGRPAlertDialogTitle>
            <IGRPAlertDialogDescription>
              Tem certeza que deseja {itemParaToggle.estado === 'ATIVO' ? 'inativar' : 'ativar'} a categoria "{itemParaToggle.nome}"?
            </IGRPAlertDialogDescription>
          </IGRPAlertDialogHeader>
          <IGRPAlertDialogFooter>
            <IGRPAlertDialogCancel onClick={closeConfirmModal} disabled={isLoading}>Cancelar</IGRPAlertDialogCancel>
            <IGRPAlertDialogAction onClick={confirmarToggleStatus} disabled={isLoading}>
              {isLoading ? 'Confirmando...' : 'Confirmar'}
            </IGRPAlertDialogAction>
          </IGRPAlertDialogFooter>
        </IGRPAlertDialogContent>
      </IGRPAlertDialog>
      )}
    </div>
  );
}
