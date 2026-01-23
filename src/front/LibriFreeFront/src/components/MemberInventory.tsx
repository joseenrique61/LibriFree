import { Plus, Edit2, Eye, Users, UserCheck, UserX } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MemberDto } from '../utils/apiClient';

interface MemberInventoryProps {
  members: MemberDto[];
  loading: boolean;
  error: string | null;
  onAddMember: () => void;
  onEditMember: (member: MemberDto) => void;
  onViewProfile: (member: MemberDto) => void;
}

export function MemberInventory({
  members,
  loading,
  error,
  onAddMember,
  onEditMember,
  onViewProfile,
}: MemberInventoryProps) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-[var(--library-leather)] rounded-lg p-2.5 shadow-md">
          <Users className="w-6 h-6 text-[var(--library-gold)]" />
        </div>
        <div>
          <h1 className="text-[var(--library-wood)] font-['Playfair_Display'] text-2xl">Gestión de Socios</h1>
          <p className="text-[var(--library-wood-medium)]">Administra los miembros de la biblioteca</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--library-leather)]/10 p-4 mb-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--library-leather)]" />
            <p className="text-[var(--library-wood-medium)]">Total de socios: <span className="font-semibold text-[var(--library-wood)]">{members.length}</span></p>
          </div>

          {/* Add Member Button */}
          <Button
            onClick={onAddMember}
            className="bg-[var(--library-forest)] hover:bg-[var(--library-forest-dark)] text-white gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Registrar Socio
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="py-12 text-center text-[var(--library-wood-medium)]">Cargando miembros...</div>
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
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Nombre Completo</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">DNI</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Correo Electrónico</th>
                  <th className="px-6 py-4 text-left text-[var(--library-wood)] font-medium">Estado</th>
                  <th className="px-6 py-4 text-right text-[var(--library-wood)] font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-library-leather/10">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-[var(--library-parchment)]/50 transition-colors">
                    <td className="px-6 py-4 text-[var(--library-wood)] font-medium">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="px-6 py-4 text-[var(--library-wood-medium)] font-mono text-sm">{member.dni}</td>
                    <td className="px-6 py-4 text-[var(--library-wood-medium)]">{member.email}</td>
                    <td className="px-6 py-4">
                      <Badge className={member.status
                        ? "bg-green-100 text-[var(--library-forest)] border border-[var(--library-forest)]/20 hover:bg-green-100 gap-1"
                        : "bg-red-50 text-[var(--library-burgundy)] border border-[var(--library-burgundy)]/20 hover:bg-red-50 gap-1"
                      }>
                        {member.status ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {member.status ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => onViewProfile(member)}
                          variant="ghost"
                          size="sm"
                          className="text-[var(--library-gold-dark)] hover:text-[var(--library-gold)] hover:bg-[var(--library-gold)]/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => onEditMember(member)}
                          variant="ghost"
                          size="sm"
                          className="text-[var(--library-gold)] hover:text-[var(--library-gold-dark)] hover:bg-[var(--library-gold)]/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {members.length === 0 && (
              <div className="py-12 text-center text-[var(--library-wood-medium)]">
                No hay socios registrados. Comienza registrando el primer socio.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
