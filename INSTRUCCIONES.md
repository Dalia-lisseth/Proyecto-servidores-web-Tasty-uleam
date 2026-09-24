# Instrucciones para ejecutar el proyecto

## 1. Instalar dependencias

Desde la carpeta `Tasty_uleam-_despliegue` ejecuta:

```bash
npm install
```

## 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Vite mostrará la URL local disponible. Ábrela en el navegador.

## 3. Probar la aplicación

### Inicio

`http://localhost:5173/`

Muestra las tres sedes y el menú destacado.

### Registro e inicio de sesión

`http://localhost:5173/registro` y `http://localhost:5173/login`

Durante esta etapa, los datos se guardan localmente en el navegador.

### Sede y menú

`http://localhost:5173/sede/tasty-central`

Permite consultar el menú, crear pedidos y reservar.

### Panel de administración

`http://localhost:5173/admin/login`

El acceso administrativo actual es local y temporal. Las credenciales de desarrollo están definidas en `src/services/authService.ts`.

## 4. Comandos útiles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Compilación de producción
npm run preview   # Previsualización del build
npm run lint      # Revisión estática
```

## Siguiente etapa

El frontend no requiere credenciales externas. La integración con PostgreSQL se realizará mediante el futuro backend NestJS, manteniendo los servicios actuales hasta completar la migración de cada caso de uso.
