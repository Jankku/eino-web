import { CircularProgress, Stack } from '@mui/material';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PageFallback from './PageFallback';

function Wait({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReady(true);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return <>{ready ? children : undefined}</>;
}

function PageBoundary({ children }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={PageFallback}>
          <Suspense
            fallback={
              <Wait>
                <Stack justifyContent="center" alignItems="center" mt={10}>
                  <CircularProgress />
                </Stack>
              </Wait>
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default PageBoundary;
