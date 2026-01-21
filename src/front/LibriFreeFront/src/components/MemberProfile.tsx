import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { MemberDto, LoanDto, apiClient } from '../utils/apiClient';
import { toast } from 'sonner';
import { User, Mail, CreditCard, BookOpen } from 'lucide-react';

interface MemberProfileProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberDto | null;
}

export function MemberProfile({ isOpen, onClose, member }: MemberProfileProps) {
  const [loans, setLoans] = useState<LoanDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLoanHistory = async () => {
      if (!member) return;

      setLoading(true);
      try {
        const fetchedLoans = await apiClient<LoanDto[]>(`/Members/${member.id}/loans`);
        setLoans(fetchedLoans);
      } catch (error: any) {
        toast.error('Error al cargar historial', {
          description: error.message || 'No se pudo cargar el historial de préstamos',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && member) {
      fetchLoanHistory();
    }
  }, [isOpen, member]);

  if (!member) return null;

  const getLoanStatusBadge = (status: string, dueDate: string) => {
    if (status === 'Active') {
      const due = new Date(dueDate);
      const now = new Date();
      const isOverdue = due < now;

      if (isOverdue) {
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">VENCIDO</Badge>;
      }
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Activo</Badge>;
    } else if (status === 'Returned') {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Devuelto</Badge>;
    } else if (status === 'Overdue') {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">VENCIDO</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const activeLoans = loans.filter((l) => l.status === 'Active' || l.status === 'Overdue');
  const completedLoans = loans.filter((l) => l.status === 'Returned');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil de Miembro</DialogTitle>
          <DialogDescription>
            Información personal e historial de préstamos
          </DialogDescription>
        </DialogHeader>

        {/* Member Info */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="text-gray-900 font-medium">
                {member.firstName} {member.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">DNI / Cédula</p>
              <p className="text-gray-900 font-mono">{member.dni}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Correo Electrónico</p>
              <p className="text-gray-900">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Préstamos Activos</p>
              <p className="text-gray-900 font-semibold">{activeLoans.length}</p>
            </div>
          </div>
        </div>

        {/* Loan History */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Préstamos</h3>

          {loading && (
            <div className="text-center py-8 text-gray-500">Cargando historial...</div>
          )}

          {!loading && loans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Este miembro no tiene préstamos registrados
            </div>
          )}

          {!loading && loans.length > 0 && (
            <div className="space-y-3">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{loan.bookTitle}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="text-gray-500">Fecha de préstamo:</span>{' '}
                          {formatDate(loan.loanDate)}
                        </div>
                        <div>
                          <span className="text-gray-500">Fecha de vencimiento:</span>{' '}
                          {formatDate(loan.dueDate)}
                        </div>
                        {loan.returnDate && (
                          <div>
                            <span className="text-gray-500">Fecha de devolución:</span>{' '}
                            {formatDate(loan.returnDate)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {getLoanStatusBadge(loan.status, loan.dueDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {!loading && loans.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Total de préstamos: <span className="font-semibold text-gray-900">{loans.length}</span></p>
                <p className="text-gray-600">Completados: <span className="font-semibold text-gray-900">{completedLoans.length}</span></p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
