import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Confetti } from '../components/Confetti';
import { PaintingView } from '../components/PaintingView';
import { PrintCard } from '../components/PrintCard';
import { ScreenShell } from '../components/ScreenShell';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/useAppStore';
import { savePainting, type SaveResult } from '../utils/saveImage';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Done'>;

const SAVE_MESSAGE: Record<SaveResult, string> = {
  saved: 'Đã lưu vào ảnh! / Saved to Photos!',
  shared: 'Đã chia sẻ / Shared',
  denied: 'Cần quyền truy cập ảnh / Photo permission needed',
  error: 'Có lỗi, thử lại / Something went wrong',
};

export function DoneScreen({ navigation }: Props) {
  const reset = useAppStore((s) => s.reset);
  const layout = useLayout();
  const paintingRef = useRef<View | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const width = Math.min(layout.shortEdge * 0.55, 260);

  const paintAgain = () => {
    reset();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await savePainting(paintingRef);
      setMessage(SAVE_MESSAGE[result]);
    } catch (error) {
      setMessage(SAVE_MESSAGE.error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenShell
      step={9}
      titleVi="Tranh của con!"
      titleEn="Your painting!"
      showBack={false}
      guideId="done"
      surface="red"
    >
      <PrintCard texture={false} contentStyle={styles.printPad}>
        <PaintingView ref={paintingRef} width={width} framed={false} />
      </PrintCard>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.actions}>
        <View style={styles.action}>
          <Button
            labelVi="Vẽ lại"
            labelEn="Paint again"
            variant="secondary"
            accessibilityLabel="Vẽ lại / Paint again"
            onPress={paintAgain}
          />
        </View>
        <View style={styles.action}>
          <Button
            labelVi={saving ? 'Đang lưu…' : 'Lưu 💾'}
            labelEn={saving ? 'Saving…' : 'Save'}
            disabled={saving}
            accessibilityLabel="Lưu tranh / Save painting"
            onPress={save}
          />
        </View>
      </View>

      <Confetti />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  printPad: {
    padding: Spacing.xs,
  },
  message: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.pigmentWhite,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  action: {
    width: 150,
  },
});
