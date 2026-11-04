# Restaurante

Web de gestión de un restaurante, creada como proyecto final académico.
Es la migración de una primera versión hecha en Flask a **NestJS + React**.

**Desarrollado por:**Luciano Pardo

## Funcionalidades

- **Clientes:** registro e inicio de sesión, menú, perfil editable y reservas de mesa (crear y cancelar, máximo 3 activas).
- **Empleados:** ven todas las reservas.
- **Administrador:** gestión de empleados, inventario de insumos con filtro por categoría, registro de ventas y gráfico de ventas por mes.

## Tecnologías

| Parte | Tecnologías |
| --- | --- |
| Backend (`backend/`) | NestJS, TypeORM, MySQL, API **REST** y **GraphQL** (Apollo), JWT, bcrypt, class-validator |
| Frontend (`frontend/`) | React, TypeScript, Vite, React Router, Chart.js |

El frontend se comunica con el backend mediante GraphQL. Las rutas REST siguen disponibles.

## Requisitos

- Node.js 20 o superior
- MySQL

## Puesta en marcha

### 1. Base de datos

```sql
CREATE DATABASE restaurante_nest;
```

Las tablas se crean solas al arrancar el backend.

### 2. Backend

```sh
cd backend
npm install
```

Copia `.env_example` como `.env` y completa los datos:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=restaurante_nest

ADMIN_EMAIL=admin@restaurante.com
ADMIN_PASSWORD=una-clave-segura

JWT_SECRET=un-texto-largo-y-aleatorio
```

Al arrancar por primera vez se crea automáticamente el administrador con `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

```sh
npm run start:dev
```

- API REST: http://localhost:3000
- GraphQL (con GraphiQL para probar consultas): http://localhost:3000/graphql — ver [backend/GRAPHQL.md](backend/GRAPHQL.md)

### 3. Frontend

```sh
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173

## Estructura

```
backend/    API en NestJS (módulos: auth, users, supplies, reservations, sales)
frontend/   Interfaz en React (ver frontend/README.md)
```
