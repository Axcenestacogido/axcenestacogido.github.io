# Perro Senior en Casa — blog de afiliación

Blog estático (Eleventy) sobre ayudas de movilidad para perros mayores, con enlaces de afiliado de
Amazon.es. Se publica gratis en GitHub Pages: **https://axcenestacogido.github.io/**

- Código fuente: `proyectos/blog-afiliacion/` dentro del repositorio de Axcencorp.
- Repositorio publicado: `github.com/Axcenestacogido/axcenestacogido.github.io` (solo este
  proyecto). Cada push a `main` lo construye y despliega el workflow `.github/workflows/deploy.yml`.
- Plan, reglas y cumplimiento del negocio: `vault/30-Conocimiento/blog-afiliacion/_indice.md`.

## Uso

```bash
npm install
npm run dev     # previsualización local con recarga
npm run build   # genera _site/
```

## Escribir un artículo

Copia `plantillas/articulo-ejemplo.md` a `src/articulos/<slug>.md` y rellena el front matter
(`title`, `metaDescripcion`, `fechaPublicacion`, `permalink`, `tags: articulo`). La plantilla está
fuera de `src/` a propósito: así no se publica.

Enlaces a productos, siempre con el shortcode (nunca un `<a>` a mano):

```njk
{% enlaceAfiliado "https://www.amazon.es/dp/B0XXXXXXXX", "Nombre del producto" %}
```

- Pone `rel="sponsored nofollow"` y añade el tag de `site.amazonTag` (`src/_data/site.js`).
- Si el ASIN es un marcador (`ASIN`, `EJEMPLO-ASIN-3`…), genera una búsqueda en Amazon.es por el
  nombre del producto: el sitio nunca publica un enlace roto. Cambia el marcador por el ASIN real
  cuando lo tengas.
- No pongas precios fijos en el texto: Amazon los cambia sin aviso.

## Lo que falta y es del dueño

1. **Alta en Amazon Afiliados (amazon.es)** con la URL del sitio ya publicado. Al recibir el tag
   (p. ej. `nombre-21`), ponerlo en `amazonTag` de `src/_data/site.js`: todos los enlaces lo
   llevan a partir del siguiente despliegue. Desde el alta corren **180 días para 3 ventas**.
2. **Revisar los 7 artículos** del lote piloto antes de darlos por definitivos.
3. **Nombre del sitio**: "Perro Senior en Casa" es provisional; se cambia en `site.nombre`.
4. **Aviso legal**: si el sitio empieza a generar ingresos, la LSSI pide identificar al titular
   (nombre, NIF y un correo) en `src/privacidad.md`. No se ha puesto ningún dato personal.
5. **AdSense** (cuando haya tráfico): pegar su script en `src/_includes/layouts/base.njk`, y
   actualizar la página de privacidad y añadir el aviso de cookies **antes** de activarlo.
6. Opcional: dominio propio (~10-11 USD/año) — es gasto, necesita tu sí.

## Publicar cambios

El repositorio publicado contiene solo esta carpeta. Desde la raíz de Axcencorp:

```bash
git subtree push --prefix proyectos/blog-afiliacion blog main
```

(el remoto `blog` apunta a `https://github.com/Axcenestacogido/axcenestacogido.github.io.git`).
