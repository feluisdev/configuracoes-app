"use client";

import React, { useState, useEffect, useCallback } from 'react';
import TiposServicosDataTable from './components/TiposServicosDataTable';
import FormularioTipoServico from './components/FormularioTipoServico';
import {
  IGRPButton,
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
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
} from '@igrp/igrp-framework-react-design-system';
import { TipoServico, CreateTiposServicosCommand, UpdateTiposServicosCommand, CategoriaServico } from '@/models/configuracoes.models';
import { getTiposServicos, createTipoServico, updateTipoServico, inativarTipoServico, getTipoServicoById } from '@/services/configuracao.service';
import { getCategoriasServicos as getAllCategoriasServicos } from '@/services/configuracao.service';
import LoadingSpinner from '@/components/shared/LoadingSpinner'; // Manter ou usar um spinner IGRP se disponível


export default function PaginaTiposServicos() {
  const [tiposServicos, setTiposServicos] = useState<TipoServico[]>([]);
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<TipoServico | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Para ações como salvar, editar, excluir
  const [isTableLoading, setIsTableLoading] = useState(false); // Para carregamento da tabela
  const [error, setError] = useState<string | null>(null); // Para erros gerais

  const { igrpToast } = useIGRPToast();

  // Controle de modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemParaToggle, setItemParaToggle] = useState<TipoServico | null>(null);

  const carregarTiposServicos = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsTableLoading(true);
    setError(null);
    try {
      const wrapper = await getTiposServicos(); // Adicionar filtros e paginação conforme necessário
      setTiposServicos(wrapper.content || []);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar tipos de serviços.');
      console.error(err);
    } finally {
      if (showLoadingSpinner) setIsTableLoading(false);
    }
  }, []);

  const carregarCategorias = useCallback(async () => {
    // Não precisa de spinner de tabela aqui, é para o formulário
    // setIsLoading(true); // Poderia ter um loading específico para o select
    try {
      const wrapper = await getAllCategoriasServicos(undefined, undefined, 0, 1000); // Buscar todas as categorias ativas
      setCategorias(wrapper.content?.filter(c => c.estado === 'ATIVO') || []);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar categorias para o formulário.');
      console.error(err);
    }
    // setIsLoading(false);
  }, [igrpToast]); // Adicionar igrpToast se usado internamente para erros de carregamento de categorias


  useEffect(() => {
    carregarTiposServicos();
    carregarCategorias();
  }, [carregarTiposServicos, carregarCategorias]);

  const openFormModal = () => setIsFormModalOpen(true);
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setItemSelecionado(null);
    setError(null);
  }

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setItemParaToggle(null);
  }

  const handleCriar = () => {
    setError(null);
    setItemSelecionado(null);
    openFormModal();
  };

  const handleEditar = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const detalhe = await getTipoServicoById(id);
      setItemSelecionado(detalhe);
      openFormModal();
    } catch (err: any) {
      setError(err.message || "Falha ao carregar dados do tipo de serviço para edição.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSalvar = async (data: CreateTiposServicosCommand | UpdateTiposServicosCommand) => {
    setIsLoading(true);
    setError(null);
    try {
      let successMessage = "";
      if ('tipoServicoId' in data && data.tipoServicoId) {
        await updateTipoServico(data.tipoServicoId, data as UpdateTiposServicosCommand);
        successMessage = "Tipo de Serviço atualizado com sucesso!";
      } else {
        await createTipoServico(data as CreateTiposServicosCommand);
        successMessage = "Tipo de Serviço criado com sucesso!";
      }
      closeFormModal();
      igrpToast({ title: 'Sucesso!', description: successMessage, variant: 'success' });
      await carregarTiposServicos(false);
    } catch (err: any) {
      const errorMsg = err.message || 'Falha ao salvar tipo de serviço.';
      setError(errorMsg);
      igrpToast({ title: 'Erro ao Salvar!', description: errorMsg, variant: 'destructive' });
      console.error(err);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    setError(null);
    const item = tiposServicos.find(ts => ts.tipoServicoId === id);
    if (item) {
      setItemParaToggle(item);
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
        await inativarTipoServico(itemParaToggle.tipoServicoId);
        successMessage = `Tipo de Serviço "${itemParaToggle.nome}" inativado com sucesso!`;
      } else {
        let itemParaAtivar = itemParaToggle;
        if (!itemParaAtivar.descricao || typeof itemParaAtivar.prazoEstimado === 'undefined' /* etc. */) {
             itemParaAtivar = await getTipoServicoById(itemParaToggle.tipoServicoId);
        }
        const updateCmd: UpdateTiposServicosCommand = {
          tipoServicoId: itemParaAtivar.tipoServicoId,
          criartiposservicos: {
            categoriaId: itemParaAtivar.idCategoria || itemParaAtivar.categoria!.categoriaId,
            codigo: itemParaAtivar.codigo,
            nome: itemParaAtivar.nome,
            descricao: itemParaAtivar.descricao,
            prazoEstimado: itemParaAtivar.prazoEstimado,
            valorBase: itemParaAtivar.valorBase,
            requerVistoria: itemParaAtivar.requerVistoria,
            requerAnaliseTec: itemParaAtivar.requerAnaliseTec,
            requerAprovacao: itemParaAtivar.requerAprovacao,
            disponivelPortal: itemParaAtivar.disponivelPortal,
            ativo: true,
          },
        };
        await updateTipoServico(itemParaAtivar.tipoServicoId, updateCmd);
        successMessage = `Tipo de Serviço "${itemParaToggle.nome}" ativado com sucesso!`;
      }
      igrpToast({ title: 'Sucesso!', description: successMessage, variant: 'success' });
      await carregarTiposServicos(false);
    } catch (err: any) {
      const errorMsg = err.message || `Falha ao ${atualmenteAtivo ? 'inativar' : 'ativar'} tipo de serviço.`;
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
        title="Gerenciar Tipos de Serviços"
        description="Crie, edite e gerencie os tipos de serviços."
      >
        <IGRPButton onClick={handleCriar} iconName="SquarePlus" showIcon>
          Novo Tipo de Serviço
        </IGRPButton>
      </IGRPPageHeader>

      {error && !isFormModalOpen && <FeedbackMessage type="error" message={error} className="mb-4" />}


      {isTableLoading && !tiposServicos.length ? (
         <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
      ) : (
        <TiposServicosDataTable
          data={tiposServicos}
          onEdit={handleEditar}
          onToggleStatus={handleToggleStatus}
          isLoading={isTableLoading}
        />
      )}

      <IGRPModalDialog open={isFormModalOpen} onOpenChange={(isOpen) => !isOpen && closeFormModal()}>
        <IGRPModalDialogContent>
          <IGRPModalDialogHeader>
            <IGRPModalDialogTitle>{itemSelecionado ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}</IGRPModalDialogTitle>
          </IGRPModalDialogHeader>
          <FormularioTipoServico
            initialData={itemSelecionado}
            categorias={categorias}
            onSubmit={handleSalvar}
            onCancel={closeFormModal}
            isLoading={isLoading}
          />
        </IGRPModalDialogContent>
      </IGRPModalDialog>

      {itemParaToggle && (
         <IGRPAlertDialog open={isConfirmModalOpen} onOpenChange={(isOpen) => !isOpen && closeConfirmModal()}>
          <IGRPAlertDialogContent>
            <IGRPAlertDialogHeader>
              <IGRPAlertDialogTitle>
                Confirmar {itemParaToggle.estado === 'ATIVO' ? 'Inativação' : 'Ativação'}
              </IGRPAlertDialogTitle>
              <IGRPAlertDialogDescription>
                Tem certeza que deseja {itemParaToggle.estado === 'ATIVO' ? 'inativar' : 'ativar'} o tipo de serviço "{itemParaToggle.nome}"?
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
