import { statusColors } from './profileUtil';

export const getCountAxis = (counts: number[]) => {
  const maximum = Math.max(0, ...counts);
  const roughStep = Math.max(1, maximum / 5);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const fraction = roughStep / magnitude;
  const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * magnitude;
  const max = Math.max(4, Math.ceil(maximum / step) * step);

  return {
    max,
    ticks: Array.from({ length: max / step + 1 }, (_, index) => index * step),
  };
};

export const getProgressValues = (data: Record<string, number>) => {
  return Object.entries(data)
    .filter(([key]) => key !== 'all')
    .map(([key, value]) => ({
      title: key,
      value: value,
      color: statusColors[key as keyof typeof statusColors],
    }));
};
