import { useEffect, useId, useRef, useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getCountAxis } from '../../../utils/chartUtils';

type BarChartProps = {
  labels: (number | string)[];
  data: number[];
  onClick: (index: number) => void;
};

const formatter = new Intl.NumberFormat();

export function BarChart({ labels, data, onClick }: BarChartProps) {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.only('xs'));
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const axis = getCountAxis(data);
  const height = width / (matchesXs ? 1.4 : 2);
  const left = Math.max(32, formatter.format(axis.max).length * 8 + 12);
  const top = 24;
  const bottom = height - 48;
  const plotWidth = width - left - 12;
  const plotHeight = bottom - top;
  const columnWidth = plotWidth / Math.max(1, labels.length);
  const y = (count: number) => bottom - (count / axis.max) * plotHeight;

  return (
    <Box role="group" aria-labelledby={titleId} sx={{ width: '100%', minWidth: 0 }}>
      <Typography
        id={titleId}
        component="h3"
        sx={{ m: 0, textAlign: 'center', fontSize: 16, fontWeight: 600 }}
      >
        Score distribution
      </Typography>
      <Box ref={containerRef} sx={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
          focusable="false"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <path
            d={`M ${left} ${top} V ${bottom} H ${width - 12}`}
            fill="none"
            stroke={theme.palette.divider}
          />
          {axis.ticks.map((tick) => (
            <text
              key={tick}
              x={left - 8}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={12}
              fill={theme.palette.text.secondary}
            >
              {formatter.format(tick)}
            </text>
          ))}
          {labels.map((label, index) => {
            const count = data[index] ?? 0;
            const x = left + columnWidth * index;
            const center = x + columnWidth / 2;
            return (
              <g key={label}>
                <line x1={x} x2={x} y1={top} y2={bottom} stroke={theme.palette.divider} />
                <rect
                  x={x + columnWidth * 0.14}
                  y={y(count)}
                  width={columnWidth * 0.72}
                  height={bottom - y(count)}
                  fill={theme.palette.primary.main}
                />
                {count > 0 ? (
                  <text
                    x={center}
                    y={y(count) - 8}
                    textAnchor="middle"
                    fontSize={14}
                    fill={theme.palette.text.primary}
                  >
                    {formatter.format(count)}
                  </text>
                ) : null}
                <text
                  x={center}
                  y={bottom + 20}
                  textAnchor="middle"
                  fontSize={12}
                  fill={theme.palette.text.secondary}
                >
                  {label}
                </text>
              </g>
            );
          })}
          <text
            x={left + plotWidth / 2}
            y={height - 6}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill={theme.palette.text.primary}
          >
            Score
          </text>
        </svg>
        <Box
          sx={{
            position: 'absolute',
            left: `${(left / width) * 100}%`,
            top: `${(top / height) * 100}%`,
            width: `${(plotWidth / width) * 100}%`,
            height: `${(plotHeight / height) * 100}%`,
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.max(1, labels.length)}, minmax(0, 1fr))`,
          }}
        >
          {labels.map((label, index) => {
            const count = data[index] ?? 0;
            const description = `Score ${index + 1}: ${formatter.format(count)} ${count === 1 ? 'item' : 'items'}`;
            return (
              <Box
                key={label}
                component="button"
                type="button"
                aria-label={description}
                title={description}
                onClick={() => onClick(index)}
                sx={{
                  minWidth: 0,
                  p: 0,
                  border: 0,
                  borderRadius: 1,
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: -2,
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
