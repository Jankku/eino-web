import { useRef, useState } from 'react';
import { Tooltip, Typography, type TypographyProps } from '@mui/material';

type TruncatedTextProps = Omit<TypographyProps, 'noWrap'> & {
  /** Disable truncation, rendering wrapped text without a tooltip */
  multiline?: boolean;
};

/**
 * Single-line text that shows its full content in a tooltip when truncated.
 */
export default function TruncatedText({ children, multiline, ...props }: TruncatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  if (multiline) {
    return <Typography {...props}>{children}</Typography>;
  }

  const handleOpen = () => {
    const el = ref.current;
    if (el && el.scrollWidth > el.clientWidth) setOpen(true);
  };

  return (
    <Tooltip title={children} open={open} onOpen={handleOpen} onClose={() => setOpen(false)}>
      <Typography ref={ref} noWrap {...props}>
        {children}
      </Typography>
    </Tooltip>
  );
}
