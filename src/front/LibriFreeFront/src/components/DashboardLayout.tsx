import { ReactNode } from 'react';
import { Library, Users, ScrollText, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export function DashboardLayout({ children, activeSection, onSectionChange, onLogout }: DashboardLayoutProps) {
  const navItems = [
    { id: 'libros', label: 'Catálogo', icon: Library },
    { id: 'miembros', label: 'Socios', icon: Users },
    { id: 'prestamos', label: 'Préstamos', icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-[var(--library-cream)] flex">
      {/* Sidebar - Madera Oscura */}
      <aside className="w-64 bg-[var(--library-wood)] flex flex-col shadow-xl">
        {/* Logo Header */}
        <div className="p-6 border-b border-[var(--library-wood-medium)]">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--library-leather)] rounded-lg p-2.5 shadow-md">
              <Library className="w-6 h-6 text-[var(--library-gold)]" />
            </div>
            <div>
              <h2 className="text-[var(--library-parchment)] font-['Playfair_Display'] text-xl">LibriFree</h2>
              <p className="text-[var(--library-gold)] text-sm">Sistema de Biblioteca</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[var(--library-wood-medium)] text-[var(--library-gold)] border-l-4 border-[var(--library-gold)]'
                    : 'text-[var(--library-parchment)]/80 hover:bg-[var(--library-wood-medium)]/50 hover:text-[var(--library-parchment)]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--library-gold)]' : 'text-[var(--library-gold)]/60'}`} />
                <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[var(--library-wood-medium)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--library-leather)] flex items-center justify-center border-2 border-[var(--library-gold)]">
              <span className="text-[var(--library-gold)] font-medium">AB</span>
            </div>
            <div className="flex-1">
              <p className="text-[var(--library-parchment)]">Admin Biblioteca</p>
              <p className="text-[var(--library-parchment)]/60 text-sm">Bibliotecario</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-[var(--library-parchment)]/70 border-[var(--library-wood-medium)] bg-transparent hover:bg-[var(--library-burgundy)]/30 hover:text-[var(--library-parchment)] hover:border-[var(--library-burgundy)]"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[var(--library-cream)]">
        {children}
      </main>
    </div>
  );
}
