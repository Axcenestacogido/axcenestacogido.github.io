# Blog de afiliación (Amazon Associates + AdSense) — esqueleto técnico

Esqueleto local de un blog de nicho con afiliación, listo para generar páginas a partir de
artículos en Markdown y desplegarse **gratis** en GitHub Pages (subdominio `usuario.github.io`,
sin dominio propio).

Es un negocio **independiente** del resto de Axcencorp (print-on-demand, Nexora, KDP, YouTube):
vive en esta carpeta separada solo porque de momento no tiene repositorio propio. El plan y las
reglas del negocio (Amazon Associates, AdSense, cumplimiento legal) están en
`vault/30-Conocimiento/blog-afiliacion/_indice.md`, en el repositorio de Axcencorp.

## Por qué Eleventy (11ty) y no Jekyll/Hugo/Astro

- **Jekyll** es el generador "nativo" de GitHub Pages (se construye solo, sin Action), pero
  exige Ruby + Bundler. Esta máquina de desarrollo (Windows) no tiene Ruby instalado, y añadir
  esa dependencia solo para esto habría sido más mantenimiento, no menos — justo lo contrario de
  lo que pedía el encargo.
- **Hugo** exige descargar e instalar un binario de Go aparte.
- **Astro** es más pesado para lo que hace falta aquí: convertir Markdown en HTML con una
  plantilla fija y poco más. Tiene su propio runtime de render, islas de componentes, etc. —
  capacidad que este sitio no necesita.
- Esta máquina ya tiene **Node y npm** instalados y en uso por el resto de Axcencorp. Eleventy es
  "`npm install` y listo": sin build de JS, sin framework de componentes, un solo archivo de
  configuración (`eleventy.config.js`), Markdown con Nunjucks para las plantillas.
- La contrapartida: GitHub Pages no construye Eleventy de forma nativa, así que el despliegue
  necesita un workflow de GitHub Actions (incluido en `.github/workflows/deploy.yml`) que corre
  `npm run build` y publica `_site/`. Es el patrón que GitHub documenta para cualquier
  generador no nativo.

## Estructura

```
proyectos/blog-afiliacion/
├── package.json              # dependencia: @11ty/eleventy
├── eleventy.config.js        # configuración de 11ty (carpetas, shortcodes, filtros)
├── src/
│   ├── index.njk              # página de inicio (lista los artículos)
│   ├── articulos/
│   │   └── ejemplo-articulo.md   # PLANTILLA de artículo — no es contenido real, bórrala o
│   │                              # cópiala al escribir el primer artículo de verdad
│   ├── _includes/layouts/
│   │   ├── base.njk           # HTML base: head, cabecera, pie con el disclosure de Amazon
│   │   └── articulo.njk       # plantilla de artículo: título, fecha, disclosure arriba del
│   │                            # cuerpo, hueco de contenido
│   ├── _data/site.js          # datos globales del sitio (nombre, descripción, URL, disclosure)
│   └── assets/css/style.css   # estilos mínimos
└── .github/workflows/deploy.yml  # workflow de despliegue a GitHub Pages (ver nota abajo)
```

## Cómo se cumple cada requisito del encargo

- **Meta descripción**: campo `metaDescripcion` en el front matter de cada artículo, usado en
  `<meta name="description">` (ver `src/_includes/layouts/base.njk`).
- **Enlaces de afiliado con `rel="sponsored nofollow"`**: shortcode `enlaceAfiliado` (definido en
  `eleventy.config.js`), documentado con un ejemplo de uso en `src/articulos/ejemplo-articulo.md`.
  No se escriben enlaces `<a>` de afiliado a mano para no olvidar el atributo.
- **Disclosure obligatorio de Amazon Associates**: texto exacto exigido por el programa
  ("As an Amazon Associate I earn from qualifying purchases", en español en `src/_data/site.js`,
  campo `disclosureAmazon`). Se inserta automáticamente **dos veces**: arriba de cada artículo
  (lo exige la normativa de disclosure de la FTC y la Directiva Ómnibus de la UE — "cerca del
  enlace o al principio del contenido") y en el pie de cada página.
- **Página de inicio simple**: `src/index.njk`, lista los artículos publicados por fecha.

## Build y comprobación local (ya verificado)

```bash
cd proyectos/blog-afiliacion
npm install
npm run build      # genera proyectos/blog-afiliacion/_site/
npm run dev         # servidor local con recarga en vivo, para previsualizar
npm run clean        # borra _site/ (no usar rm -rf a mano, ver nota de permisos del proyecto)
```

El `npm run build` se ejecutó y verificó al construir este esqueleto (dos páginas generadas sin
error: la portada y el artículo de ejemplo). `_site/` no se versiona (está en `.gitignore`): se
regenera siempre con `npm run build`.

## Qué falta por decidir (no es parte de este encargo técnico)

- El **nicho** y el nombre definitivo del sitio (`site.nombre`, `site.descripcion` en
  `src/_data/site.js` son placeholders). Lo decide `estratega-blog-afiliacion`.
- El **tag de afiliado de Amazon** (`?tag=tu-tag-21` en el ejemplo) — se obtiene al dar de alta
  Amazon Associates.
- El script de **Google AdSense** (verificación del sitio y, tras la aprobación, los anuncios):
  deliberadamente no está incluido, para no declarar un ID de AdSense que todavía no existe
  (ver comentario `TODO` en `src/_includes/layouts/base.njk`).
- Los **artículos de contenido real**: no es tarea de este esqueleto técnico, los escribe el
  agente redactor.

---

## Pasos manuales que le quedan al dueño para publicarlo de verdad

La sesión de `gh` (GitHub CLI) disponible en esta máquina es **solo lectura** de la cuenta del
dueño: no se ha creado ningún repositorio remoto, no se ha hecho push y no se ha tocado la
configuración de GitHub Pages de ninguna cuenta. Todo lo anterior está solo en esta carpeta,
dentro del repositorio local de Axcencorp, commiteado localmente.

El usuario de GitHub autenticado en esta máquina es **`Axcenestacogido`** (comprobado con
`gh api user`, solo lectura). Hoy **no existe** ningún repositorio `Axcenestacogido.github.io`
en esa cuenta (comprobado con `gh repo list`), así que el nombre está libre.

1. **Crear el repositorio nuevo en GitHub**, con el nombre EXACTO:

   ```
   Axcenestacogido.github.io
   ```

   Ese nombre exacto es obligatorio: es la convención especial de GitHub Pages para una
   "página de usuario", la única que se sirve en la raíz del subdominio
   (`https://axcenestacogido.github.io/`, sin ninguna ruta extra detrás). Cualquier otro nombre
   de repositorio publicaría el sitio en `https://axcenestacogido.github.io/nombre-del-repo/`
   (una "página de proyecto"), que también es gratis pero no es lo que se pidió ("tipo
   usuario.github.io"). Puede crearse privado o público — GitHub Pages funciona con ambos en
   cuentas con GitHub Pro/Team/Enterprise; en cuentas gratuitas personales **tiene que ser
   público** para poder activar Pages.

2. **Copiar el contenido de esta carpeta a la raíz de ese repositorio nuevo** (no como
   subcarpeta): todo lo que hay dentro de `proyectos/blog-afiliacion/` — incluido
   `.github/workflows/deploy.yml`, que debe quedar en `.github/workflows/deploy.yml` en la raíz
   del repo nuevo para que GitHub Actions lo detecte y lo ejecute. No copiar `node_modules/` ni
   `_site/` (se regeneran con `npm install` y `npm run build`).

3. **Hacer push** de ese contenido a la rama `main` del repositorio nuevo. El workflow de
   despliegue está configurado para dispararse automáticamente con cada push a `main`.

4. **Activar GitHub Pages** en la configuración del repositorio nuevo: `Settings` → `Pages` →
   en "Build and deployment", `Source` = **"GitHub Actions"** (no "Deploy from a branch" — ese
   modo serviría para Jekyll sin build, pero aquí el sitio lo construye el workflow). Con el
   repositorio llamado `Axcenestacogido.github.io`, GitHub activa el subdominio automáticamente
   en cuanto el primer despliegue del workflow termina bien.

5. **Verificar**: entrar a `https://axcenestacogido.github.io/` y comprobar que carga la
   portada y el artículo de ejemplo. Revisar en la pestaña "Actions" del repositorio que el
   workflow `Desplegar a GitHub Pages` terminó en verde.

6. Cuando haya nicho y tag de afiliado decididos: editar `src/_data/site.js` (nombre,
   descripción, URL si cambia) y sustituir/borrar `src/articulos/ejemplo-articulo.md` por
   artículos reales.

Nada de esto requiere gasto: GitHub Pages para un repositorio de usuario y GitHub Actions para
un repositorio público son gratuitos sin límite de uso razonable.
