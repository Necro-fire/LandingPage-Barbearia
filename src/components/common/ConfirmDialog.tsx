import { useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "./Loading";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  trigger,
  title = "Confirmar ação",
  description = "Esta ação não poderá ser desfeita.",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive,
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={destructive ? "rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" : "rounded-xl"}
            onClick={async (event) => {
              event.preventDefault();
              setLoading(true);
              try {
                await onConfirm();
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? <Spinner className="h-4 w-4" /> : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
