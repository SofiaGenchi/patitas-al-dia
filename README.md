# Patitas al Día

Una aplicación móvil-first (PWA opcional) para registrar la alimentación de tus mascotas y mantener sincronizada a toda la familia, sin necesidad de bases de datos complejas.

## 🛠 Arquitectura

- **Frontend**: React + Vite + Tailwind CSS.
- **Backend**: Netlify Functions (Directorio: `netlify/functions/`).
- **Persistencia**: Netlify Blobs (incluido nativamente con Netlify).

## 🚀 Cómo correr el proyecto localmente

Para probar el Frontend y el Backend (Netlify Functions + Blobs) localmente, debes usar Netlify CLI. Los Netlify Blobs en desarrollo local se almacenan en `.netlify/blobs`.

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Instala Netlify CLI globalmente si no lo tienes:
   ```bash
   npm install -g netlify-cli
   ```

3. Inicia el servidor de desarrollo de Netlify (que correrá Vite y las funciones automáticamente):
   ```bash
   netlify dev
   ```

**Nota:** No uses `npm run dev` ya que esto solo levantará React pero las APIs de `/.netlify/functions/*` darán error 404.

## 📦 Cómo desplegar en Netlify

El proyecto está configurado y listo (vía `netlify.toml`) para ser desplegado instantáneamente en Netlify.

### Opción 1: A través de Github (Recomendado)
1. Sube este repositorio a GitHub.
2. Entra a tu cuenta de [Netlify](https://app.netlify.com/).
3. Toca en **"Add new site" -> "Import an existing project"**.
4. Selecciona tu repositorio de GitHub.
5. Los comandos de build se autodetectarán gracias al `netlify.toml` (`npm run build` y directorio `dist`).
6. Entra a las configuraciones de tu sitio en Netlify -> **Netlify Blobs** y asegúrate de que el sitio tiene habilitado el uso de Blobs (suele estar activado por defecto para funciones).
7. Haz clic en **Deploy Site**.

### Opción 2: CLI Directamente
Si prefieres saltarte GitHub:
1. Inicia sesión: `netlify login`
2. Despliega: `netlify deploy --prod`

## 📂 Dónde están las Funciones de Netlify

Las funciones severless que actúan como API REST se encuentran en la carpeta `netlify/functions/`:
- `profiles.ts`: Permite comprobar perfiles existentes y crear uno nuevo (usa el Blob store "profiles").
- `login.ts`: Valida las credenciales comprobando en "profiles".
- `records.ts`: Consulta y añade nuevos registros de alimentación en el Blob store "records" asociado a la ID de la mascota.
