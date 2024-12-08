import { Box, Typography } from '@mui/material';

type CodeBlockProps = {
  children: React.ReactNode;
};

export default function CodeBlock({ children }: CodeBlockProps) {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: '#eee',
        wordBreak: 'break-all',
        lineBreak: 'anywhere',
        whiteSpace: 'pre-wrap',
        px: 2,
        py: 1,
        borderRadius: 2,
        ...theme.applyStyles('dark', {
          backgroundColor: '#303030',
        }),
      })}
    >
      <Typography
        sx={{
          fontFamily: 'monospace',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
