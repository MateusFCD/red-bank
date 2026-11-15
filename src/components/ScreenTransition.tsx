import { useCallback, useRef, type ReactNode } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Animated, View } from 'react-native';

import { cn } from '@/src/utils/cn';

/**
 * `View` aqui já é a versão com suporte a `className` (NativeWind reescreve o
 * import de `react-native`). Envolvê-la com `createAnimatedComponent` permite
 * combinar classes Tailwind estáticas com os valores `Animated` no `style`.
 */
const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Fades and slides a screen's content in every time it gains focus, using
 * the classic `Animated` API. Native-stack drives its own push/pop
 * transition natively, and the bottom tabs get their own `Animated`-based
 * `animation="shift"` (see App.routes.tsx) — this wrapper adds a consistent,
 * JS-driven entrance for the content itself on top of either.
 */
export function ScreenTransition({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useFocusEffect(
        useCallback(() => {
            opacity.setValue(0);
            translateY.setValue(20);

            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 280,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 280,
                    useNativeDriver: true,
                }),
            ]).start();
        }, [opacity, translateY])
    );

    return (
        <AnimatedView
            className={cn('flex-1', className)}
            style={{ opacity, transform: [{ translateY }] }}
        >
            {children}
        </AnimatedView>
    );
}
