import { CircularProgress, Stack } from '@mui/material';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PageFallback from './PageFallback';

function PageBoundary({ children }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={PageFallback}>
          <Suspense
            fallback={
              <Stack justifyContent="center" alignItems="center" mt={10}>
                <CircularProgress />
              </Stack>
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
