import { SvgXml } from 'react-native-svg';

import { PIG_ART } from './pigArt';

/** PigMotif — Kim Hoàng "Lợn" artwork from `pigArt.ts`. Always crisp vector. */
interface PigMotifProps {
  width: number;
  height: number;
  mode?: 'outline' | 'solid';
}

export function PigMotif({ width, height }: PigMotifProps) {
  return <SvgXml xml={PIG_ART} width={width} height={height} />;
}
