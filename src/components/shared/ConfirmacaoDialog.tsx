"use client";

import React from 'react';
import {
  IGRPAlertDialog,
  IGRPAlertDialogAction,
  IGRPAlertDialogCancel,
  IGRPAlertDialogContent,
  IGRPAlertDialogDescription,
  IGRPAlertDialogFooter,
  IGRPAlertDialogHeader,
  IGRPAlertDialogTitle,
  // IGRPAlertDialogTrigger, // O trigger pode ser externo ao dialog
} from '@igrp/igrp-framework-react-design-system';

interface ConfirmacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

const ConfirmacaoDialog: React.FC<ConfirmacaoDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  return (
    <IGRPAlertDialog open={open} onOpenChange={onOpenChange}>
      {/* Opcionalmente, um IGRPAlertDialogTrigger poderia estar aqui se o botão de abrir fizesse parte deste componente */}
      <IGRPAlertDialogContent>
        <IGRPAlertDialogHeader>
          <IGRPAlertDialogTitle>{title}</IGRPAlertDialogTitle>
          <IGRPAlertDialogDescription>
            {message}
          </IGRPAlertDialogDescription>
        </IGRPAlertDialogHeader>
        <IGRPAlertDialogFooter>
          <IGRPAlertDialogCancel onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </IGRPAlertDialogCancel>
          <IGRPAlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Confirmando...' : 'Confirmar'}
          </IGRPAlertDialogAction>
        </IGRPAlertDialogFooter>
      </IGRPAlertDialogContent>
    </IGRPAlertDialog>
  );
};

export default ConfirmacaoDialog;
