import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Library } from 'lucide-react';
import { API_BASE_URL } from '../api';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Credenciales incorrectas');
        return;
      }

      const data = await response.json();
      localStorage.setItem('jwt_token', data.token);
      onLogin();
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-library-parchment to-[var(--library-cream)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card con borde superior dorado */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Borde decorativo dorado */}
          <div className="h-2 bg-gradient-to-r from-[var(--library-gold)] via-[#E8D5A3] to-[var(--library-gold)]"></div>

          <div className="p-8">
            {/* Logo and Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-[var(--library-leather)] rounded-full p-4 mb-4 shadow-lg border-4 border-[var(--library-gold)]">
                <Library className="w-8 h-8 text-[var(--library-gold)]" />
              </div>
              <h1 className="text-[var(--library-wood)] font-['Playfair_Display'] text-2xl">LibriFree</h1>
              <p className="text-[var(--library-wood-medium)] mt-2">Sistema de Gestión de Biblioteca</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[var(--library-wood)]">
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="nombredeusuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className={`bg-[var(--library-parchment)] border-[var(--library-leather)]/30 focus:border-[var(--library-leather)] focus:ring-2 focus:ring-library-leather/20 transition-all ${
                    focusedField === 'username' ? 'ring-2 ring-library-leather/20 border-[var(--library-leather)]' : ''
                  }`}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[var(--library-wood)]">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`bg-[var(--library-parchment)] border-[var(--library-leather)]/30 focus:border-[var(--library-leather)] focus:ring-2 focus:ring-library-leather/20 transition-all ${
                    focusedField === 'password' ? 'ring-2 ring-library-leather/20 border-[var(--library-leather)]' : ''
                  }`}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-[var(--library-burgundy)]/20 rounded-md p-3">
                  <p className="text-[var(--library-burgundy)] text-sm text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[var(--library-leather)] hover:bg-[var(--library-leather-dark)] text-white py-2.5 transition-colors shadow-md"
              >
                Iniciar Sesión
              </Button>
            </form>

            {/* Footer Link */}
            <div className="mt-6 text-center">
              <a href="#" className="text-[var(--library-leather)] hover:text-[var(--library-leather-dark)] transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-[var(--library-wood-medium)] mt-8">
          © 2026 LibriFree. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
