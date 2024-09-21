import { Paper } from '@mui/material';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

type DropzoneProps = {
  options: DropzoneOptions;
  children: React.ReactNode;
};

export default function Dropzone({ options, children }: DropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone(options);
  return (
    <Paper
      {...getRootProps()}
      elevation={2}
      sx={(theme) => ({
        backgroundColor: 'grey.200',
        px: 1,
        py: 4,
        textAlign: 'center',
        cursor: 'pointer',
        ...theme.applyStyles('dark', {
          backgroundColor: '#25272c',
        }),
      })}
    >
      <input {...getInputProps()} />
      {children}
    </Paper>
  );
}
