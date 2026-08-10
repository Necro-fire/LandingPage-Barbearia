import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Scissors } from "lucide-react";

interface BarbershopConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function BarbershopConfirmModal({ isOpen, onClose, onConfirm }: BarbershopConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-[400px] rounded-2xl border-border bg-card p-6">
        <AlertDialogHeader className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Scissors className="h-8 w-8" />
          </div>
          <AlertDialogTitle className="font-heading text-xl">Acessar Barbearia</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Você deseja realmente sair do painel administrativo e ir para a página pública da barbearia?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border-border hover:bg-muted"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full sm:w-auto rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Sim, Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
