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
import { MemberDto, MemberInputDto } from '../utils/apiClient';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: MemberInputDto) => void;
  member?: MemberDto | null;
}

export function MemberFormModal({ isOpen, onClose, onSave, member }: MemberFormModalProps) {
  const [formData, setFormData] = useState<MemberInputDto>({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName,
        lastName: member.lastName,
        dni: member.dni,
        email: member.email,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        dni: '',
        email: '',
      });
    }
  }, [member, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{member ? 'Editar Miembro' : 'Registrar Nuevo Miembro'}</DialogTitle>
          <DialogDescription>
            {member
              ? 'Actualiza la información del miembro. El DNI no puede ser modificado.'
              : 'Completa los datos para agregar un nuevo miembro al sistema.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700">
                Nombre
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Ej: María"
                className="bg-gray-50 border-gray-300"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700">
                Apellido
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Ej: González"
                className="bg-gray-50 border-gray-300"
                required
              />
            </div>

            {/* DNI */}
            <div className="space-y-2">
              <Label htmlFor="dni" className="text-gray-700">
                DNI / Cédula
              </Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="Ej: 12345678A"
                className={`border-gray-300 font-mono ${member ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'}`}
                required
                disabled={!!member} // DNI is immutable when editing (US07)
                title={member ? 'El DNI no puede ser modificado' : ''}
              />
              {member && (
                <p className="text-xs text-gray-500">El DNI no puede ser modificado por seguridad</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: maria.gonzalez@email.com"
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
              {member ? 'Guardar Cambios' : 'Registrar Miembro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
