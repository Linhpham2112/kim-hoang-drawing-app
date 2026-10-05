import { Image } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ROOSTER_ART } from './roosterArt';
import { ROOSTER_RELIEF } from './roosterAssets';

/** RoosterMotif — Kim Hoàng "Gà" from traced SVGs (`roosterArt.ts` / relief PNG). */
interface RoosterMotifProps {
  width: number;
  height: number;
  /** B&W woodblock print vs full coloured reference trace. */
  mode?: 'outline' | 'solid';
}

export function RoosterMotif({ width, height, mode = 'solid' }: RoosterMotifProps) {
  // Outline mode uses the pre-rendered line-work PNG — the raw SVG is ~1 MB of
  // path data and `SvgXml` would re-parse it on every mount.
  if (mode === 'outline') {
    return (
      <Image
        source={ROOSTER_RELIEF}
        style={{ width, height }}
        resizeMode="contain"
      />
    );
  }
  return <SvgXml xml={ROOSTER_ART} width={width} height={height} />;
}
