import { Paper, SxProps, Theme } from '@mui/material';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

type DropzoneProps = {
  options: DropzoneOptions;
  label: string;
  children: React.ReactNode;
  compact?: boolean;
  sx?: SxProps<Theme>;
};

export default function Dropzone({
  options,
  label,
  children,
  compact = false,
  sx = [],
}: DropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone(options);
  return (
    <Paper
      {...getRootProps({ role: 'button', 'aria-label': label, 'aria-disabled': options.disabled })}
      elevation={0}
      sx={[
        {
          p: compact ? 2 : 3,
          border: '1px dashed',
          borderColor: compact ? 'divider' : 'primary.main',
          borderRadius: 2,
          backgroundColor: 'action.hover',
          textAlign: compact ? 'left' : 'center',
          cursor: 'pointer',
          transition: 'border-color 150ms, background-color 150ms',
          '&:hover, &:focus-visible': {
            borderColor: 'primary.main',
            backgroundColor: 'action.selected',
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 3,
          },
          '&[aria-disabled="true"]': { opacity: 0.6, cursor: 'default' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <input {...getInputProps({ 'aria-hidden': true, tabIndex: -1 })} />
      {children}
    </Paper>
  );
}
