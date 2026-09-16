import { useCallback, useRef, type ReactNode } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Animated, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Fades and slides a screen's content in every time it gains focus, using
 * the classic `Animated` API. Native-stack drives its own push/pop
 * transition natively, and the bottom tabs get their own `Animated`-based
 * `animation="shift"` (see App.routes.tsx) — this wrapper adds a consistent,
 * JS-driven entrance for the content itself on top of either.
 */
export function ScreenTransition({
    children,
    style,
}: {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
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
        <Animated.View
            style={[styles.flex, style, { opacity, transform: [{ translateY }] }]}
        >
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
});
