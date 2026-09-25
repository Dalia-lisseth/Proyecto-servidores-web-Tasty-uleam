# Tasty Uleam

Plataforma universitaria de comidas para consultar menús por sede, registrar usuarios y preparar los flujos de pedidos y reservas.

## Estructura

```text
.
├── frontend/    # React, Vite y TypeScript
└── backend/     # NestJS, TypeORM y PostgreSQL
```

## Inicio rápido

Requisitos: Node.js 18 o superior y PostgreSQL.

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

La aplicación estará disponible normalmente en `http://localhost:5173`.

### Backend

```bash
cd backend
npm ci
```

Copia `.env.example` como `.env` y completa las credenciales locales de PostgreSQL. Después inicia la API:

```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000`.

## Validación

```bash
# En frontend/
npm run build

# En backend/
npm run build
npm test -- --runInBand
```

## Estado del proyecto

- El recurso principal del backend es `MenuItem`.
- El CRUD de menú está implementado con PostgreSQL y TypeORM.
- El módulo de usuarios incluye registro, login y CRUD.
- Pedidos y reservas están preparados como módulos para las siguientes etapas.
- Las credenciales reales se mantienen en `.env`, que no se publica.

Consulta la documentación específica del backend en [backend/README.md](backend/README.md).
