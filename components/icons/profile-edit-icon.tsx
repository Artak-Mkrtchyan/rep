import Svg, { G, Path } from 'react-native-svg';

/** Figma `10562:111137` icon/edit — 16×16 */
type ProfileEditIconProps = {
  width?: number;
  height?: number;
  /** Stroke color — Figma neutral/950 `#111111` on profile edit. */
  color?: string;
};

export function ProfileEditIcon({
  width = 16,
  height = 16,
  color = '#111111',
}: ProfileEditIconProps) {
  const dim = { width, height };
  return (
    <Svg
      {...dim}
      viewBox="0 0 16 16"
      fill="none"
      style={dim}
      preserveAspectRatio="xMidYMid meet"
    >
      <G>
        <Path
          d="M7.33301 2.66602H2.66634C2.31272 2.66602 1.97358 2.80649 1.72353 3.05654C1.47348 3.30659 1.33301 3.64573 1.33301 3.99935V13.3327C1.33301 13.6863 1.47348 14.0254 1.72353 14.2755C1.97358 14.5255 2.31272 14.666 2.66634 14.666H11.9997C12.3533 14.666 12.6924 14.5255 12.9425 14.2755C13.1925 14.0254 13.333 13.6863 13.333 13.3327V8.66602"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.333 1.66617C12.5982 1.40095 12.9579 1.25195 13.333 1.25195C13.7081 1.25195 14.0678 1.40095 14.333 1.66617C14.5982 1.93138 14.7472 2.29109 14.7472 2.66617C14.7472 3.04124 14.5982 3.40095 14.333 3.66617L7.99967 9.9995L5.33301 10.6662L5.99967 7.9995L12.333 1.66617Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
