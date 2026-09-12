import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/src/theme/colors';
import { CheckCircleIcon } from '@/src/components/icons';

export function Toast({ message }: { message: string | null }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    if (!message) return;
    opacity.setValue(0);
    translateY.setValue(-8);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [message, opacity, translateY]);

  if (!message) return null;

  return (
    <Animated.View pointerEvents="none" style={styles.wrap}>
      <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
        <CheckCircleIcon size={16} color={colors.bg} />
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    zIndex: 80,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  text: {
    color: colors.bg,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
  },
});
