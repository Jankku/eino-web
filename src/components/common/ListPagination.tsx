import {
  LinearProgress,
  Pagination as PaginationControl,
  PaginationItem,
  Stack,
  Typography,
} from '@mui/material';
import { Link, useLocation, useSearchParams } from 'react-router';
import { Pagination } from '../../data/types';
import { getPaginationUrl } from '../../utils/paginationUtil';
import SmallSelect from './SmallSelect';
import { useIsMobile } from '../../hooks/useIsMobile';

type ListPaginationProps = {
  pagination: Pagination;
  loading?: boolean;
  label?: string;
};

export default function ListPagination({
  pagination,
  loading = false,
  label = 'List',
}: ListPaginationProps) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { page, pageSize, total, totalPages } = pagination;
  const pageSizes = [...new Set([25, 50, 100, pageSize])].sort(
    (first, second) => first - second,
  );
  const firstItem = total === 0 || page > totalPages ? 0 : (page - 1) * pageSize + 1;
  const lastItem = firstItem === 0 ? 0 : Math.min(page * pageSize, total);

  return (
    <Stack component="section" aria-label={`${label} pagination`} spacing={1} sx={{ my: 1 }}>
      {loading ? <LinearProgress aria-label={`Loading ${label.toLowerCase()}`} /> : null}
      <Stack
        direction="row"
        sx={{ flexWrap: 'wrap', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}
      >
        <Typography variant="body2" role="status">
          {firstItem}–{lastItem} of {total}
        </Typography>
        <SmallSelect
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
      </Stack>
      <PaginationControl
        aria-label={`${label} pages`}
        showFirstButton={!isMobile}
        showLastButton={!isMobile}
        size={isMobile ? 'small' : 'medium'}
        page={Math.min(page, Math.max(1, totalPages))}
        count={totalPages}
        boundaryCount={0}
        siblingCount={isMobile ? 0 : 1}
        sx={isMobile ? { '& .MuiPaginationItem-root': { minWidth: 44, minHeight: 44 } } : undefined}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={getPaginationUrl({ path: pathname, searchParams, page: item.page || 1 })}
            {...item}
          />
        )}
      />
    </Stack>
  );
}
