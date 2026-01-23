import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';
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

  const getStockBadge = (available: number) => { // Use available
    if (available === 0) {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Sin Stock</Badge>;
    } else if (available <= 3) {
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Stock Bajo ({available})</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">En Stock ({available})</Badge>;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Inventario de Libros</h1>
        <p className="text-gray-600">Gestiona tu colección de libros</p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-1">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por título, autor o ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-300"
              />
            </div>

            {/* Category Filter */}
            <div className="w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-gray-50 border-gray-300">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
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
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Libro
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="py-12 text-center text-gray-500">Cargando libros...</div>
      )}
      {error && (
        <div className="py-12 text-center text-red-500">Error: {error}</div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-gray-700">Título</th>
                  <th className="px-6 py-4 text-left text-gray-700">Autor</th>
                  <th className="px-6 py-4 text-left text-gray-700">ISBN</th>
                  <th className="px-6 py-4 text-left text-gray-700">Categoría</th>
                  <th className="px-6 py-4 text-left text-gray-700">Stock Disponible</th>
                  <th className="px-6 py-4 text-right text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-gray-600">{book.author}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{book.isbn}</td>
                    <td className="px-6 py-4 text-gray-600">{book.category}</td>
                    <td className="px-6 py-4">{getStockBadge(book.available)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => onEditBook(book)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => onDeleteBook(book)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
              <div className="py-12 text-center text-gray-500">
                No se encontraron libros que coincidan con tu búsqueda
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && !error && (
        <div className="mt-6 flex items-center justify-between text-gray-600">
          <p>Mostrando {filteredBooks.length} de {books.length} libros</p>
          <p>Total de ejemplares: {books.reduce((sum, book) => sum + book.stock, 0)}</p>
        </div>
      )}
    </div>
  );
}
