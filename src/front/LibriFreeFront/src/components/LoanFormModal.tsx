import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { BookDto, MemberDto } from '../utils/apiClient';
import { AlertCircle, Book, User, Calendar } from 'lucide-react';

interface LoanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookId: number, memberId: number) => void;
  books: BookDto[];
  members: MemberDto[];
}

export function LoanFormModal({ isOpen, onClose, onSave, books, members }: LoanFormModalProps) {
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedBookId('');
      setSelectedMemberId('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookId && selectedMemberId) {
      onSave(parseInt(selectedBookId), parseInt(selectedMemberId));
    }
  };

  // Filter books with available stock
  const availableBooks = books.filter(book => book.available > 0);
  const selectedBook = books.find(b => b.id.toString() === selectedBookId);
  const selectedMember = members.find(m => m.id.toString() === selectedMemberId);

  // Calculate due date (7 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  const formattedDueDate = dueDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Préstamo</DialogTitle>
          <DialogDescription>
            Selecciona el libro y el miembro para crear un nuevo préstamo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Book Selection */}
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <Book className="w-4 h-4" />
                Libro
              </Label>
              <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                <SelectTrigger className="bg-gray-50 border-gray-300">
                  <SelectValue placeholder="Selecciona un libro..." />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No hay libros disponibles
                    </div>
                  ) : (
                    availableBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{book.title}</span>
                          <Badge className="ml-2 bg-green-100 text-green-700">
                            {book.available} disp.
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedBook && (
                <div className="text-sm text-gray-500 mt-1">
                  <strong>Autor:</strong> {selectedBook.author} |
                  <strong> Categoría:</strong> {selectedBook.category} |
                  <strong> Disponibles:</strong> {selectedBook.available} de {selectedBook.stock}
                </div>
              )}
            </div>

            {/* Member Selection */}
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Miembro
              </Label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger className="bg-gray-50 border-gray-300">
                  <SelectValue placeholder="Selecciona un miembro..." />
                </SelectTrigger>
                <SelectContent>
                  {members.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No hay miembros registrados
                    </div>
                  ) : (
                    members.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.firstName} {member.lastName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedMember && (
                <div className="text-sm text-gray-500 mt-1">
                  <strong>DNI:</strong> {selectedMember.dni} |
                  <strong> Email:</strong> {selectedMember.email}
                </div>
              )}
            </div>

            {/* Due Date Info */}
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha de Vencimiento
              </Label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 font-medium">{formattedDueDate}</p>
                <p className="text-blue-600 text-sm mt-1">
                  El préstamo vence automáticamente en 7 días
                </p>
              </div>
            </div>

            {/* Warning if no stock */}
            {books.length > 0 && availableBooks.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">Sin libros disponibles</p>
                  <p className="text-yellow-600 text-sm">
                    Todos los libros están prestados actualmente.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!selectedBookId || !selectedMemberId}
            >
              Registrar Préstamo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
