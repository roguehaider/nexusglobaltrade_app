import BottomSheet, { BottomSheetBackdrop, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../constants/theme';

type Props = {
  title?: string;
  children: ReactNode;
  snapPoints?: (string | number)[];
};

export const AppBottomSheet = forwardRef<BottomSheet, Props>(
  ({ title, children, snapPoints = ['45%', '75%'] }, ref) => {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.55} />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
      >
        {title ? (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
        ) : null}
        <View style={styles.body}>{children}</View>
      </BottomSheet>
    );
  },
);

AppBottomSheet.displayName = 'AppBottomSheet';

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  handle: { backgroundColor: colors.border, width: 40 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  title: { color: colors.textPrimary, fontSize: typography.h2, fontWeight: '700' },
  body: { flex: 1, paddingHorizontal: 20, paddingBottom: 24 },
});
