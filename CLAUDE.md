# CLAUDE.md — GoDaddy Node.js Hosting

Contexto para agentes que trabajen en este repositorio. Este proyecto se despliega en
**GoDaddy Node.js Hosting**, una PaaS administrada de Node.js.

## La plataforma

- Sin Docker, sin CI/CD, sin configuración de infraestructura.
- SSL/TLS, CDN, administración de procesos y cómputo: los maneja la plataforma.
- Se carga un **zip** de la carpeta del proyecto desde la UI, o se conecta un repo de GitHub.
- Flujo: subir zip → instala dependencias → compila → entorno de **preview privado** →
  se publica a producción y se conecta el dominio.

## Requisitos

### package.json

Debe existir en la **raíz** con un script `start`. La plataforma ejecuta
`npm install --production` y luego `npm start`.

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^4.18.0" }
}
```

### Punto de entrada

El archivo referenciado por `start` tiene que existir. Patrones válidos:
`node server.js`, `node index.js`, `node app.js`, `next start`.

### Puerto

Escuchar siempre en `process.env.PORT`. Nunca hardcodear el puerto. Para frameworks
que piden host, enlazar a `0.0.0.0`, no a `localhost`.

```js
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor en el puerto ${port}`));
```

### Dependencias

**Todo lo que la aplicación necesite para ejecutarse o compilarse va en `dependencies`.**
La plataforma instala con `npm install --production`: las `devDependencies` **no** se
instalan, y si el build las necesita, el build falla.

### Variables de entorno

- `PORT` lo provee la plataforma automáticamente.
- El resto se configura en la UI de hosting después de la carga.
- **Nunca** incluir archivos `.env` ni secretos en el zip. Documentarlos en `.env.example`.

### Archivos persistentes

Todo el contenido del deploy se reemplaza en cada implementación **excepto
`public/assets`**. Si la aplicación necesita conservar archivos entre deploys (imágenes
subidas, adjuntos), debe escribirlos en `public/assets`.

⚠️ `public/assets` es servido públicamente. **No** guardar ahí datos privados
(leads, datos personales, credenciales). Eso va a base de datos.

### Base de datos

La plataforma provee una base de datos, administrable desde la UI
(*Base de datos: ver y editar*). Las credenciales se cargan como variables de entorno.

## Estructura esperada

```
my-app/
├── package.json        # obligatorio, con script "start"
├── server.js           # punto de entrada
├── public/             # estáticos
│   └── assets/         # ÚNICA carpeta persistente entre deploys
├── .env.example        # documentación de variables (nunca .env)
└── CLAUDE.md
```

## Una sola aplicación por carga

No se soportan monorepos ni múltiples aplicaciones, salvo que un único `npm start`
en la raíz levante todo. Si es un monorepo, extraer la app a su propia carpeta.

## Frameworks soportados

Cualquiera que corra con `npm start`: Express, Next.js, Fastify, Nuxt, Remix, Nest,
Hono, Koa, o sitios estáticos servidos por Node.

Next.js: `build` = `next build`, `start` = `next start` (o un server custom que
respete `PORT`).

## Errores comunes

| Síntoma | Causa |
|---|---|
| No arranca | falta el script `start`, o el archivo de entrada no existe |
| `EADDRINUSE` / no responde | puerto hardcodeado en vez de `process.env.PORT` |
| `Cannot find module` en el build | dependencia de build en `devDependencies` |
| Falla la compilación | falta script `build` o la ruta de salida no coincide con `start` |
| Datos que desaparecen al publicar | se escribieron fuera de `public/assets` y sin base de datos |

## Checklist previo a la carga

- [ ] `package.json` en la raíz
- [ ] script `start` definido y el archivo de entrada existe
- [ ] dependencias de producción y de build en `dependencies`
- [ ] escucha en `process.env.PORT`
- [ ] sin puertos, secretos ni rutas locales hardcodeadas
- [ ] corre local con `npm install && npm start`
- [ ] script `build` definido si hay paso de compilación
- [ ] `node_modules`, `.next`, `.git` y `.env*` fuera del zip
