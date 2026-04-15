'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sendContactMessage } from '@/lib/firebase-services'
import { Locale } from '@/data/types'

export function ContactForm() {
  const t = useTranslations('contact')
  const locale = useLocale() as Locale
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const result = await sendContactMessage({ ...formData, locale })
    if (result.success) {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } else {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{t('form')}</CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">{t('sent')}</h3>
            <p className="mb-6 text-muted-foreground">{t('thanks')}</p>
            <Button variant="outline" onClick={() => setStatus('idle')}>
              {t('another')}
            </Button>
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">{t('errorTitle')}</h3>
            <p className="mb-6 text-muted-foreground">{t('errorDesc')}</p>
            <Button variant="outline" onClick={() => setStatus('idle')}>
              {t('retry')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t('name')}
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t('namePh')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t('email')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('emailPh')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                {t('subject')}
              </label>
              <Input
                id="subject"
                name="subject"
                placeholder={t('subjectPh')}
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={status === 'loading'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                {t('message')}
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder={t('messagePh')}
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
                disabled={status === 'loading'}
              />
            </div>
            <Button
              type="submit"
              className="w-full gap-2 sm:w-auto"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('sending')}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t('send')}
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
