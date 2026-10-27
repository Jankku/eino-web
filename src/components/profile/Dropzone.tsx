import { Paper, SxProps, Theme } from '@mui/material';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

type DropzoneProps = {
  options: DropzoneOptions;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function Dropzone({ options, children, sx = [] }: DropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone(options);
  return (
    <Paper
      {...getRootProps()}
      elevation={2}
      sx={[
        (theme) => ({
          backgroundColor: 'grey.200',
          px: 1,
          py: 4,
          textAlign: 'center',
          cursor: 'pointer',
          ...theme.applyStyles('dark', {
            backgroundColor: '#25272c',
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <input {...getInputProps()} />
      {children}
    </Paper>
  );
}
