@echo off
setlocal EnableDelayedExpansion

:: ==============================================================================
:: LibriFree - Setup Script para Docker
:: ==============================================================================
:: Este script automatiza la instalación y configuración de LibriFree usando Docker
::
:: Requisitos:
::   - Docker Desktop instalado y en ejecución
::   - Docker Compose disponible
:: ==============================================================================

echo.
echo ========================================
echo   LibriFree - Setup Automatizado
echo ========================================
echo.

:: ==============================================================================
:: 1. VERIFICAR DOCKER INSTALADO
:: ==============================================================================
echo [1/6] Verificando Docker...

docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker no esta instalado o no esta en el PATH.
    echo.
    echo Por favor instala Docker Desktop desde:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

docker compose version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker Compose no esta disponible.
    echo.
    echo Asegurate de tener Docker Desktop actualizado.
    pause
    exit /b 1
)

echo [OK] Docker esta instalado correctamente
echo.

:: ==============================================================================
:: 2. VERIFICAR QUE DOCKER ESTE CORRIENDO
:: ==============================================================================
echo [2/6] Verificando que Docker este en ejecucion...

docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker no esta en ejecucion.
    echo.
    echo Por favor inicia Docker Desktop y vuelve a ejecutar este script.
    pause
    exit /b 1
)

echo [OK] Docker esta en ejecucion
echo.

:: ==============================================================================
:: 3. GENERAR JWT SECRET KEY
:: ==============================================================================
echo [3/6] Generando configuracion segura...

:: Verificar si .env ya existe
if exist .env (
    echo [ADVERTENCIA] El archivo .env ya existe.
    set /p OVERWRITE="Deseas sobrescribirlo? (S/N): "
    if /i not "!OVERWRITE!"=="S" (
        echo Usando el archivo .env existente...
        goto :skip_env_creation
    )
)

:: Generar JWT secret key usando PowerShell
echo Generando JWT secret key...
powershell -Command "$bytes = New-Object byte[] 32; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes)" > .jwt_key_temp
set /p JWT_KEY=<.jwt_key_temp
del .jwt_key_temp

:: Crear archivo .env
echo # LibriFree Environment Configuration > .env
echo # Generated automatically by setup.bat >> .env
echo # Generated on: %date% %time% >> .env
echo. >> .env
echo # JWT Configuration >> .env
echo JWT_SECRET_KEY=%JWT_KEY% >> .env
echo. >> .env
echo # Database Configuration >> .env
echo DATABASE_PATH=/app/data/librifree.db >> .env
echo. >> .env
echo # ASP.NET Core Configuration >> .env
echo ASPNETCORE_ENVIRONMENT=Development >> .env
echo ASPNETCORE_URLS=http://+:5051 >> .env

echo [OK] Archivo .env creado con JWT key seguro
echo.

:skip_env_creation

:: ==============================================================================
:: 4. CREAR DIRECTORIO DE DATOS
:: ==============================================================================
echo [4/6] Creando directorio de datos...

if not exist "data" mkdir data
echo [OK] Directorio de datos listo
echo.

:: ==============================================================================
:: 5. CONSTRUIR IMAGENES DOCKER
:: ==============================================================================
echo [5/6] Construyendo imagenes Docker...
echo Esto puede tomar varios minutos la primera vez...
echo.

docker compose build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Error al construir las imagenes Docker.
    echo Por favor revisa los mensajes de error arriba.
    pause
    exit /b 1
)

echo.
echo [OK] Imagenes construidas exitosamente
echo.

:: ==============================================================================
:: 6. LEVANTAR CONTENEDORES
:: ==============================================================================
echo [6/6] Iniciando contenedores...
echo.

docker compose up -d
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Error al iniciar los contenedores.
    echo Por favor revisa los mensajes de error arriba.
    pause
    exit /b 1
)

echo.
echo [OK] Contenedores iniciados correctamente
echo.

:: ==============================================================================
:: ESPERAR A QUE LOS CONTENEDORES ESTEN LISTOS
:: ==============================================================================
echo Esperando a que los servicios esten listos...
timeout /t 10 /nobreak >nul
echo.

:: ==============================================================================
:: INFORMACION POST-INSTALACION
:: ==============================================================================
echo ========================================
echo   Instalacion Completada!
echo ========================================
echo.
echo LibriFree esta ahora ejecutandose en Docker.
echo.
echo URLS DE ACCESO:
echo   - Frontend:  http://localhost:3000
echo   - API:       http://localhost:5051
echo   - Swagger:   http://localhost:5051/swagger
echo.
echo CREDENCIALES POR DEFECTO:
echo   - Usuario:   admin
echo   - Password:  securePassword123
echo.
echo ========================================
echo   Comandos Utiles
echo ========================================
echo.
echo Ver logs en tiempo real:
echo   docker compose logs -f
echo.
echo Ver logs solo del backend:
echo   docker compose logs -f backend
echo.
echo Ver logs solo del frontend:
echo   docker compose logs -f frontend
echo.
echo Parar los contenedores:
echo   docker compose down
echo.
echo Reiniciar los contenedores:
echo   docker compose restart
echo.
echo Reconstruir sin cache:
echo   docker compose build --no-cache
echo.
echo Limpiar todo (incluyendo datos):
echo   docker compose down -v
echo.
echo ========================================
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause >nul

:: Abrir navegador
start http://localhost:3000

echo.
echo Disfruta usando LibriFree!
echo.

endlocal
