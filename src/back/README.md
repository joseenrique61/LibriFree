# LibriFree API

API para el sistema de gestión de bibliotecas LibriFree. Cubre la gestión de inventario, miembros y préstamos.

## Tecnologías Utilizadas

-   **.NET 8:** Framework para la construcción de la API.
-   **Entity Framework Core:** ORM para la interacción con la base de datos.
-   **SQLite:** Base de datos ligera para desarrollo.
-   **JWT (JSON Web Tokens):** Para la autenticación y autorización de endpoints.
-   **Swashbuckle:** Para la generación de la documentación de la API (Swagger).

## Cómo Ejecutar el Proyecto

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/joseenrique61/LibriFree.git
    cd LibriFree/src/back/LibriFreeBack/LibriFreeBack
    ```

2.  **Configurar los ajustes de la aplicación:**
    El fichero `appsettings.json` no está incluido en el repositorio por seguridad. Debes crearlo a partir del fichero de ejemplo `appsettings.json.example`.

    Copia el fichero de ejemplo:
    ```bash
    cp appsettings.json.example appsettings.json
    ```

3.  **Generar y configurar la clave secreta:**
    El API necesita una clave secreta para firmar los tokens JWT. Puedes generar una con el siguiente comando y actualizar el fichero `appsettings.json` automáticamente.

    **En Linux/macOS:**
    ```bash
    SECRET_KEY=$(openssl rand -base64 32) && sed -i "s/secret-key/$SECRET_KEY/" appsettings.json
    ```
    **En Windows (usando PowerShell):**
    ```powershell
    $secretKey = [System.Convert]::ToBase64String((1..32 | % { [System.Security.Cryptography.RandomNumberGenerator]::GetInt32(256) } | % { [byte]$_ }))
    (Get-Content appsettings.json) -replace 'secret-key', $secretKey | Set-Content appsettings.json
    ```

4.  **Ejecutar la aplicación:**
    Este comando aplicará las migraciones de la base de datos (creando el fichero `librifree.db` si no existe) y arrancará el servidor.

    ```bash
    dotnet run
    ```

    La API estará disponible en `http://localhost:5051` y la documentación de Swagger en `http://localhost:5051/swagger`.

## Endpoints

La especificación completa de los endpoints y los modelos de datos se encuentra en el fichero `spec.yaml`. A continuación un resumen de los recursos disponibles:

-   `POST /api/auth/login`: Autenticación para obtener un token de administrador.
-   `GET, POST /api/books`: Listar, buscar y crear libros.
-   `PUT, DELETE /api/books/{id}`: Actualizar y eliminar un libro.
-   `GET /api/books/{id}/loans`: Ver el historial de préstamos de un libro.
-   `GET, POST /api/members`: Listar y registrar nuevos miembros.
-   `GET, PUT /api/members/{id}`: Obtener y actualizar el perfil de un miembro.
-   `GET, POST /api/loans`: Listar préstamos activos y registrar un nuevo préstamo.
-   `PUT /api/loans/{id}/return`: Marcar un préstamo como devuelto.

---
Generado por Gemini.
