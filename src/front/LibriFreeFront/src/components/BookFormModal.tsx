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
import { BookDto, BookInputDto } from '../utils/apiClient'; // Import BookDto and BookInputDto

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: BookInputDto) => void; // onSave expects BookInputDto
  book?: BookDto | null; // book prop uses BookDto
}

export function BookFormModal({ isOpen, onClose, onSave, book }: BookFormModalProps) {
  const [formData, setFormData] = useState<BookInputDto>({ // Initialize with BookInputDto structure
    title: '',
    author: '',
    isbn: '',
    category: '', // Added category
    stock: 0,
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category, // Set category from book
        stock: book.stock,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        stock: 0,
      });
    }
  }, [book, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // onClose() is now handled by the parent after API call
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
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="Ej: 978-0060883287"
                className="bg-gray-50 border-gray-300 font-mono"
                required
              />
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
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {book ? 'Guardar Cambios' : 'Registrar Libro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
