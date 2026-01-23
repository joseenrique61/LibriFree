import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { BookDto } from '../utils/apiClient'; // Import BookDto

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  book?: BookDto | null; // Use BookDto
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, book }: DeleteConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-50 rounded-full p-2 border border-[var(--library-burgundy)]/20">
              <AlertTriangle className="w-5 h-5 text-[var(--library-burgundy)]" />
            </div>
            <AlertDialogTitle className="text-[var(--library-wood)]">Eliminar Libro</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-[var(--library-wood-medium)]">
            ¿Estás seguro de que deseas eliminar el libro{' '}
            <span className="font-medium text-[var(--library-wood)]">"{book?.title}"</span>?
            Esta acción es lógica y puede revertirse más adelante.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="border-[var(--library-leather)]/30 text-[var(--library-wood-medium)] hover:bg-[var(--library-leather)]/5">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-[var(--library-burgundy)] hover:bg-[var(--library-burgundy)]/90 text-white shadow-md"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
