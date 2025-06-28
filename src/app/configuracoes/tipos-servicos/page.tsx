"use client";

import React, { useState, useEffect, useCallback } from 'react';
import TiposServicosDataTable from './components/TiposServicosDataTable';
import FormularioTipoServico from './components/FormularioTipoServico';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TipoServico, CreateTiposServicosCommand, UpdateTiposServicosCommand, CategoriaServico } from '@/models/configuracoes.models';
import { getTiposServicos, createTipoServico, updateTipoServico, inativarTipoServico, getTipoServicoById } from '@/services/configuracao.service';
import { getCategoriasServicos as getAllCategoriasServicos } from '@/services/configuracao.service'; // Para popular o select
import { useModal } from '@/hooks/useModal';
import FeedbackMessage from '@/components/shared/FeedbackMessage';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmacaoDialog from '@/components/shared/ConfirmacaoDialog';

export default function PaginaTiposServicos() {
  const [tiposServicos, setTiposServicos] = useState<TipoServico[]>([]);
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<TipoServico | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { isOpen: isFormModalOpen, openModal: openFormModal, closeModal: closeFormModal } = useModal();
  const { isOpen: isConfirmModalOpen, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();
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
  }, []);


  useEffect(() => {
    carregarTiposServicos();
    carregarCategorias();
  }, [carregarTiposServicos, carregarCategorias]);

  const handleCriar = () => {
    setError(null);
    setFeedback(null);
    setItemSelecionado(null);
    openFormModal();
  };

  const handleEditar = async (id: string) => { // id é tipoServicoId (string)
    setIsLoading(true);
    setError(null);
    setFeedback(null);
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
    setFeedback(null);
    try {
      if ('tipoServicoId' in data && data.tipoServicoId) {
        await updateTipoServico(data.tipoServicoId, data as UpdateTiposServicosCommand);
        setFeedback("Tipo de Serviço atualizado com sucesso!");
      } else {
        await createTipoServico(data as CreateTiposServicosCommand);
        setFeedback("Tipo de Serviço criado com sucesso!");
      }
      closeFormModal();
      await carregarTiposServicos(false);
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar tipo de serviço.');
      console.error(err);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    setError(null);
    setFeedback(null);
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
    setFeedback(null);
    const atualmenteAtivo = itemParaToggle.estado === 'ATIVO';
    try {
      if (atualmenteAtivo) {
        await inativarTipoServico(itemParaToggle.tipoServicoId);
        setFeedback(`Tipo de Serviço "${itemParaToggle.nome}" inativado com sucesso!`);
      } else {
        let itemParaAtivar = itemParaToggle;
        // Para ativar, precisamos de todos os campos do DTO de criação.
        // Se não tivermos todos na 'itemParaToggle' (que veio da lista), buscamos o detalhe.
        if (!itemParaAtivar.descricao || typeof itemParaAtivar.prazoEstimado === 'undefined' /* etc. */) {
             itemParaAtivar = await getTipoServicoById(itemParaToggle.tipoServicoId);
        }
        const updateCmd: UpdateTiposServicosCommand = {
          tipoServicoId: itemParaAtivar.tipoServicoId,
          criartiposservicos: {
            categoriaId: itemParaAtivar.idCategoria || itemParaAtivar.categoria!.categoriaId, // Garantir que temos o ID da categoria
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
        setFeedback(`Tipo de Serviço "${itemParaToggle.nome}" ativado com sucesso!`);
      }
      await carregarTiposServicos(false);
    } catch (err: any) {
      setError(err.message || `Falha ao ${atualmenteAtivo ? 'inativar' : 'ativar'} tipo de serviço.`);
      console.error(err);
    } finally {
      setIsLoading(false);
      closeConfirmModal();
      setItemParaToggle(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Tipos de Serviços</h1>
        <Button onClick={handleCriar}>Novo Tipo de Serviço</Button>
      </div>

      {error && <FeedbackMessage type="error" message={error} className="mb-4" />}
      {feedback && <FeedbackMessage type="success" message={feedback} className="mb-4" />}

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

      {isFormModalOpen && (
        <Modal isOpen={isFormModalOpen} onClose={() => { closeFormModal(); setError(null);}} title={itemSelecionado ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}>
          <FormularioTipoServico
            initialData={itemSelecionado}
            categorias={categorias}
            onSubmit={handleSalvar}
            onCancel={() => { closeFormModal(); setError(null);}}
            isLoading={isLoading}
          />
        </Modal>
      )}

      {isConfirmModalOpen && itemParaToggle && (
        <ConfirmacaoDialog
          isOpen={isConfirmModalOpen}
          onClose={() => {closeConfirmModal(); setItemParaToggle(null);}}
          onConfirm={confirmarToggleStatus}
          title={`Confirmar ${itemParaToggle.estado === 'ATIVO' ? 'Inativação' : 'Ativação'}`}
          message={`Tem certeza que deseja ${itemParaToggle.estado === 'ATIVO' ? 'inativar' : 'ativar'} o tipo de serviço "${itemParaToggle.nome}"?`}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
