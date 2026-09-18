import SampleTag from '../components/SampleTag'
import { site } from '../data/site'

function LeafMark(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M4 20c1-8 7-14 15-15-1 8-7 14-15 15Z" fill="currentColor" />
      <path
        d="M5.5 18.5C9 15 13 11 18.5 5.5"
        className="stroke-soil"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46H16.5V4.35A20 20 0 0 0 14.2 4.2c-2.28 0-3.84 1.39-3.84 3.94v2.36H8v3h2.36V21h3.14Z" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 4l7.1 9.3L4.3 20H6.9l5.5-5.9L17 20h3l-7.4-9.7L19.6 4H17l-5 5.4L9.1 4H4Z" />
    </svg>
  )
}

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.8L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.13h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2Zm0 1.8c2.15 0 4.17.83 5.68 2.35a7.98 7.98 0 0 1 2.36 5.76c0 4.47-3.64 8.11-8.05 8.11a8 8 0 0 1-4.09-1.12l-.29-.17-3.03.76.8-2.95-.19-.3a7.99 7.99 0 0 1-1.24-4.31c0-4.47 3.65-8.13 8.05-8.13Z" />
    </svg>
  )
}

const whatsappHref = `https://wa.me/${site.whatsappNumber}`

const socialLinks = [
  { label: 'Instagram', href: site.social.instagram, icon: InstagramIcon },
  { label: 'Facebook', href: site.social.facebook, icon: FacebookIcon },
  { label: 'X (Twitter)', href: site.social.x, icon: XIcon },
  { label: 'WhatsApp', href: whatsappHref, icon: WhatsAppIcon },
]

const quickLinks = [
  { label: 'Build your box', href: '#combo-builder' },
  { label: 'Plans', href: '#plans' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Farms', href: '#farm-story' },
  { label: 'FAQ', href: '#faq' },
]

const legalLinks = [
  { label: 'Privacy policy', href: site.legal.privacy },
  { label: 'Terms of service', href: site.legal.terms },
  { label: 'Refund policy', href: site.legal.refund },
]

const linkClass = 'text-cream/70 transition-colors hover:text-lime'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-soil text-cream/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <LeafMark className="h-6 w-6 text-lime" />
              <span className="font-heading text-lg font-semibold text-cream">{site.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-cream/70">
              Organic vegetables, greens and fruit, delivered fresh from farms we know by name —
              every morning, before 8 am.
            </p>
            <div className="mt-5 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream/70 transition-colors hover:bg-lime hover:text-soil"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-cream">Explore</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-cream">Contact</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a href={`tel:${site.phone.tel}`} className={linkClass}>
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
              <li>
                <a href={whatsappHref} target="_blank" rel="noreferrer noopener" className={linkClass}>
                  WhatsApp us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-cream">Legal</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            FSSAI Lic. No. {site.fssaiLicence}
            <SampleTag />
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
