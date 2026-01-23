import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { UserCheck, UserX } from "lucide-react";
import { MemberDto, MemberInputDto } from "../utils/apiClient";

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: MemberInputDto) => void;
  member?: MemberDto | null;
}

// Moved outside the component to prevent re-creation on every render
function verifyEcuadorianDni(dni: string): string {
  if (!dni) {
    return ''; // Let 'required' attribute handle empty input
  }

  if (dni.length !== 10) {
    return 'La cédula debe tener 10 dígitos.';
  }

  const numberPattern = /^\d+$/;
  if (!numberPattern.test(dni)) {
    return 'La cédula solo debe contener números.';
  }

  const provinceDigit = parseInt(dni.substring(0, 2));
  if (provinceDigit > 24 && provinceDigit !== 30) {
    return 'El código de provincia de la cédula es inválido.';
  }

  let even: number[] = [];
  let odd: number[] = [];

  // Note: they are in inverse order (odd when i modulo 2 equals 0 and viceversa) because of how substring works
  for (let i = 0; i < dni.length - 1; i++) {
    if (i % 2 === 0) {
      odd.push(parseInt(dni.substring(i, i + 1)));
    } else {
      even.push(parseInt(dni.substring(i, i + 1)));
    }
  }

  odd = odd.map((a) => {
    let result = a * 2;
    if (result > 9) {
      result -= 9;
    }
    return result;
  });

  const sum =
    odd.reduce((acc, current) => acc + current) +
    even.reduce((acc, current) => acc + current);

  let verifyingDigit = sum % 10;
  if (verifyingDigit !== 0) {
    verifyingDigit = 10 - verifyingDigit;
  }

  if (parseInt(dni.substring(dni.length - 1, dni.length)) !== verifyingDigit) {
    return 'El dígito verificador de la cédula es inválido.';
  }

  return ''; // DNI is valid
}

export function MemberFormModal({
  isOpen,
  onClose,
  onSave,
  member,
}: MemberFormModalProps) {
  const [formData, setFormData] = useState<MemberInputDto>({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    status: true, // Default to active
  });
  const [dniError, setDniError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (member) {
        setFormData({
          firstName: member.firstName,
          lastName: member.lastName,
          dni: member.dni,
          email: member.email,
          status: member.status,
        });
        setDniError(verifyEcuadorianDni(member.dni)); // Validate existing DNI
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          dni: "",
          email: "",
          status: true, // Default to active for new members
        });
        setDniError(''); // Reset for new entry
      }
    }
  }, [member, isOpen]);

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDni = e.target.value;
    setFormData({ ...formData, dni: newDni });
    setDniError(verifyEcuadorianDni(newDni));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDniError = verifyEcuadorianDni(formData.dni);
    if (currentDniError) {
      setDniError(currentDniError);
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {member ? "Editar Miembro" : "Registrar Nuevo Miembro"}
          </DialogTitle>
          <DialogDescription>
            {member
              ? "Actualiza la información del miembro. La cédula no puede ser modificada."
              : "Completa los datos para agregar un nuevo miembro al sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[var(--library-wood)]">
                Nombre
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Ej: María"
                className="bg-[var(--library-parchment)] border-[var(--library-leather)]/20 focus:border-[var(--library-leather)] focus:ring-library-leather/20"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[var(--library-wood)]">
                Apellido
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Ej: González"
                className="bg-[var(--library-parchment)] border-[var(--library-leather)]/20 focus:border-[var(--library-leather)] focus:ring-library-leather/20"
                required
              />
            </div>

            {/* DNI */}
            <div className="space-y-2">
              <Label htmlFor="dni" className="text-[var(--library-wood)]">
                Cédula de Identidad
              </Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={handleDniChange}
                placeholder="Ej: 1234567890"
                className={`border-[var(--library-leather)]/20 font-mono ${member ? "bg-gray-200 cursor-not-allowed" : "bg-[var(--library-parchment)]"} ${dniError ? 'border-red-500' : ''}`}
                maxLength={10}
                required
                disabled={!!member}
                title={member ? "La cédula no puede ser modificada" : ""}
              />
              {dniError && <p className="text-sm text-red-500 mt-1">{dniError}</p>}
              {member && (
                <p className="text-xs text-gray-500">
                  La cédula no puede ser modificada por seguridad
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--library-wood)]">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Ej: maria.gonzalez@email.com"
                className="bg-[var(--library-parchment)] border-[var(--library-leather)]/20 focus:border-[var(--library-leather)] focus:ring-library-leather/20"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700">
                Estado del Miembro
              </Label>
              <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3">
                {formData.status ? (
                  <UserCheck className="h-5 w-5 text-green-600" />
                ) : (
                  <UserX className="h-5 w-5 text-red-600" />
                )}
                <div className="flex-grow">
                  <p className="font-medium text-gray-800">
                    {formData.status ? "Activo" : "Inactivo"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.status
                      ? "El miembro puede solicitar préstamos."
                      : "El miembro no puede solicitar préstamos."}
                  </p>
                </div>
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[var(--library-leather)]/30 text-[var(--library-wood-medium)] hover:bg-[var(--library-leather)]/5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[var(--library-forest)] hover:bg-[var(--library-forest-dark)] text-white shadow-md disabled:opacity-50"
              disabled={!!dniError}
            >
              {member ? "Guardar Cambios" : "Registrar Miembro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
