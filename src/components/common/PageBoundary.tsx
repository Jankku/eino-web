import { CircularProgress, Stack } from '@mui/material';
import { QueryErrorResetBoundary, useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import PageFallback from './PageFallback';

function Wait({ children }: { children: React.ReactNode }) {
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

type PageBoundaryProps = {
  children?: React.ReactNode;
};

function PageBoundary({ children }: PageBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      <PageErrorBoundary>{children}</PageErrorBoundary>
    </QueryErrorResetBoundary>
  );
}

function PageErrorBoundary({ children }: PageBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();
  const { pathname } = useLocation();

  // Failed queries keep their error in the cache, and suspense queries rethrow it on mount
  // instead of refetching until the boundary is reset. Reset on every path change (and on
  // mount) before the page renders, so navigating to a page retries its failed queries.
  const [resetPathname, setResetPathname] = useState<string | null>(null);
  if (resetPathname !== pathname) {
    setResetPathname(pathname);
    reset();
  }

  return (
    <ErrorBoundary onReset={reset} resetKeys={[pathname]} FallbackComponent={PageFallback}>
      <Suspense
        fallback={
          <Wait>
            <Stack
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                mt: 10,
              }}
            >
              <CircularProgress />
            </Stack>
          </Wait>
        }
      >
        {children ?? <Outlet />}
      </Suspense>
    </ErrorBoundary>
  );
}

export default PageBoundary;
