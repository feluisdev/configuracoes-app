"use client";

import React, { useState, useEffect, useCallback } from 'react';
import StatusPedidosDataTable from './components/StatusPedidosDataTable';
import FormularioStatusPedido from './components/FormularioStatusPedido';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StatusPedido, CreateStatusPedidoCommand, UpdateStatusPedidoCommand, PageStatusPedidoResponse } from '@/models/configuracoes.models';
import { getStatusPedidos, createStatusPedido, updateStatusPedido, inativarStatusPedido, getStatusPedidoById } from '@/services/configuracao.service';
import { useModal } from '@/hooks/useModal';
import FeedbackMessage from '@/components/shared/FeedbackMessage';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmacaoDialog from '@/components/shared/ConfirmacaoDialog';

export default function PaginaStatusPedidos() {
  const [statusPedidos, setStatusPedidos] = useState<StatusPedido[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<StatusPedido | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // TODO: Adicionar estados para paginação (currentPage, totalPages, etc.)
  // const [currentPage, setCurrentPage] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);

  const { isOpen: isFormModalOpen, openModal: openFormModal, closeModal: closeFormModal } = useModal();
  const { isOpen: isConfirmModalOpen, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();
  const [itemParaToggle, setItemParaToggle] = useState<StatusPedido | null>(null);

  const carregarStatusPedidos = useCallback(async (showLoadingSpinner = true, page = 0) => {
    if (showLoadingSpinner) setIsTableLoading(true);
    setError(null);
    try {
      // TODO: Passar parâmetros de paginação e filtros
      const response: PageStatusPedidoResponse = await getStatusPedidos(undefined, undefined, undefined, page, 20, "ordem,asc");
      setStatusPedidos(response.content || []);
      // setTotalPages(response.totalPages);
      // setCurrentPage(response.number);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar status de pedidos.');
      console.error(err);
    } finally {
      if (showLoadingSpinner) setIsTableLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarStatusPedidos();
  }, [carregarStatusPedidos]);

  const handleCriar = () => {
    setError(null);
    setFeedback(null);
    setItemSelecionado(null);
    openFormModal();
  };

  const handleEditar = async (id: number) => { // ID é number para StatusPedido
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const detalhe = await getStatusPedidoById(id);
      setItemSelecionado(detalhe);
      openFormModal();
    } catch (err: any) {
      setError(err.message || "Falha ao carregar dados do status para edição.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSalvar = async (data: CreateStatusPedidoCommand | UpdateStatusPedidoCommand) => {
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    try {
      if ('id' in data && data.id) { // Update
        await updateStatusPedido(data.id, data as UpdateStatusPedidoCommand);
        setFeedback("Status de Pedido atualizado com sucesso!");
      } else { // Create
        await createStatusPedido(data as CreateStatusPedidoCommand);
        setFeedback("Status de Pedido criado com sucesso!");
      }
      closeFormModal();
      await carregarStatusPedidos(false);
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar status de pedido.');
      console.error(err);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (id: number) => {
    setError(null);
    setFeedback(null);
    const item = statusPedidos.find(sp => sp.id === id);
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
    const atualmenteVisivel = itemParaToggle.visivelPortal; // ou itemParaToggle.estado === 'ATIVO'

    try {
      if (atualmenteVisivel) {
        // Inativar (ou tornar não visível no portal)
        // O backend tem um endpoint DELETE para inativar, que provavelmente altera 'visivelPortal' para false ou um status similar.
        await inativarStatusPedido(itemParaToggle.id);
        setFeedback(`Status "${itemParaToggle.nome}" tornado não visível/inativado.`);
      } else {
        // Ativar (ou tornar visível no portal) via PUT
        const cmdData: UpdateStatusPedidoCommand = {
            id: itemParaToggle.id,
            codigo: itemParaToggle.codigo,
            nome: itemParaToggle.nome,
            descricao: itemParaToggle.descricao,
            cor: itemParaToggle.cor,
            icone: itemParaToggle.icone,
            ordem: itemParaToggle.ordem,
            visivelPortal: true, // Ativando
        };
        await updateStatusPedido(itemParaToggle.id, cmdData);
        setFeedback(`Status "${itemParaToggle.nome}" tornado visível/ativado.`);
      }
      await carregarStatusPedidos(false);
    } catch (err: any) {
      setError(err.message || `Falha ao alterar visibilidade/status do item.`);
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
        <h1 className="text-2xl font-bold">Gerenciar Status de Pedidos</h1>
        <Button onClick={handleCriar}>Novo Status de Pedido</Button>
      </div>

      {error && <FeedbackMessage type="error" message={error} className="mb-4" />}
      {feedback && <FeedbackMessage type="success" message={feedback} className="mb-4" />}

      {isTableLoading && !statusPedidos.length ? (
         <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
      ) : (
        <StatusPedidosDataTable
          data={statusPedidos}
          onEdit={handleEditar}
          onToggleStatus={handleToggleStatus} // Este botão pode ser "Visível/Não Visível" ou "Ativar/Inativar"
          isLoading={isTableLoading}
        />
      )}

      {isFormModalOpen && (
        <Modal isOpen={isFormModalOpen} onClose={() => { closeFormModal(); setError(null);}} title={itemSelecionado ? 'Editar Status' : 'Novo Status'}>
          <FormularioStatusPedido
            initialData={itemSelecionado}
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
          title={`Confirmar Alteração de Visibilidade`}
          message={`Tem certeza que deseja alterar a visibilidade do status "${itemParaToggle.nome}"? (${itemParaToggle.visivelPortal ? 'Tornar Não Visível' : 'Tornar Visível'})`}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
