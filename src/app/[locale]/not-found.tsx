import { getLocale } from 'next-intl/server';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';

export default async function NotFound() {
  const locale = await getLocale();
  const isIt = locale === 'it';

  return (
    <>
      <AmbientBackground />
      <main className="grid min-h-dvh place-items-center px-6">
        <div className="text-center">
          <Logo className="mx-auto" />
          <p className="mt-10 bg-ink-fade bg-clip-text text-[5rem] font-bold leading-none text-transparent tnum">
            404
          </p>
          <h1 className="mt-2 text-h4 font-semibold text-ink">
            {isIt ? 'Pagina non trovata' : 'Page not found'}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-body-sm text-muted">
            {isIt
              ? 'La pagina che cerchi non esiste o è stata spostata. Torniamo a costruire.'
              : "The page you're looking for doesn't exist or has moved. Let's get back to building."}
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/" size="lg">
              {isIt ? 'Torna alla home' : 'Back to home'}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
