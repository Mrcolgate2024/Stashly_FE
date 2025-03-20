export function formatPercentage(value: number): string {
  const formatted = value.toFixed(2);
  return value >= 0 ? `+${formatted}%` : `${formatted}%`;
}

export function formatBasisPoints(value: number): string {
  const rounded = Math.round(value);
  return value >= 0 ? `+${rounded}` : `${rounded}`;
} 