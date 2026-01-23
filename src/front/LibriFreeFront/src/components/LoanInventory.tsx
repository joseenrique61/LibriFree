import { useState } from 'react';
import { Plus, RotateCcw, AlertTriangle } from 'lucide-react';
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
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Devuelto</Badge>;
    }
    if (isOverdue(dueDate, status)) {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">VENCIDO</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Activo</Badge>;
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
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Gestión de Préstamos</h1>
        <p className="text-gray-600">Administra los préstamos de libros a miembros</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Préstamos</p>
          <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Préstamos Activos</p>
          <p className="text-2xl font-bold text-blue-600">{activeLoansCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Préstamos Vencidos</p>
          <p className="text-2xl font-bold text-red-600">{overdueLoansCount}</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            {/* Status Filter */}
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-50 border-gray-300">
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
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Préstamo
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="py-12 text-center text-gray-500">Cargando préstamos...</div>
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
                  <th className="px-6 py-4 text-left text-gray-700">Libro</th>
                  <th className="px-6 py-4 text-left text-gray-700">Miembro</th>
                  <th className="px-6 py-4 text-left text-gray-700">Fecha Préstamo</th>
                  <th className="px-6 py-4 text-left text-gray-700">Fecha Vencimiento</th>
                  <th className="px-6 py-4 text-left text-gray-700">Estado</th>
                  <th className="px-6 py-4 text-right text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className={`hover:bg-gray-50 transition-colors ${isOverdue(loan.dueDate, loan.status) ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isOverdue(loan.dueDate, loan.status) && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-gray-900">{loan.bookTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{loan.memberName}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(loan.loanDate)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className={isOverdue(loan.dueDate, loan.status) ? 'text-red-600 font-semibold' : ''}>
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
                            className="text-green-600 border-green-300 hover:bg-green-50 gap-1"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Devolver
                          </Button>
                        )}
                        {loan.status === 'Returned' && loan.returnDate && (
                          <span className="text-sm text-gray-500">
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
              <div className="py-12 text-center text-gray-500">
                No se encontraron préstamos con los filtros seleccionados
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && !error && (
        <div className="mt-6 flex items-center justify-between text-gray-600">
          <p>Mostrando {filteredLoans.length} de {loans.length} préstamos</p>
        </div>
      )}
    </div>
  );
}
