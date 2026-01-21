# LibriFree API

API RESTful para el sistema de gestión de bibliotecas LibriFree. Cubre la gestión de inventario de libros, miembros y préstamos.

## Tecnologías Utilizadas

- **.NET 8:** Framework para la construcción de la API.
- **Entity Framework Core:** ORM para la interacción con la base de datos.
- **SQLite:** Base de datos ligera para desarrollo.
- **JWT (JSON Web Tokens):** Para la autenticación y autorización de endpoints.
- **Swashbuckle:** Para la generación de la documentación de la API (Swagger).

## Ejecución Rápida con Docker

La forma más fácil de ejecutar el backend es usando Docker desde la raíz del proyecto:

```bash
cd LibriFree
setup.bat
```

## Ejecución Manual (Sin Docker)

### Requisitos Previos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Pasos

1. **Navegar al directorio del proyecto:**
   ```bash
   cd LibriFree/src/back/LibriFreeBack/LibriFreeBack
   ```

2. **Configurar los ajustes de la aplicación:**

   El fichero `appsettings.json` no está incluido en el repositorio por seguridad. Debes crearlo a partir del fichero de ejemplo:
   ```bash
   cp appsettings.json.example appsettings.json
   ```

3. **Generar y configurar la clave secreta JWT:**

   **En Windows (PowerShell):**
   ```powershell
   $secretKey = [System.Convert]::ToBase64String((1..32 | % { [System.Security.Cryptography.RandomNumberGenerator]::GetInt32(256) } | % { [byte]$_ }))
   (Get-Content appsettings.json) -replace 'secret-key', $secretKey | Set-Content appsettings.json
   ```

   **En Linux/macOS:**
   ```bash
   SECRET_KEY=$(openssl rand -base64 32) && sed -i "s/secret-key/$SECRET_KEY/" appsettings.json
   ```

4. **Ejecutar la aplicación:**
   ```bash
   dotnet run
   ```

   La API estará disponible en:
   - **API:** http://localhost:5051
   - **Swagger:** http://localhost:5051/swagger

## Endpoints de la API

Todos los endpoints (excepto login) requieren autenticación JWT. Incluye el token en el header:
```
Authorization: Bearer <token>
```

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/Auth/login` | Obtener token JWT |

**Credenciales por defecto:** `admin` / `securePassword123`

### Libros (Books)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/Books` | Listar todos los libros |
| GET | `/Books?search=texto` | Buscar libros por título/autor/ISBN |
| GET | `/Books?category=Ficción` | Filtrar libros por categoría |
| GET | `/Books/{id}` | Obtener un libro por ID |
| POST | `/Books` | Crear un nuevo libro |
| PUT | `/Books/{id}` | Actualizar un libro existente |
| DELETE | `/Books/{id}` | Eliminar un libro |
| GET | `/Books/{id}/loans` | Historial de préstamos de un libro |

### Miembros (Members)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/Members` | Listar todos los miembros |
| GET | `/Members/{id}` | Obtener un miembro por ID |
| POST | `/Members` | Registrar un nuevo miembro |
| PUT | `/Members/{id}` | Actualizar un miembro |
| GET | `/Members/{id}/loans` | Historial de préstamos de un miembro |

### Préstamos (Loans)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/Loans` | Listar todos los préstamos |
| GET | `/Loans?status=Active` | Filtrar préstamos por estado |
| GET | `/Loans/active` | Obtener solo préstamos activos/vencidos |
| GET | `/Loans/{id}` | Obtener un préstamo por ID |
| POST | `/Loans` | Registrar un nuevo préstamo |
| PUT | `/Loans/{id}/return` | Registrar devolución de un préstamo |

## Modelos de Datos

### BookInputDto (Crear/Actualizar libro)
```json
{
  "title": "string",
  "author": "string",
  "isbn": "string",
  "category": "string",
  "stock": 0
}
```

### MemberInputDto (Crear/Actualizar miembro)
```json
{
  "firstName": "string",
  "lastName": "string",
  "dni": "string",
  "email": "string"
}
```

### LoanInputDto (Crear préstamo)
```json
{
  "bookId": 0,
  "memberId": 0,
  "dueDate": "2026-01-28T00:00:00"
}
```

## Estructura del Proyecto

```
LibriFreeBack/
├── Controllers/
│   ├── AuthController.cs      # Autenticación JWT
│   ├── BooksController.cs     # CRUD de libros
│   ├── MembersController.cs   # CRUD de miembros
│   └── LoansController.cs     # Gestión de préstamos
├── Models/
│   ├── Book.cs                # Entidad Libro
│   ├── Member.cs              # Entidad Miembro
│   ├── Loan.cs                # Entidad Préstamo
│   ├── Admin.cs               # Entidad Admin
│   └── DTOs/                  # Data Transfer Objects
├── Data/
│   ├── LibriFreeContext.cs    # DbContext EF Core
│   └── SeedData.cs            # Datos iniciales
├── Program.cs                 # Configuración de la app
└── appsettings.json.example   # Template de configuración
```

## Seed Data

Al iniciar la aplicación por primera vez, se crean automáticamente:
- 1 usuario administrador
- 14 libros de ejemplo
- 10 miembros de ejemplo
- 8 préstamos de ejemplo (activos, vencidos y devueltos)

## Notas de Desarrollo

- La API usa **SQLite** en desarrollo. Para producción, considerar PostgreSQL o SQL Server.
- El stock disponible de libros se calcula dinámicamente basándose en los préstamos activos.
- Los préstamos tienen fecha de vencimiento automática de 7 días si no se especifica.
- El estado "Overdue" (vencido) se determina comparando la fecha de vencimiento con la fecha actual.
