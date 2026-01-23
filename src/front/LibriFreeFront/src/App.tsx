import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { BookInventory } from './components/BookInventory';
import { BookFormModal } from './components/BookFormModal';
import { MemberInventory } from './components/MemberInventory';
import { MemberFormModal } from './components/MemberFormModal';
import { MemberProfile } from './components/MemberProfile';
import { LoanInventory } from './components/LoanInventory';
import { LoanFormModal } from './components/LoanFormModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { apiClient, BookDto, BookInputDto, MemberDto, MemberInputDto, LoanDto } from './utils/apiClient';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt_token')); // Check for token on load
  const [activeSection, setActiveSection] = useState('libros');
  
  // Book modal states
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookDto | null>(null);
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [booksError, setBooksError] = useState<string | null>(null);

  // Member modal states
  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
  const [isMemberProfileOpen, setIsMemberProfileOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberDto | null>(null);
  const [profileMember, setProfileMember] = useState<MemberDto | null>(null);
  const [members, setMembers] = useState<MemberDto[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  // Loan modal states
  const [isLoanFormOpen, setIsLoanFormOpen] = useState(false);
  const [loans, setLoans] = useState<LoanDto[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [loansError, setLoansError] = useState<string | null>(null);

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

  const fetchMembers = async () => {
    setLoadingMembers(true);
    setMembersError(null);
    try {
      const fetchedMembers = await apiClient<MemberDto[]>('/Members');
      setMembers(fetchedMembers);
    } catch (error: any) {
      setMembersError(error.message || 'Failed to fetch members.');
      toast.error('Error al cargar miembros', {
        description: error.message || 'Hubo un problema al obtener los miembros.',
      });
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchLoans = async () => {
    setLoadingLoans(true);
    setLoansError(null);
    try {
      const fetchedLoans = await apiClient<LoanDto[]>('/Loans');
      setLoans(fetchedLoans);
    } catch (error: any) {
      setLoansError(error.message || 'Failed to fetch loans.');
      toast.error('Error al cargar préstamos', {
        description: error.message || 'Hubo un problema al obtener los préstamos.',
      });
    } finally {
      setLoadingLoans(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBooks();
      fetchMembers();
      fetchLoans();
    }
  }, [isLoggedIn]); // Fetch data when login status changes

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast.success('Sesión iniciada correctamente', {
      description: 'Bienvenido al sistema de gestión LibriFree',
    });
    // fetchBooks is called by useEffect when isLoggedIn changes
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
    setBooks([]);
    setMembers([]);
    setLoans([]);
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

  // Member handlers
  const handleAddMember = () => {
    setSelectedMember(null);
    setIsMemberFormOpen(true);
  };

  const handleEditMember = (member: MemberDto) => {
    setSelectedMember(member);
    setIsMemberFormOpen(true);
  };

  const handleViewProfile = (member: MemberDto) => {
    setProfileMember(member);
    setIsMemberProfileOpen(true);
  };

  const handleSaveMember = async (memberData: MemberInputDto) => {
    try {
      if (selectedMember) {
        // Edit existing member
        await apiClient(`/Members/${selectedMember.id}`, {
          method: 'PUT',
          body: JSON.stringify(memberData),
        });
        toast.success('Miembro actualizado correctamente', {
          description: `Los cambios en "${memberData.firstName} ${memberData.lastName}" se han guardado`,
        });
      } else {
        // Add new member
        await apiClient('/Members', {
          method: 'POST',
          body: JSON.stringify(memberData),
        });
        toast.success('Miembro registrado correctamente', {
          description: `"${memberData.firstName} ${memberData.lastName}" ha sido agregado al sistema`,
        });
      }
      setIsMemberFormOpen(false);
      setSelectedMember(null);
      fetchMembers(); // Refresh member list after save
    } catch (error: any) {
      toast.error('Error al guardar miembro', {
        description: error.message || 'Hubo un problema al guardar el miembro.',
      });
    }
  };

  // Loan handlers
  const handleAddLoan = () => {
    setIsLoanFormOpen(true);
  };

  const handleSaveLoan = async (bookId: number, memberId: number) => {
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      await apiClient('/Loans', {
        method: 'POST',
        body: JSON.stringify({
          bookId,
          memberId,
          dueDate: dueDate.toISOString(),
        }),
      });
      toast.success('Préstamo registrado correctamente', {
        description: 'El libro ha sido prestado exitosamente',
      });
      setIsLoanFormOpen(false);
      fetchLoans();
      fetchBooks(); // Refresh to update available count
    } catch (error: any) {
      toast.error('Error al registrar préstamo', {
        description: error.message || 'Hubo un problema al registrar el préstamo.',
      });
    }
  };

  const handleReturnLoan = async (loan: LoanDto) => {
    try {
      await apiClient(`/Loans/${loan.id}/return`, {
        method: 'PUT',
      });
      toast.success('Libro devuelto correctamente', {
        description: `"${loan.bookTitle}" ha sido devuelto`,
      });
      fetchLoans();
      fetchBooks(); // Refresh to update available count
    } catch (error: any) {
      toast.error('Error al registrar devolución', {
        description: error.message || 'Hubo un problema al registrar la devolución.',
      });
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
          <MemberInventory
            members={members}
            loading={loadingMembers}
            error={membersError}
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onViewProfile={handleViewProfile}
          />
        );
      case 'prestamos':
        return (
          <LoanInventory
            loans={loans}
            loading={loadingLoans}
            error={loansError}
            onAddLoan={handleAddLoan}
            onReturnLoan={handleReturnLoan}
          />
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

      <MemberFormModal
        isOpen={isMemberFormOpen}
        onClose={() => setIsMemberFormOpen(false)}
        onSave={handleSaveMember}
        member={selectedMember}
      />

      <MemberProfile
        isOpen={isMemberProfileOpen}
        onClose={() => setIsMemberProfileOpen(false)}
        member={profileMember}
      />

      <LoanFormModal
        isOpen={isLoanFormOpen}
        onClose={() => setIsLoanFormOpen(false)}
        onSave={handleSaveLoan}
        books={books}
        members={members}
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
