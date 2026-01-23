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
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BookDto, BookInputDto } from '../utils/apiClient';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: BookInputDto) => void;
  book?: BookDto | null;
}

const validateIsbn = (isbn: string): string => {
  if (!isbn) {
    return ''; // Let 'required' attribute handle empty input
  }

  const cleanedIsbn = isbn.replace(/[-\s]/g, '');

  if (!/^\d+$/.test(cleanedIsbn)) {
    return 'El ISBN solo debe contener números.';
  }

  if (cleanedIsbn.length !== 13) {
    return 'El ISBN debe tener 13 dígitos.';
  }

  const digits = cleanedIsbn.split('').map(Number);
  const checkDigit = digits.pop();

  if (typeof checkDigit === 'undefined') {
    return 'ISBN inválido.'; // Should not be reached
  }

  const sum = digits.reduce((acc, digit, i) => acc + digit * (i % 2 === 0 ? 1 : 3), 0);
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  if (checkDigit !== calculatedCheckDigit) {
    return 'El dígito de verificación del ISBN es inválido.';
  }

  return ''; // ISBN is valid
};

export function BookFormModal({ isOpen, onClose, onSave, book }: BookFormModalProps) {
  const [formData, setFormData] = useState<BookInputDto>({
    title: '',
    author: '',
    isbn: '',
    category: '',
    stock: 0,
  });
  const [isbnError, setIsbnError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (book) {
        setFormData({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category: book.category,
          stock: book.stock,
        });
        setIsbnError(validateIsbn(book.isbn)); // Validate existing ISBN
      } else {
        setFormData({
          title: '',
          author: '',
          isbn: '',
          category: '',
          stock: 0,
        });
        setIsbnError(''); // Reset for new entry
      }
    }
  }, [book, isOpen]);

  const handleIsbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsbn = e.target.value;
    setFormData({ ...formData, isbn: newIsbn });
    setIsbnError(validateIsbn(newIsbn));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentIsbnError = validateIsbn(formData.isbn);
    if (currentIsbnError) {
      setIsbnError(currentIsbnError);
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{book ? 'Editar Libro' : 'Registrar Nuevo Libro'}</DialogTitle>
          <DialogDescription>
            {book
              ? 'Actualiza la información del libro en tu inventario.'
              : 'Completa los datos para agregar un nuevo libro al inventario.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Título del Libro
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Cien años de soledad"
                className="bg-gray-50 border-gray-300"
                required
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author" className="text-gray-700">
                Autor
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Ej: Gabriel García Márquez"
                className="bg-gray-50 border-gray-300"
                required
              />
            </div>

            {/* ISBN */}
            <div className="space-y-2">
              <Label htmlFor="isbn" className="text-gray-700">
                ISBN
              </Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={handleIsbnChange}
                placeholder="Ej: 9780060883287"
                className={`bg-gray-50 border-gray-300 font-mono ${
                  isbnError ? 'border-red-500' : ''
                }`}
                maxLength="13"
                required
              />
              {isbnError && <p className="text-sm text-red-500 mt-1">{isbnError}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700">
                Categoría
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ej: Novela, Ciencia Ficción, Historia"
                className="bg-gray-50 border-gray-300"
                required
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-gray-700">
                Cantidad en Stock
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                }
                className="bg-gray-50 border-gray-300"
                required
              />
            </div>
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
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              disabled={!!isbnError && formData.isbn.length > 0}
            >
              {book ? 'Guardar Cambios' : 'Registrar Libro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
