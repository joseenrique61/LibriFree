import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BookOpen } from 'lucide-react';
import { API_BASE_URL } from '../api'; // Import API_BASE_URL

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // State for error messages

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

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
        setError(errorData.message || 'Login failed');
        return;
      }

      const data = await response.json();
      localStorage.setItem('jwt_token', data.token); // Store JWT token
      onLogin(); // Call onLogin prop on successful login
    } catch (err) {
      setError('Network error or server unreachable.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 rounded-full p-4 mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-gray-900">LibriFree</h1>
            <p className="text-gray-600 mt-2">Sistema de Gestión de Biblioteca</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700"> {/* Changed htmlFor to username */}
                Usuario
              </Label>
              <Input
                id="username"
                type="text" // Changed type to text
                placeholder="nombredeusuario" // Updated placeholder
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                className={`bg-gray-50 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all ${
                  focusedField === 'username' ? 'ring-2 ring-blue-600/20 border-blue-600' : ''
                }`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
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
                className={`bg-gray-50 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all ${
                  focusedField === 'password' ? 'ring-2 ring-blue-600/20 border-blue-600' : ''
                }`}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Display error message */}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 transition-colors"
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-600 mt-8">
          © 2026 LibriFree. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
