import { useWindowDimensions } from 'react-native';

import { Layout } from '../theme/tokens';

export interface LayoutInfo {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  contentMaxWidth: number;
  shortEdge: number;
  longEdge: number;
}

export function useLayout(): LayoutInfo {
  const { width, height } = useWindowDimensions();
  const shortEdge = Math.min(width, height);
  const longEdge = Math.max(width, height);
  const isLandscape = width > height;
  const isTablet = shortEdge >= Layout.tabletMinShortEdge;

  let contentMaxWidth: number = Layout.contentMaxWidthPhone;
  if (isTablet) {
    contentMaxWidth = Layout.contentMaxWidthTablet;
  } else if (isLandscape) {
    contentMaxWidth = Layout.contentMaxWidthLandscape;
  }

  return {
    width,
    height,
    isLandscape,
    isTablet,
    contentMaxWidth,
    shortEdge,
    longEdge,
  };
}
