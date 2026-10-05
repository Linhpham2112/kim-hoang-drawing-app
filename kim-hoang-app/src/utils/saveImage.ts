import { type RefObject } from 'react';
import { type View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Asset, requestPermissionsAsync } from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

export type SaveResult = 'saved' | 'shared' | 'denied' | 'error';

function asFileUri(uri: string): string {
  return uri.startsWith('file://') ? uri : `file://${uri}`;
}

/**
 * Capture the painting View as a PNG and save it to the Camera Roll.
 *
 * Falls back to the iOS share sheet (`expo-sharing`) if the media-library
 * permission is denied, so the child's work is never lost. Returns a result the
 * caller can turn into a brief confirmation.
 */
export async function savePainting(viewRef: RefObject<View | null>): Promise<SaveResult> {
  if (!viewRef.current) {
    throw new Error('Painting view is not mounted');
  }

  const captured = await captureRef(viewRef, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
  });
  const uri = asFileUri(captured);

  const { status } = await requestPermissionsAsync(true);
  if (status === 'granted') {
    await Asset.create(uri);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return 'saved';
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
    return 'shared';
  }

  return 'denied';
}
