import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Filter, Library, BookCheck, BookX } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { BookDto } from '../utils/apiClient';

interface BookInventoryProps {
  books: BookDto[];
  loading: boolean;
  error: string | null;
  onAddBook: () => void;
  onEditBook: (book: BookDto) => void;
  onDeleteBook: (book: BookDto) => void;
}

export function BookInventory({
  books,
  loading,
  error,
  onAddBook,
  onEditBook,
  onDeleteBook,
}: BookInventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from books
  const categories = Array.from(new Set(books.map(book => book.category))).sort();

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);

    const matchesCategory =
      selectedCategory === 'all' || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getStockBadge = (available: number) => {
    if (available === 0) {
      return (
        <Badge className="bg-red-50 text-[var(--library-burgundy)] border border-[var(--library-burgundy)]/20 hover:bg-red-50 gap-1">
          <BookX className="w-3 h-3" />
          Sin Stock
        </Badge>
      );
    } else if (available <= 3) {
      return (
        <Badge className="bg-yellow-50 text-[var(--library-gold-dark)] border border-[var(--library-gold)]/30 hover:bg-yellow-50">
          Stock Bajo ({available})
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-[var(--library-forest)] border border-[var(--library-forest)]/20 hover:bg-green-100 gap-1">
          <BookCheck className="w-3 h-3" />
          En Stock ({available})
        </Badge>
      );
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-[var(--library-leather)] rounded-lg p-2.5 shadow-md">
          <Library className="w-6 h-6 text-[var(--library-gold)]" />
        </div>
        <div>
          <h1 className="text-[var(--library-wood)] font-['Playfair_Display'] text-2xl">Catálogo de Libros</h1>
          <p className="text-[var(--library-wood-medium)]">Gestiona la colección de tu biblioteca</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--library-leather)]/10 p-4 mb-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-1">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--library-leather)]/50" />
              <Input
                type="text"
                placeholder="Buscar por título, autor o ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--library-parchment)] border-[var(--library-leather)]/20 focus:border-[var(--library-leather)] focus:ring-library-leather/20"
              />
            </div>

            {/* Category Filter */}
            <div className="w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-[var(--library-parchment)] border-[var(--library-leather)]/20">
                  <Filter className="w-4 h-4 mr-2 text-[var(--library-leather)]/60" />
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Book Button */}
          <Button
            onClick={onAddBook}
            className="bg-[var(--library-forest)] hover:bg-[var(--library-forest-dark)] text-white gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Registrar Libro
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="py-12 text-center text-[var(--library-wood-medium)]">Cargando libros...</div>
      )}
      {error && (
        <div className="py-12 text-center">
          <div className="bg-red-50 border border-[var(--library-burgundy)]/20 rounded-lg p-4 inline-block">
            <p className="text-[var(--library-burgundy)]">Error: {error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-[var(--library-leather)]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--library-parchment)] border-b border-[var(--library-leather)]/10">
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Título</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Autor</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">ISBN</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Categoría</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Stock Disponible</th>
                  <th className="px-6 py-4 text-right text-[var(--library-wood)] font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-library-leather/10">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-[var(--library-parchment)]/50 transition-colors">
                    <td className="px-6 py-4 text-[var(--library-wood)] font-medium">{book.title}</td>
                    <td className="px-6 py-4 text-[var(--library-wood-medium)]">{book.author}</td>
                    <td className="px-6 py-4 text-[var(--library-wood-medium)] font-mono text-sm">{book.isbn}</td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--library-leather)] bg-[var(--library-leather)]/10 px-2 py-1 rounded text-sm">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStockBadge(book.available)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => onEditBook(book)}
                          variant="ghost"
                          size="sm"
                          className="text-[var(--library-gold)] hover:text-[var(--library-gold-dark)] hover:bg-[var(--library-gold)]/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => onDeleteBook(book)}
                          variant="ghost"
                          size="sm"
                          className="text-[var(--library-burgundy)] hover:text-[var(--library-burgundy)] hover:bg-[var(--library-burgundy)]/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBooks.length === 0 && (
              <div className="py-12 text-center text-[var(--library-wood-medium)]">
                No se encontraron libros que coincidan con tu búsqueda
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && !error && (
        <div className="mt-6 flex items-center justify-between text-[var(--library-wood-medium)]">
          <p>Mostrando {filteredBooks.length} de {books.length} libros</p>
          <p className="flex items-center gap-2">
            <Library className="w-4 h-4 text-[var(--library-leather)]" />
            Total de ejemplares: <span className="font-medium text-[var(--library-wood)]">{books.reduce((sum, book) => sum + book.stock, 0)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
