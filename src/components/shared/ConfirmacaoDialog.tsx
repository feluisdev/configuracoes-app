"use client";

import React from 'react';
import { Modal } from '@/components/ui/Modal'; // Supondo que Modal venha de ui
import { Button } from '@/components/ui/Button';

interface ConfirmacaoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

const ConfirmacaoDialog: React.FC<ConfirmacaoDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4">
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Confirmando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmacaoDialog;
