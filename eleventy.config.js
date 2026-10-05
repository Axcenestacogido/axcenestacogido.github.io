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

export default function (eleventyConfig) {
  // CSS y cualquier archivo estatico se copian tal cual a la salida.
  eleventyConfig.addPassthroughCopy("src/assets");

  // Fecha legible en es-ES para las plantillas (articulos, portada).
  eleventyConfig.addFilter("fechaEs", (fecha) => {
    const d = fecha instanceof Date ? fecha : new Date(fecha);
    return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  });

  // Año actual, para el pie de página (© {% anio %}).
  eleventyConfig.addShortcode("anio", () => new Date().getFullYear());

  // Enlace de afiliado "correcto" para usar dentro de un articulo en Markdown:
  //   {% enlaceAfiliado "https://www.amazon.es/dp/ASIN?tag=tu-tag-21", "texto visible" %}
  // Lleva rel="sponsored nofollow" (lo pide Google para enlaces pagados/afiliados y es
  // ademas una condicion implicita del programa de Amazon Associates) y se abre en
  // pestaña nueva para no sacar al lector del articulo.
  eleventyConfig.addShortcode("enlaceAfiliado", (url, texto) => {
    if (!url || !texto) {
      throw new Error('enlaceAfiliado necesita {% enlaceAfiliado "URL", "texto" %}');
    }
    return `<a href="${url}" rel="sponsored nofollow noopener" target="_blank">${texto}</a>`;
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
