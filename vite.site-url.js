// Social crawlers (WhatsApp, Facebook, X) need an absolute og:image URL.
// The public domain is not known at build time, so it is read from the host:
//   SITE_URL                         - set this yourself, e.g. https://freshley.in
//   VERCEL_PROJECT_PRODUCTION_URL    - provided automatically by Vercel builds
// With neither set, the tags fall back to root-relative paths and og:url is
// omitted; the page still works, but social previews won't show the image.
export function siteUrlPlugin() {
  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : ''
  const site = (process.env.SITE_URL || fromVercel).replace(/\/+$/, '')

  return {
    name: 'site-url',
    transformIndexHtml(html) {
      return {
        html: html.replaceAll('__SITE_URL__', site),
        tags: site
          ? [{ tag: 'meta', attrs: { property: 'og:url', content: `${site}/` }, injectTo: 'head' }]
          : [],
      }
    },
  }
}
