import { CircularProgress, Stack } from '@mui/material';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
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

/**
 * Error and suspense boundary for a page. Without children it renders the
 * matched child route, so it can be used as a layout route element.
 */
function PageBoundary({ children }: PageBoundaryProps) {
  // A layout boundary is shared by sibling routes, so clear errors on navigation.
  const { pathname } = useLocation();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
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
      )}
    </QueryErrorResetBoundary>
  );
}

export default PageBoundary;
