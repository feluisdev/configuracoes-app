"use client";

import React, { useState, useEffect, useCallback } from 'react';
import StatusPedidosDataTable from './components/StatusPedidosDataTable';
import FormularioStatusPedido from './components/FormularioStatusPedido';
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
import { StatusPedido, CreateStatusPedidoCommand, UpdateStatusPedidoCommand, PageStatusPedidoResponse } from '@/models/configuracoes.models';
import { getStatusPedidos, createStatusPedido, updateStatusPedido, inativarStatusPedido, getStatusPedidoById } from '@/services/configuracao.service';
import LoadingSpinner from '@/components/shared/LoadingSpinner'; // Manter ou usar spinner IGRP

export default function PaginaStatusPedidos() {
  const [statusPedidos, setStatusPedidos] = useState<StatusPedido[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<StatusPedido | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { igrpToast } = useIGRPToast();

  // Controle de modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemParaToggle, setItemParaToggle] = useState<StatusPedido | null>(null);

  const carregarStatusPedidos = useCallback(async (showLoadingSpinner = true, page = 0) => {
    if (showLoadingSpinner) setIsTableLoading(true);
    setError(null);
    try {
      const response: PageStatusPedidoResponse = await getStatusPedidos(undefined, undefined, undefined, page, 20, "ordem,asc");
      setStatusPedidos(response.content || []);
    } catch (err: any) {
      const errorMsg = err.message || 'Falha ao carregar status de pedidos.';
      setError(errorMsg);
      igrpToast({ title: 'Erro!', description: errorMsg, variant: 'destructive' });
      console.error(err);
    } finally {
      if (showLoadingSpinner) setIsTableLoading(false);
    }
  }, [igrpToast]);

  useEffect(() => {
    carregarStatusPedidos();
  }, [carregarStatusPedidos]);

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

  const handleEditar = async (id: number) => {
    setIsLoading(true);
    setError(null);
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
    try {
      let successMessage = "";
      if ('id' in data && data.id) {
        await updateStatusPedido(data.id, data as UpdateStatusPedidoCommand);
        successMessage = "Status de Pedido atualizado com sucesso!";
      } else {
        await createStatusPedido(data as CreateStatusPedidoCommand);
        successMessage = "Status de Pedido criado com sucesso!";
      }
      closeFormModal();
      igrpToast({ title: 'Sucesso!', description: successMessage, variant: 'success' });
      await carregarStatusPedidos(false);
    } catch (err: any) {
      const errorMsg = err.message || 'Falha ao salvar status de pedido.';
      setError(errorMsg);
      igrpToast({ title: 'Erro ao Salvar!', description: errorMsg, variant: 'destructive' });
      console.error(err);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (id: number) => {
    setError(null);
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
    const atualmenteVisivel = itemParaToggle.visivelPortal;
    let successMessage = "";

    try {
      if (atualmenteVisivel) {
        await inativarStatusPedido(itemParaToggle.id);
        successMessage = `Status "${itemParaToggle.nome}" tornado não visível/inativado.`;
      } else {
        const cmdData: UpdateStatusPedidoCommand = {
            id: itemParaToggle.id,
            codigo: itemParaToggle.codigo, // Preservar outros campos
            nome: itemParaToggle.nome,
            descricao: itemParaToggle.descricao,
            cor: itemParaToggle.cor,
            icone: itemParaToggle.icone,
            ordem: itemParaToggle.ordem,
            visivelPortal: true,
        };
        await updateStatusPedido(itemParaToggle.id, cmdData);
        successMessage = `Status "${itemParaToggle.nome}" tornado visível/ativado.`;
      }
      igrpToast({ title: 'Sucesso!', description: successMessage, variant: 'success' });
      await carregarStatusPedidos(false);
    } catch (err: any) {
      const errorMsg = err.message || `Falha ao alterar visibilidade/status do item.`;
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
        title="Gerenciar Status de Pedidos"
        description="Defina os diferentes status que um pedido pode assumir."
      >
        <IGRPButton onClick={handleCriar} iconName="SquarePlus" showIcon>
          Novo Status de Pedido
        </IGRPButton>
      </IGRPPageHeader>

      {error && !isFormModalOpen && <FeedbackMessage type="error" message={error} className="mb-4" />}


      {isTableLoading && !statusPedidos.length ? (
         <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>
      ) : (
        <StatusPedidosDataTable
          data={statusPedidos}
          onEdit={handleEditar}
          onToggleStatus={handleToggleStatus}
          isLoading={isTableLoading}
        />
      )}

      <IGRPModalDialog open={isFormModalOpen} onOpenChange={(isOpen) => !isOpen && closeFormModal()}>
        <IGRPModalDialogContent>
          <IGRPModalDialogHeader>
            <IGRPModalDialogTitle>{itemSelecionado ? 'Editar Status de Pedido' : 'Novo Status de Pedido'}</IGRPModalDialogTitle>
          </IGRPModalDialogHeader>
          <FormularioStatusPedido
            initialData={itemSelecionado}
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
                Confirmar Alteração de Visibilidade
              </IGRPAlertDialogTitle>
              <IGRPAlertDialogDescription>
                Tem certeza que deseja alterar a visibilidade do status "{itemParaToggle.nome}"? ({itemParaToggle.visivelPortal ? 'Tornar Não Visível' : 'Tornar Visível'})
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
