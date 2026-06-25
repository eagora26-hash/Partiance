'use client';

import { useEffect } from 'react';

/**
 * Last-resort boundary for errors thrown in the ROOT layout (outside any locale
 * segment). Must render its own <html>/<body>. Kept minimal and dependency-free.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('app.global_error', error);
  }, [error]);

  return (
    <html lang="it">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#04080A',
          color: '#E8F1F2',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>
            Qualcosa è andato storto
          </h1>
          <p style={{ fontSize: 14, color: '#8AA0A2', margin: '0 0 24px', lineHeight: 1.6 }}>
            Si è verificato un errore imprevisto. Riprova tra un momento.
          </p>
          <button
            onClick={reset}
            style={{
              height: 44,
              padding: '0 20px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#04080A',
              background: 'linear-gradient(115deg,#14C8BC,#2EF2DE,#5BD8FF)',
            }}
          >
            Riprova
          </button>
          {error.digest && (
            <p style={{ fontSize: 11, color: '#5C6E70', marginTop: 20 }}>ref: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
