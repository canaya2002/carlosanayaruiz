'use client'

import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations, useLocale } from 'next-intl'
import { subscribeNewsletter } from '@/lib/firebase-services'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')
  const t = useTranslations('newsletter')
  const locale = useLocale()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    const result = await subscribeNewsletter(email, locale)
    if (result.success) {
      setStatus(result.alreadySubscribed ? 'already' : 'success')
      setEmail('')
    } else {
      setStatus('error')
    }
  }

  return (
    <section className="border-t bg-muted/30 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight">{t('title')}</h2>
          <p className="mb-6 text-muted-foreground">{t('subtitle')}</p>

          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              <span>{t('thankYou')}</span>
            </div>
          ) : status === 'already' ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <CheckCircle className="h-5 w-5" />
              <span>{t('alreadySubscribed')}</span>
            </div>
          ) : status === 'error' ? (
            <div>
              <div className="mb-3 flex items-center justify-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{t('error')}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
                {t('tryAgain')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <Input type="email" placeholder={t('placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1" disabled={status === 'loading'} />
              <Button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : t('subscribe')}
              </Button>
            </form>
          )}
          <p className="mt-4 text-xs text-muted-foreground">{t('noSpam')}</p>
        </div>
      </div>
    </section>
  )
}
