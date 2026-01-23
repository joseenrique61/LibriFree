# LibriFree Frontend

Interfaz de usuario para el sistema de gestión de bibliotecas LibriFree. Aplicación web moderna construida con React y TypeScript.

## Tecnologías Utilizadas

- **React 18:** Biblioteca para construir interfaces de usuario
- **TypeScript:** Tipado estático para JavaScript
- **Vite:** Build tool y servidor de desarrollo rápido
- **Tailwind CSS:** Framework de CSS utilitario
- **Radix UI:** Componentes accesibles y sin estilos
- **Shadcn/ui:** Componentes de UI basados en Radix UI
- **Lucide React:** Iconos modernos
- **Sonner:** Sistema de notificaciones toast

## Ejecución Rápida con Docker

La forma más fácil de ejecutar el frontend es usando Docker desde la raíz del proyecto:

```bash
cd LibriFree
setup.bat
```

El frontend estará disponible en http://localhost:3000

## Ejecución Manual (Sin Docker)

### Requisitos Previos

- [Node.js 20+](https://nodejs.org/) (recomendado)
- npm o yarn

### Pasos

1. **Navegar al directorio del proyecto:**
   ```bash
   cd LibriFree/src/front/LibriFreeFront
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar la URL del backend (opcional):**

   Por defecto, el frontend se conecta a `http://localhost:5051`. Si tu backend está en otra URL, crea un archivo `.env.local`:
   ```env
   VITE_API_BASE_URL=http://tu-backend:puerto
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en http://localhost:5173

5. **Compilar para producción:**
   ```bash
   npm run build
   ```

## Funcionalidades

### Autenticación
- Pantalla de login con validación
- Sesión persistente con JWT
- Logout seguro

### Gestión de Libros
- Listado de libros con tabla interactiva
- Búsqueda por título, autor o ISBN
- Filtro por categoría
- Crear, editar y eliminar libros
- Visualización de stock disponible

### Gestión de Miembros
- Listado de miembros
- Crear y editar miembros
- Ver perfil con historial de préstamos
- Validación de DNI único

### Gestión de Préstamos
- Dashboard con estadísticas (total, activos, vencidos)
- Registro de nuevos préstamos
- Filtro por estado (todos, activos, devueltos)
- Resaltado visual de préstamos vencidos
- Registro de devoluciones

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/                     # Componentes base (Shadcn/ui)
│   ├── BookInventory.tsx       # Vista de libros
│   ├── BookFormModal.tsx       # Formulario de libro
│   ├── MemberInventory.tsx     # Vista de miembros
│   ├── MemberFormModal.tsx     # Formulario de miembro
│   ├── MemberProfile.tsx       # Perfil de miembro
│   ├── LoanInventory.tsx       # Vista de préstamos
│   ├── LoanFormModal.tsx       # Formulario de préstamo
│   ├── DashboardLayout.tsx     # Layout principal
│   ├── LoginScreen.tsx         # Pantalla de login
│   └── DeleteConfirmationModal.tsx
├── utils/
│   └── apiClient.ts            # Cliente HTTP y tipos DTO
├── api.ts                      # Configuración de API base
├── App.tsx                     # Componente principal
├── main.tsx                    # Punto de entrada
└── index.css                   # Estilos globales (Tailwind)
```

## Tipos de Datos (DTOs)

Los tipos TypeScript reflejan los DTOs del backend:

```typescript
interface BookDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  stock: number;
  available: number;
}

interface MemberDto {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
}

interface LoanDto {
  id: number;
  bookId: number;
  bookTitle: string;
  memberId: number;
  memberName: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "Active" | "Returned" | "Overdue";
}
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta ESLint |

## Configuración de Producción

Para producción, el frontend se sirve a través de Nginx (ver `Dockerfile` y `nginx.conf`):

- Gzip habilitado para mejor rendimiento
- Caché de assets estáticos
- Configuración SPA (todas las rutas redirigen a index.html)

## Notas de Desarrollo

- El token JWT se almacena en `localStorage` con la clave `jwt_token`
- Las notificaciones toast se muestran en la esquina superior derecha
- El stock disponible se calcula dinámicamente por el backend
- Los préstamos vencidos se resaltan con fondo rojo en las tablas
