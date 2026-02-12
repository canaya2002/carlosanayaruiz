import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Github, Linkedin, Mail } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'

export function Footer() {
  const t = useTranslations('footer')
  const tn = useTranslations('nav')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand + NAP */}
          <div className="md:col-span-2">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Carlos Anaya Ruíz
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t('description')}
            </p>
            <div className="mt-4 flex gap-4">
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.github1} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-muted-foreground transition-colors hover:text-primary" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold">{t('navigation')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">{tn('home')}</Link></li>
              <li><Link href="/libros" className="text-sm text-muted-foreground transition-colors hover:text-primary">{tn('books')}</Link></li>
              <li><Link href="/sobre-mi" className="text-sm text-muted-foreground transition-colors hover:text-primary">{tn('about')}</Link></li>
              <li><Link href="/contacto" className="text-sm text-muted-foreground transition-colors hover:text-primary">{tn('contact')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">{t('contactTitle')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  {SOCIAL_LINKS.email}
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.fiverr} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Fiverr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Carlos Anaya Ruíz. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  )
}
