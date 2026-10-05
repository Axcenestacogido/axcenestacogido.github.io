// Configuracion de Eleventy (11ty) para el blog de afiliacion.
//
// Por que Eleventy y no Jekyll/Hugo/Astro:
// - Jekyll es "nativo" en GitHub Pages (no hace falta Action), pero exige Ruby + Bundler.
//   Esta maquina de desarrollo (Windows) no tiene Ruby instalado, y anadir esa dependencia
//   solo para esto es mas mantenimiento, no menos.
// - Hugo exige descargar e instalar un binario de Go aparte; Astro es mas pesado (necesita
//   su propio runtime de render y mas configuracion) para lo que aqui hace falta: convertir
//   Markdown en HTML con una plantilla fija.
// - Esta maquina ya tiene Node y npm (los usa el resto de Axcencorp). Eleventy es "npm install
//   y listo": sin build de JS, sin framework de componentes, un solo archivo de configuracion.
//   GitHub Pages no lo sirve de forma nativa, asi que el despliegue usa un workflow de GitHub
//   Actions (incluido en .github/workflows/deploy.yml) que corre `npm run build` y publica
//   la carpeta _site. Es el mismo patron que GitHub recomienda para cualquier generador no
//   nativo (Hugo, Next export, etc.).

import site from "./src/_data/site.js";

export default function (eleventyConfig) {
  // CSS y cualquier archivo estatico se copian tal cual a la salida.
  eleventyConfig.addPassthroughCopy("src/assets");

  // Fecha legible en es-ES. En UTC: una fecha de front matter (2026-10-05) es medianoche UTC y,
  // en un runner o un equipo al oeste de Greenwich, salia como el dia anterior.
  eleventyConfig.addFilter("fechaEs", (fecha) => {
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  });

  // Fecha ISO (AAAA-MM-DD) para el sitemap.
  eleventyConfig.addFilter("fechaIso", (fecha) => {
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    return d.toISOString().slice(0, 10);
  });

  // Año actual, para el pie de página (© {% anio %}).
  eleventyConfig.addShortcode("anio", () => new Date().getFullYear());

  // Enlace de afiliado para usar dentro de un articulo en Markdown:
  //   {% enlaceAfiliado "https://www.amazon.es/dp/B0XXXXXXXX", "texto visible" %}
  // - Lleva rel="sponsored nofollow" (lo pide Google para enlaces de afiliado).
  // - El tag sale de site.amazonTag: no se escribe en cada articulo. Si aun no hay tag, el
  //   enlace va sin el.
  // - Si el ASIN es un marcador ("ASIN", "EJEMPLO-ASIN-3"...), el enlace es una busqueda en
  //   Amazon por el texto visible: asi el sitio publicado nunca tiene un enlace roto.
  eleventyConfig.addShortcode("enlaceAfiliado", (url, texto) => {
    if (!url || !texto) {
      throw new Error('enlaceAfiliado necesita {% enlaceAfiliado "URL", "texto" %}');
    }
    const tag = site.amazonTag ?? "";
    let destino;
    const u = new URL(url);
    const asin = /\/dp\/([^/?]+)/.exec(u.pathname)?.[1] ?? "";
    if (!asin || /ASIN|EJEMPLO/i.test(asin)) {
      destino = new URL(`https://${u.hostname}/s`);
      destino.searchParams.set("k", texto.replace(/<[^>]*>/g, ""));
    } else {
      destino = new URL(`https://${u.hostname}/dp/${asin}`);
    }
    if (tag) destino.searchParams.set("tag", tag);
    const escapar = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    return `<a href="${escapar(destino.toString())}" rel="sponsored nofollow noopener" target="_blank">${texto}</a>`;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    // Markdown -> HTML con Nunjucks dentro del Markdown (para poder usar {% raw %}, includes, etc.)
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // Sitio pensado para publicarse como pagina de usuario (usuario.github.io), que sirve
    // en la RAIZ del dominio. Si en el futuro se publica como "pagina de proyecto"
    // (usuario.github.io/nombre-repo), hay que fijar aqui pathPrefix: "/nombre-repo".
    pathPrefix: "/",
  };
}
