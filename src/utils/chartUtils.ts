import { statusColors } from './profileUtil';

export const getProgressValues = (data: Record<string, number>) => {
  return Object.entries(data)
    .filter(([key]) => key !== 'all')
    .map(([key, value]) => ({
      title: key,
      value: value,
      color: statusColors[key as keyof typeof statusColors],
    }));
};

export const roundHundred = (value: number) => Math.ceil(value / 100) * 100;
