import { lazy, Suspense, type ReactNode } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Colors } from '../theme/tokens';
import type { RootStackParamList } from './types';

const fallback = <View style={{ flex: 1, backgroundColor: Colors.surfacePaper }} />;

const GalleryScreen = lazy(() =>
  import('../screens/GalleryScreen').then((m) => ({ default: m.GalleryScreen })),
);
const GalleryAlbumScreen = lazy(() =>
  import('../screens/GalleryAlbumScreen').then((m) => ({ default: m.GalleryAlbumScreen })),
);
const GalleryWorkScreen = lazy(() =>
  import('../screens/GalleryWorkScreen').then((m) => ({ default: m.GalleryWorkScreen })),
);

function Gate({ children }: { children: ReactNode }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

export function LazyGalleryScreen(props: NativeStackScreenProps<RootStackParamList, 'Gallery'>) {
  return (
    <Gate>
      <GalleryScreen {...props} />
    </Gate>
  );
}

export function LazyGalleryAlbumScreen(
  props: NativeStackScreenProps<RootStackParamList, 'GalleryAlbum'>,
) {
  return (
    <Gate>
      <GalleryAlbumScreen {...props} />
    </Gate>
  );
}

export function LazyGalleryWorkScreen(
  props: NativeStackScreenProps<RootStackParamList, 'GalleryWork'>,
) {
  return (
    <Gate>
      <GalleryWorkScreen {...props} />
    </Gate>
  );
}
