import Svg, { Path } from 'react-native-svg';

/** Figma `2061:74060` / `2061:74062` / `2061:74064` — icons in 42×42 chip (viewBox matches artboard crop). */
const VB = '31 30 42 42';
const STROKE = '#087443';
const SW = 2;

export function ProfileSocialFacebookGlyph() {
  return (
    <Svg width={42} height={42} viewBox={VB} fill="none">
      <Path
        d="M59.0003 39.334H55.5003C53.9532 39.334 52.4695 39.9486 51.3755 41.0425C50.2816 42.1365 49.667 43.6202 49.667 45.1673V48.6673H46.167V53.334H49.667V62.6673H54.3337V53.334H57.8337L59.0003 48.6673H54.3337V45.1673C54.3337 44.8579 54.4566 44.5612 54.6754 44.3424C54.8942 44.1236 55.1909 44.0007 55.5003 44.0007H59.0003V39.334Z"
        stroke={STROKE}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ProfileSocialInstagramGlyph() {
  return (
    <Svg width={42} height={42} viewBox={VB} fill="none">
      <Path
        d="M57.833 39.334H46.1663C42.9447 39.334 40.333 41.9457 40.333 45.1673V56.834C40.333 60.0556 42.9447 62.6673 46.1663 62.6673H57.833C61.0547 62.6673 63.6663 60.0556 63.6663 56.834V45.1673C63.6663 41.9457 61.0547 39.334 57.833 39.334Z"
        stroke={STROKE}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M56.6667 50.2654C56.8106 51.2363 56.6448 52.2279 56.1927 53.0992C55.7406 53.9705 55.0253 54.677 54.1485 55.1183C53.2718 55.5596 52.2782 55.7132 51.3091 55.5573C50.34 55.4013 49.4447 54.9438 48.7506 54.2497C48.0566 53.5556 47.599 52.6604 47.4431 51.6913C47.2871 50.7222 47.4407 49.7286 47.882 48.8518C48.3233 47.975 49.0299 47.2597 49.9011 46.8076C50.7724 46.3556 51.764 46.1897 52.735 46.3337C53.7254 46.4806 54.6423 46.9421 55.3503 47.65C56.0583 48.358 56.5198 49.2749 56.6667 50.2654Z"
        stroke={STROKE}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M58.417 44.584H58.4287"
        stroke={STROKE}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ProfileSocialYoutubeGlyph() {
  return (
    <Svg width={42} height={42} viewBox={VB} fill="none">
      <Path
        d="M51.9997 59.1673C49.3163 59.1673 44.533 58.934 42.5497 58.4673C41.733 58.234 41.1497 57.6507 40.9163 56.834C40.5663 55.5507 40.333 52.8673 40.333 51.0007C40.333 49.134 40.5663 46.4507 40.9163 45.1673C41.1497 44.3507 41.733 43.7673 42.5497 43.534C44.533 43.0673 49.3163 42.834 51.9997 42.834C54.683 42.834 59.4663 43.0673 61.4497 43.534C62.2663 43.7673 62.8497 44.3507 63.083 45.1673C63.433 46.4507 63.6663 49.134 63.6663 51.0007C63.6663 52.8673 63.433 55.5507 63.083 56.834C62.8497 57.6507 62.2663 58.234 61.4497 58.4673C59.4663 58.934 54.683 59.1673 51.9997 59.1673Z"
        stroke={STROKE}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M49.667 54.5L55.5003 51L49.667 47.5V54.5Z"
        stroke={STROKE}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
