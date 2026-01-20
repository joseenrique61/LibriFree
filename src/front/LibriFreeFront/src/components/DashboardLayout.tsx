import { ReactNode, useState } from 'react';
import { BookOpen, Users, FileText, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export function DashboardLayout({ children, activeSection, onSectionChange, onLogout }: DashboardLayoutProps) {
  const navItems = [
    { id: 'libros', label: 'Libros', icon: BookOpen },
    { id: 'miembros', label: 'Miembros', icon: Users },
    { id: 'prestamos', label: 'Préstamos', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">LibriFree</h2>
              <p className="text-gray-500 text-sm">Gestión</p>
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
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">AB</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-900">Admin Biblioteca</p>
              <p className="text-gray-500 text-sm">admin@biblioteca.com</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
