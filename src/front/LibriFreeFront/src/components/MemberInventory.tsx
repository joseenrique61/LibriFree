import { Plus, Edit2, Eye } from 'lucide-react';
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
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Gestión de Miembros</h1>
        <p className="text-gray-600">Administra los socios de la biblioteca</p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600">Total de miembros: <span className="font-semibold text-gray-900">{members.length}</span></p>
          </div>

          {/* Add Member Button */}
          <Button
            onClick={onAddMember}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Miembro
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="py-12 text-center text-gray-500">Cargando miembros...</div>
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
                  <th className="px-6 py-4 text-left text-gray-700">Nombre Completo</th>
                  <th className="px-6 py-4 text-left text-gray-700">DNI</th>
                  <th className="px-6 py-4 text-left text-gray-700">Correo Electrónico</th>
                  <th className="px-6 py-4 text-left text-gray-700">Estado</th>
                  <th className="px-6 py-4 text-right text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{member.dni}</td>
                    <td className="px-6 py-4 text-gray-600">{member.email}</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Activo</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <Button
                          onClick={() => onViewProfile(member)}
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => onEditMember(member)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
              <div className="py-12 text-center text-gray-500">
                No hay miembros registrados. Comienza registrando el primer miembro.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
