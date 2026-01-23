import { useState } from 'react';
import { Plus, RotateCcw, AlertTriangle, ScrollText, Clock, BookCheck, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { LoanDto } from '../utils/apiClient';

interface LoanInventoryProps {
  loans: LoanDto[];
  loading: boolean;
  error: string | null;
  onAddLoan: () => void;
  onReturnLoan: (loan: LoanDto) => void;
}

export function LoanInventory({
  loans,
  loading,
  error,
  onAddLoan,
  onReturnLoan,
}: LoanInventoryProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLoans = loans.filter((loan) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return loan.status === 'Active' || loan.status === 'Overdue';
    if (statusFilter === 'returned') return loan.status === 'Returned';
    return true;
  });

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'Returned') return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    if (status === 'Returned') {
      return (
        <Badge className="bg-green-100 text-[var(--library-forest)] border border-[var(--library-forest)]/20 hover:bg-green-100 gap-1">
          <BookCheck className="w-3 h-3" />
          Devuelto
        </Badge>
      );
    }
    if (isOverdue(dueDate, status)) {
      return (
        <Badge className="bg-red-50 text-[var(--library-burgundy)] border border-[var(--library-burgundy)]/20 hover:bg-red-50 gap-1 animate-pulse">
          <Clock className="w-3 h-3" />
          VENCIDO
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-50 text-[var(--library-gold-dark)] border border-[var(--library-gold)]/30 hover:bg-yellow-50 gap-1">
        <BookOpen className="w-3 h-3" />
        Activo
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const activeLoansCount = loans.filter(l => l.status === 'Active' || l.status === 'Overdue').length;
  const overdueLoansCount = loans.filter(l => isOverdue(l.dueDate, l.status)).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-[var(--library-leather)] rounded-lg p-2.5 shadow-md">
          <ScrollText className="w-6 h-6 text-[var(--library-gold)]" />
        </div>
        <div>
          <h1 className="text-[var(--library-wood)] font-['Playfair_Display'] text-2xl">Gestión de Préstamos</h1>
          <p className="text-[var(--library-wood-medium)]">Administra los préstamos de libros a miembros</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
          style={{ border: '1px solid rgba(139,69,19,0.1)', borderLeft: '4px solid #8B4513' }}
        >
          <div>
            <p className="text-sm text-[var(--library-wood-medium)] mb-1">Total Préstamos</p>
            <p className="text-2xl font-bold text-[var(--library-wood)]">{loans.length}</p>
          </div>
          <ScrollText className="w-8 h-8" style={{ color: 'rgba(139,69,19,0.3)' }} />
        </div>
        <div
          className="rounded-lg shadow-sm p-4 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(45,90,61,0.05)', border: '1px solid rgba(45,90,61,0.2)', borderLeft: '4px solid #2D5A3D' }}
        >
          <div>
            <p className="text-sm text-[var(--library-forest)] mb-1">Préstamos Activos</p>
            <p className="text-2xl font-bold text-[var(--library-forest)]">{activeLoansCount}</p>
          </div>
          <BookOpen className="w-8 h-8" style={{ color: 'rgba(45,90,61,0.3)' }} />
        </div>
        <div
          className="rounded-lg shadow-sm p-4 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(114,47,55,0.05)', border: '1px solid rgba(114,47,55,0.2)', borderLeft: '4px solid #722F37' }}
        >
          <div>
            <p className="text-sm text-[var(--library-burgundy)] mb-1">Préstamos Vencidos</p>
            <p className="text-2xl font-bold text-[var(--library-burgundy)]">{overdueLoansCount}</p>
          </div>
          <Clock className="w-8 h-8" style={{ color: 'rgba(114,47,55,0.3)' }} />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--library-leather)]/10 p-4 mb-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            {/* Status Filter */}
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-[var(--library-parchment)] border-[var(--library-leather)]/20">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los préstamos</SelectItem>
                  <SelectItem value="active">Solo activos</SelectItem>
                  <SelectItem value="returned">Solo devueltos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Loan Button */}
          <Button
            onClick={onAddLoan}
            className="bg-[var(--library-forest)] hover:bg-[var(--library-forest-dark)] text-white gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Registrar Préstamo
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="py-12 text-center text-[var(--library-wood-medium)]">Cargando préstamos...</div>
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
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Libro</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Miembro</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Fecha Préstamo</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Fecha Vencimiento</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Estado</th>
                  <th className="px-6 py-4 text-right text-[var(--library-wood)] font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-library-leather/10">
                {filteredLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className={`hover:bg-[var(--library-parchment)]/50 transition-colors ${
                      isOverdue(loan.dueDate, loan.status) ? 'bg-[var(--library-burgundy)]/5 border-l-4 border-[var(--library-burgundy)]' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isOverdue(loan.dueDate, loan.status) && (
                          <AlertTriangle className="w-4 h-4 text-[var(--library-burgundy)]" />
                        )}
                        <span className="text-[var(--library-wood)] font-medium">{loan.bookTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--library-wood-medium)]">{loan.memberName}</td>
                    <td className="px-6 py-4 text-[var(--library-wood-medium)]">{formatDate(loan.loanDate)}</td>
                    <td className="px-6 py-4">
                      <span className={isOverdue(loan.dueDate, loan.status) ? 'text-[var(--library-burgundy)] font-semibold' : 'text-[var(--library-wood-medium)]'}>
                        {formatDate(loan.dueDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(loan.status, loan.dueDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        {loan.status !== 'Returned' && (
                          <Button
                            onClick={() => onReturnLoan(loan)}
                            variant="outline"
                            size="sm"
                            className="text-[var(--library-forest)] border-[var(--library-forest)]/30 hover:bg-[var(--library-forest)]/10 gap-1"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Devolver
                          </Button>
                        )}
                        {loan.status === 'Returned' && loan.returnDate && (
                          <span className="text-sm text-[var(--library-wood-medium)]">
                            Devuelto: {formatDate(loan.returnDate)}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLoans.length === 0 && (
              <div className="py-12 text-center text-[var(--library-wood-medium)]">
                No se encontraron préstamos con los filtros seleccionados
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && !error && (
        <div className="mt-6 flex items-center justify-between text-[var(--library-wood-medium)]">
          <p>Mostrando {filteredLoans.length} de {loans.length} préstamos</p>
        </div>
      )}
    </div>
  );
}
