"use client"; // Necessário para hooks como useState, useEffect

import React, { useState, useEffect, useCallback } from 'react';
import CategoriasServicosDataTable from './components/CategoriasServicosDataTable';
import FormularioCategoriaServico from './components/FormularioCategoriaServico';
import { Button } from '@/components/ui/Button'; // Supondo que Button venha de ui
import { Modal } from '@/components/ui/Modal'; // Supondo que Modal venha de ui
import { CategoriaServico, CreateCategoriasServicosCommand, UpdateCategoriasServicosCommand } from '@/models/configuracoes.models';
import { getCategoriasServicos, createCategoriaServico, updateCategoriaServico, inativarCategoriaServico, getCategoriaServicoById } from '@/services/configuracao.service';
import { useModal } from '@/hooks/useModal';
import FeedbackMessage from '@/components/shared/FeedbackMessage';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmacaoDialog from '@/components/shared/ConfirmacaoDialog';


export default function PaginaCategoriasServicos() {
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaServico | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading geral da página/ações principais
  const [isTableLoading, setIsTableLoading] = useState(false); // Loading específico para a tabela
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null); // Para mensagens de sucesso

  const { isOpen: isFormModalOpen, openModal: openFormModal, closeModal: closeFormModal } = useModal();
  const { isOpen: isConfirmModalOpen, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();

  const [itemParaToggle, setItemParaToggle] = useState<CategoriaServico | null>(null);


  const carregarCategorias = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsTableLoading(true);
    setError(null);
    try {
      // A função getCategoriasServicos já retorna WrapperListaCategoriaServicoDTO
      const wrapper = await getCategoriasServicos();
      // Mapear CategoriaServico[] para incluir 'estado' se não vier do backend assim,
      // ou ajustar a interface CategoriaServico e o DTO ListaCategoriaDTO no backend.
      // No nosso caso, ListaCategoriaDTO já tem 'estado'.
      // CategoriaServicosResponseDTO tem 'ativo' (boolean).
      // A interface CategoriaServico no frontend tenta unificar isso.
      // A service getCategoriaServicoById já faz um mapeamento para 'estado'.
      // Para a lista, o WrapperListaCategoriaServicoDTO usa ListaCategoriaDTO que já tem 'estado'.
      setCategorias(wrapper.content || []);
      // TODO: Implementar lógica de paginação usando os dados do wrapper (totalPages, totalElements, etc.)
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar categorias.');
      console.error(err);
    } finally {
      if (showLoadingSpinner) setIsTableLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  const handleCriar = () => {
    setError(null);
    setFeedback(null);
    setCategoriaSelecionada(null);
    openFormModal();
  };

  const handleEditar = async (id: string) => { // id aqui é categoriaId (string)
    setIsLoading(true);
    setError(null);
    setFeedback(null);
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
    setFeedback(null);
    try {
      if ('categoriaServicoId' in data && data.categoriaServicoId) {
        await updateCategoriaServico(data.categoriaServicoId, data as UpdateCategoriasServicosCommand);
        setFeedback("Categoria atualizada com sucesso!");
      } else {
        await createCategoriaServico(data as CreateCategoriasServicosCommand);
        setFeedback("Categoria criada com sucesso!");
      }
      closeFormModal();
      await carregarCategorias(false); // Recarregar lista sem o spinner de tabela inteira
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar categoria.');
      console.error(err);
      // Manter modal aberto em caso de erro para o usuário corrigir
      return; // Evita fechar o modal e limpar feedback
    } finally {
      setIsLoading(false);
    }
    // Limpar feedback após um tempo se desejar, ou na próxima ação
  };

  const handleToggleStatus = (id: string) => {
    setError(null);
    setFeedback(null);
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
    setFeedback(null);
    const atualmenteAtivo = itemParaToggle.estado === 'ATIVO';

    try {
      if (atualmenteAtivo) {
        // Inativar via DELETE
        await inativarCategoriaServico(itemParaToggle.categoriaId);
        setFeedback(`Categoria "${itemParaToggle.nome}" inativada com sucesso!`);
      } else {
        // Ativar via PUT
        // Precisamos de todos os campos para o CriarCategoriasServicosDTO aninhado
        // Se a lista não tem todos, buscar o item completo.
        // No nosso caso, getCategoriaServicoById já retorna o objeto completo.
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
            ativo: true, // Ativando
          },
        };
        await updateCategoriaServico(itemParaToggle.categoriaId, updateCmd);
        setFeedback(`Categoria "${itemParaToggle.nome}" ativada com sucesso!`);
      }
      await carregarCategorias(false);
    } catch (err: any) {
      setError(err.message || `Falha ao ${atualmenteAtivo ? 'inativar' : 'ativar'} categoria.`);
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
        <h1 className="text-2xl font-bold">Gerenciar Categorias de Serviços</h1>
        <Button onClick={handleCriar}>
          Nova Categoria
        </Button>
      </div>

      {error && <FeedbackMessage type="error" message={error} className="mb-4" />}
      {feedback && <FeedbackMessage type="success" message={feedback} className="mb-4" />}

      {isTableLoading && !categorias.length ? ( // Mostrar spinner grande se carregando pela primeira vez
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <CategoriasServicosDataTable
          data={categorias}
          onEdit={handleEditar}
          onToggleStatus={handleToggleStatus}
          isLoading={isTableLoading} // Spinner menor na tabela para reloads
        />
      )}

      {isFormModalOpen && (
        <Modal isOpen={isFormModalOpen} onClose={() => { closeFormModal(); setError(null); }} title={categoriaSelecionada ? 'Editar Categoria' : 'Nova Categoria'}>
          <FormularioCategoriaServico
            initialData={categoriaSelecionada}
            onSubmit={handleSalvar}
            onCancel={() => { closeFormModal(); setError(null); }}
            isLoading={isLoading}
          />
           {/* Exibir erro do formulário dentro do modal, se houver e não for de submit */}
        </Modal>
      )}

      {isConfirmModalOpen && itemParaToggle && (
        <ConfirmacaoDialog
          isOpen={isConfirmModalOpen}
          onClose={() => { closeConfirmModal(); setItemParaToggle(null);}}
          onConfirm={confirmarToggleStatus}
          title={`Confirmar ${itemParaToggle.estado === 'ATIVO' ? 'Inativação' : 'Ativação'}`}
          message={`Tem certeza que deseja ${itemParaToggle.estado === 'ATIVO' ? 'inativar' : 'ativar'} a categoria "${itemParaToggle.nome}"?`}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
