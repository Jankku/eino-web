import { useEffect, useState } from 'react';
import { Box, LinearProgress, IconButton, Stack, Typography } from '@mui/material';
import { Link, useLocation, useSearchParams } from 'react-router';
import { Pagination } from '../../data/types';
import { getPaginationUrl } from '../../utils/paginationUtil';
import SmallSelect from './SmallSelect';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type ListPaginationProps = {
  pagination: Pagination;
  loading?: boolean;
  label?: string;
  actions?: React.ReactNode;
};

function PaginationProgress({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return visible ? <LinearProgress aria-label={`Loading ${label.toLowerCase()}`} /> : null;
}

export default function ListPagination({
  pagination,
  loading = false,
  label = 'List',
  actions,
}: ListPaginationProps) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, pageSize, total, totalPages } = pagination;
  const pageCount = Math.max(1, totalPages);
  const currentPage = Math.min(page, pageCount);
  const pageSizes = [...new Set([25, 50, 100, pageSize])].toSorted(
    (first, second) => first - second,
  );
  const firstItem = total === 0 || page > totalPages ? 0 : (page - 1) * pageSize + 1;
  const lastItem = firstItem === 0 ? 0 : Math.min(page * pageSize, total);

  return (
    <Stack component="section" aria-label={`${label} pagination`} spacing={1} sx={{ my: 1 }}>
      {loading ? <PaginationProgress label={label} /> : null}
      <Stack
        direction="row"
        sx={{
          display: { xs: 'grid', md: 'flex' },
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gridTemplateAreas: actions ? '"sort size" "count pages"' : '"count size" "pages pages"',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        {actions ? <Box sx={{ gridArea: 'sort', minWidth: 0 }}>{actions}</Box> : null}
        <Stack
          direction="row"
          sx={{
            display: { xs: 'contents', md: 'flex' },
            ml: 'auto',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            role="status"
            sx={{ gridArea: 'count', whiteSpace: 'nowrap', mr: 1 }}
          >
            {firstItem}–{lastItem} of {total}
          </Typography>
          <Box sx={{ gridArea: 'size', justifySelf: 'end', display: 'flex' }}>
            <SmallSelect
              compact
              label={`${label} items per page`}
              value={String(pageSize)}
              onChange={(event) => {
                setSearchParams((previous) => {
                  const next = new URLSearchParams(previous);
                  next.set('pageSize', event.target.value);
                  next.delete('page');
                  return next;
                });
              }}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </SmallSelect>
          </Box>
          <Stack
            component="nav"
            aria-label={`${label} pages`}
            direction="row"
            spacing={0}
            sx={{
              gridArea: 'pages',
              justifySelf: 'end',
              alignItems: 'center',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              '&:focus-within': { borderColor: 'primary.main' },
              '& .MuiInputBase-root': { height: { xs: 44, md: 30 }, borderRadius: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 0 },
            }}
          >
            <IconButton
              component={Link}
              to={getPaginationUrl({
                path: pathname,
                searchParams,
                page: Math.max(1, currentPage - 1),
              })}
              aria-label={`Previous ${label.toLowerCase()} page`}
              disabled={currentPage <= 1}
              sx={{
                borderRadius: 0,
                width: { xs: 44, md: 32 },
                height: { xs: 44, md: 30 },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <SmallSelect
              compact
              label={`${label} page`}
              value={String(currentPage)}
              onChange={(event) => {
                setSearchParams((previous) => {
                  const next = new URLSearchParams(previous);
                  next.set('page', event.target.value);
                  return next;
                });
              }}
            >
              {Array.from({ length: pageCount }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1} / {pageCount}
                </option>
              ))}
            </SmallSelect>
            <IconButton
              component={Link}
              to={getPaginationUrl({
                path: pathname,
                searchParams,
                page: Math.min(pageCount, currentPage + 1),
              })}
              aria-label={`Next ${label.toLowerCase()} page`}
              disabled={currentPage >= pageCount}
              sx={{
                borderRadius: 0,
                width: { xs: 44, md: 32 },
                height: { xs: 44, md: 30 },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
