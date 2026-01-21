# LibriFree

Una aplicación web que permita a un bibliotecario gestionar el catálogo de libros, registrar usuarios y controlar quién tiene qué libro y cuándo debe devolverlo.

## 🚀 Inicio Rápido con Docker (Recomendado)

La forma más fácil de ejecutar LibriFree es usando Docker. Solo necesitas tener Docker Desktop instalado.

### Requisitos Previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y en ejecución

### Instalación Automática

1. Clona el repositorio:
```bash
git clone https://github.com/joseenrique61/LibriFree.git
cd LibriFree
```

2. Ejecuta el script de instalación:
```bash
# En Windows
setup.bat

# En Linux/Mac (próximamente)
# ./setup.sh
```

3. Accede a la aplicación:
   - **Frontend:** http://localhost:3000
   - **API:** http://localhost:5051
   - **Swagger:** http://localhost:5051/swagger

4. Inicia sesión con las credenciales por defecto:
   - **Usuario:** `admin`
   - **Contraseña:** `securePassword123`

### Comandos Útiles de Docker

```bash
# Ver logs en tiempo real
docker compose logs -f

# Parar los contenedores
docker compose down

# Reiniciar los servicios
docker compose restart

# Reconstruir las imágenes
docker compose build --no-cache

# Limpiar todo (incluyendo datos)
docker compose down -v
```

---

## 🛠️ Instalación Manual (Sin Docker)

Si prefieres ejecutar el proyecto sin Docker, sigue las instrucciones en los READMEs específicos:

- [Backend (API .NET)](src/back/README.md)
- [Frontend (React)](src/front/LibriFreeFront/README.md)

---

## 📋 Características

- ✅ Gestión completa de libros (CRUD)
- ✅ Registro y gestión de miembros
- ✅ Control de préstamos y devoluciones
- ✅ Autenticación JWT
- ✅ API RESTful documentada con Swagger
- ✅ Interfaz moderna y responsiva

---

## 🏗️ Arquitectura

**Backend:**
- .NET 8 con Entity Framework Core
- SQLite para base de datos
- JWT para autenticación
- Swagger para documentación de API

**Frontend:**
- React 18 con TypeScript
- Vite como build tool
- Tailwind CSS + Radix UI para componentes
- React Hook Form para formularios

---

## 📦 Estructura del Proyecto

```
LibriFree/
├── docker-compose.yml       # Orquestación de contenedores
├── setup.bat                # Script de instalación automática
├── .env.example             # Template de variables de entorno
├── src/
│   ├── back/               # Backend API .NET
│   │   └── LibriFreeBack/
│   │       ├── Dockerfile
│   │       └── ...
│   └── front/              # Frontend React
│       └── LibriFreeFront/
│           ├── Dockerfile
│           └── ...
└── data/                   # Datos persistentes (generado)
    └── librifree.db
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno

El archivo `.env` se genera automáticamente con `setup.bat`, pero puedes personalizarlo:

```env
# JWT Configuration
JWT_SECRET_KEY=tu-clave-secreta-aqui

# Database
DATABASE_PATH=/app/data/librifree.db

# ASP.NET Core
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:5051
```

### Puerto Personalizado para Frontend

Edita `docker-compose.yml` para cambiar el puerto del frontend:
```yaml
frontend:
  ports:
    - "8080:80"  # Cambiar 3000 por el puerto deseado
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la licencia especificada en el archivo [LICENSE](LICENSE).

---

## 👥 Equipo

Desarrollado como proyecto final para Metodología de Desarrollo de Software.
