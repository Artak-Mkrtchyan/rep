export type SegmentedControlProps = {
  segments: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
  accessibilityLabel?: string;
};
