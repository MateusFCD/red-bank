import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import { CheckCircleIcon } from '@/src/components/icons';

/** `View` com suporte a `className` + valores `Animated` no `style`. */
const AnimatedView = Animated.createAnimatedComponent(View);

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
    <AnimatedView pointerEvents="none" className="absolute top-[58px] left-0 right-0 z-80 items-center">
      <AnimatedView
        className="flex-row items-center gap-2 bg-ink px-4 py-2.5"
        style={{ opacity, transform: [{ translateY }] }}
      >
        <CheckCircleIcon size={16} color={colors.bg} />
        <Text className="text-app text-[13px] font-body-medium">{message}</Text>
      </AnimatedView>
    </AnimatedView>
  );
}
