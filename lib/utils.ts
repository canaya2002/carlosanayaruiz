import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Locale } from '@/data/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string, locale: Locale = 'es'): string {
  const localeMap: Record<Locale, string> = { es: 'es-MX', en: 'en-US' }
  /* timeZone UTC no es opcional: la entrada es una fecha civil sin hora
     («2026-08-24»), que Date interpreta como medianoche UTC. Sin fijar la
     zona, toLocaleDateString la traslada a la local y en CDMX (UTC−6)
     imprime el día anterior. */
  return new Date(date).toLocaleDateString(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatShortDate(date: string, locale: Locale = 'es'): string {
  const parts = date.split('-')
  if (parts.length < 2) return date
  const [year, month] = parts
  const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const months = locale === 'en' ? monthsEn : monthsEs
  return `${months[parseInt(month) - 1]}. ${year}`
}
