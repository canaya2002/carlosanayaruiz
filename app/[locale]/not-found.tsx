import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <p className="mb-8 text-xl text-muted-foreground">Page not found / Página no encontrada</p>
      <Button asChild>
        <Link href="/">Go Home / Ir al Inicio</Link>
      </Button>
    </div>
  )
}
