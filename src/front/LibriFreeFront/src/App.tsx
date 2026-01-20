import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { BookInventory } from './components/BookInventory'; // Book interface will be imported from apiClient
import { BookFormModal } from './components/BookFormModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { apiClient, BookDto, BookInputDto } from './utils/apiClient'; // Import apiClient and BookDto

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token')); // Check for token on load
  const [activeSection, setActiveSection] = useState('libros');
  
  // Modal states
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookDto | null>(null); // Use BookDto
  const [books, setBooks] = useState<BookDto[]>([]); // Initialize as empty array
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [booksError, setBooksError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoadingBooks(true);
    setBooksError(null);
    try {
      const fetchedBooks = await apiClient<BookDto[]>('/Books');
      setBooks(fetchedBooks);
    } catch (error: any) {
      setBooksError(error.message || 'Failed to fetch books.');
      toast.error('Error al cargar libros', {
        description: error.message || 'Hubo un problema al obtener los libros.',
      });
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBooks();
    }
  }, [isLoggedIn]); // Fetch books when login status changes

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast.success('Sesión iniciada correctamente', {
      description: 'Bienvenido al sistema de gestión LibriFree',
    });
    // fetchBooks is called by useEffect when isLoggedIn changes
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token'); // Clear token on logout
    setIsLoggedIn(false);
    setBooks([]); // Clear books on logout
    toast.info('Sesión cerrada', {
      description: 'Has cerrado sesión correctamente',
    });
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsBookFormOpen(true);
  };

  const handleEditBook = (book: BookDto) => { // Use BookDto
    setSelectedBook(book);
    setIsBookFormOpen(true);
  };

  const handleDeleteBook = (book: BookDto) => { // Use BookDto
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBook = async (bookData: BookInputDto) => { // Use BookInputDto
    try {
      if (selectedBook) {
        // Edit existing book
        await apiClient(`/Books/${selectedBook.id}`, {
          method: 'PUT',
          body: JSON.stringify(bookData),
        });
        toast.success('Libro actualizado correctamente', {
          description: `Los cambios en "${bookData.title}" se han guardado`,
        });
      } else {
        // Add new book
        await apiClient('/Books', {
          method: 'POST',
          body: JSON.stringify(bookData),
        });
        toast.success('Libro guardado correctamente', {
          description: `"${bookData.title}" ha sido agregado al inventario`,
        });
      }
      setIsBookFormOpen(false);
      setSelectedBook(null);
      fetchBooks(); // Refresh book list after save
    } catch (error: any) {
      toast.error('Error al guardar libro', {
        description: error.message || 'Hubo un problema al guardar el libro.',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBook) {
      try {
        await apiClient(`/Books/${selectedBook.id}`, {
          method: 'DELETE',
        });
        toast.success('Libro eliminado correctamente', {
          description: `"${selectedBook?.title}" ha sido eliminado del inventario`,
        });
        setIsDeleteModalOpen(false);
        setSelectedBook(null);
        fetchBooks(); // Refresh book list after delete
      } catch (error: any) {
        toast.error('Error al eliminar libro', {
          description: error.message || 'Hubo un problema al eliminar el libro.',
        });
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'libros':
        return (
          <BookInventory
            books={books}
            loading={loadingBooks}
            error={booksError}
            onAddBook={handleAddBook}
            onEditBook={handleEditBook}
            onDeleteBook={handleDeleteBook}
          />
        );
      case 'miembros':
        return (
          <div className="p-8">
            <h1 className="text-gray-900 mb-4">Gestión de Miembros</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Esta sección está en desarrollo</p>
            </div>
          </div>
        );
      case 'prestamos':
        return (
          <div className="p-8">
            <h1 className="text-gray-900 mb-4">Gestión de Préstamos</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Esta sección está en desarrollo</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      >
        {renderContent()}
      </DashboardLayout>

      <BookFormModal
        isOpen={isBookFormOpen}
        onClose={() => setIsBookFormOpen(false)}
        onSave={handleSaveBook}
        book={selectedBook}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        book={selectedBook}
      />

      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
