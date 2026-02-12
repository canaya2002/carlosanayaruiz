'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Locale } from '@/data/types'

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const t = useTranslations('language')
  const pathname = usePathname()
  const router = useRouter()

  const targetLocale = locale === 'es' ? 'en' : 'es'

  const handleSwitch = () => {
    router.replace(pathname, { locale: targetLocale })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSwitch}
      className="gap-2 text-sm font-medium"
      aria-label={`${t('label')}: ${t('switchTo')}`}
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{t('switchTo')}</span>
      <span className="sm:hidden">{targetLocale.toUpperCase()}</span>
    </Button>
  )
}
