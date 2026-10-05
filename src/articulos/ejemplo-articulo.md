---
layout: layouts/articulo.njk
tags: articulo
title: "[PLANTILLA] Título del artículo (editar o borrar este archivo de ejemplo)"
metaDescripcion: "Meta descripción de ejemplo: resume el artículo en 150-160 caracteres para el resultado de búsqueda de Google."
fechaPublicacion: 2026-10-05
permalink: /articulos/ejemplo-articulo/
---

Este archivo **no es contenido real**: es la plantilla que debe seguir el agente redactor
(`redactor-blog-afiliacion`, ver `vault/30-Conocimiento/blog-afiliacion/_indice.md`) al escribir
un artículo nuevo. Bórralo o sustitúyelo cuando llegue el primer artículo de verdad.

## Cómo crear un artículo nuevo

1. Copia este archivo dentro de `src/articulos/` con un nombre descriptivo
   (`src/articulos/mi-articulo.md`).
2. Rellena el front matter (`title`, `metaDescripcion`, `fechaPublicacion`, `permalink`).
3. Escribe el cuerpo en Markdown normal.
4. Para cualquier enlace de afiliado, usa el shortcode `enlaceAfiliado` — nunca un `<a>` a
   mano, porque este shortcode ya añade `rel="sponsored nofollow"`:

   {% enlaceAfiliado "https://www.amazon.es/dp/ASIN?tag=tu-tag-21", "nombre del producto" %}

   (sustituye la URL de ejemplo por la del producto real, con tu tag de afiliado de Amazon
   Associates).

5. No cites el precio como un dato fijo en el texto: Amazon lo cambia sin aviso y es una
   condición del programa no "congelarlo" en el artículo.
6. La declaración de afiliación de Amazon Associates ya se añade **automáticamente** arriba de
   cada artículo (la pone la plantilla `layouts/articulo.njk`): no hace falta escribirla a mano.

## Build local

Desde `proyectos/blog-afiliacion/`:

```
npm install
npm run build    # genera _site/
npm run dev       # servidor local con recarga en vivo
```
