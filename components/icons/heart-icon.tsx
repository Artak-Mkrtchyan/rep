import { SVGProps } from 'react';
import Svg, { Path } from 'react-native-svg';

export const HeartIcon = ({
  stroke = '#111111',
  fill = 'transparent',
  width = 23,
  height = 20,
}: SVGProps<SVGSVGElement>) => (
  <Svg width={width} height={height} viewBox="-0.5 -1.5 23 23">
    <Path
      d="M19.4279 2.58826C18.9262 2.08483 18.3301 1.6854 17.6737 1.41285C17.0173 1.1403 16.3136 1 15.6029 1C14.8922 1 14.1885 1.1403 13.5321 1.41285C12.8757 1.6854 12.2796 2.08483 11.7779 2.58826L11.0079 3.36826L10.2379 2.58826C9.73622 2.08483 9.1401 1.6854 8.48372 1.41285C7.82734 1.1403 7.12361 1 6.4129 1C5.70218 1 4.99846 1.1403 4.34208 1.41285C3.6857 1.6854 3.08958 2.08483 2.5879 2.58826C0.467899 4.70826 0.337899 8.28826 3.0079 11.0083L11.0079 19.0083L19.0079 11.0083C21.6779 8.28826 21.5479 4.70826 19.4279 2.58826Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
  </Svg>
);
