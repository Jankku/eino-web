import type { Ref } from 'react';
import { Tooltip } from '@mui/material';
import { GridActionsCellItem, type GridActionsCellItemProps } from '@mui/x-data-grid';

type TooltipActionsCellItemProps = Extract<GridActionsCellItemProps, { label: string }> & {
  ref?: Ref<HTMLButtonElement>;
};

/**
 * Icon button action with its label as a tooltip.
 * Props injected by the actions cell (focus, ripple, click tracking) are forwarded to the item.
 */
export default function TooltipActionsCellItem({ label, ...props }: TooltipActionsCellItemProps) {
  return (
    <Tooltip title={label}>
      <GridActionsCellItem label={label} {...props} />
    </Tooltip>
  );
}
