# Tasty Uleam

Frontend de la plataforma universitaria de comidas Tasty Uleam. Permite explorar las sedes, consultar menús, registrar pedidos y gestionar reservas desde una interfaz React responsive.

## Estado actual

- React 19, TypeScript y Vite.
- React Router para la navegación.
- Servicios locales basados en `localStorage` y `sessionStorage`.
- Menús, pedidos, reservas y autenticación preparados para sustituirse progresivamente por la API del backend.
- Sin proveedor externo de base de datos ni despliegue automático configurado en este repositorio.

## Inicio rápido

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev
```

La aplicación estará disponible en la URL que indique Vite, normalmente `http://localhost:5173`.

## Comandos

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Compilación de producción
npm run preview   # Previsualización del build
npm run lint      # Revisión estática
```

## Rutas

| Ruta | Descripción |
| --- | --- |
| `/` | Inicio con sedes y menú destacado |
| `/registro` | Registro de usuarios |
| `/login` | Inicio de sesión |
| `/sede/:sedeId` | Menú, pedidos y reservas de una sede |
| `/admin/login` | Acceso al administrador |
| `/admin/panel` | Panel de administración |

## Estructura principal

```text
src/
├── assets/       # Imágenes y recursos
├── componets/    # Componentes React
├── services/     # Persistencia local temporal
├── styles/       # Estilos globales
├── types/        # Tipos del dominio
├── vistas/       # Pantallas de la aplicación
├── App.tsx       # Rutas principales
└── main.tsx      # Entrada de la aplicación
```

## Próximo paso

El siguiente trabajo es crear el backend NestJS con módulos, controladores, servicios, DTOs, validación, PostgreSQL y TypeORM. Los servicios actuales deben conservarse hasta migrar cada flujo a la API, para evitar romper la interfaz durante la transición.
