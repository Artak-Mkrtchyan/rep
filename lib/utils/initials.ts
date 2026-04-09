export const initialsFrom = (label: string): string => {
  const parts = label.trim().split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase().slice(0, 2);
  }
  return label.slice(0, 2).toUpperCase() || '?';
};
