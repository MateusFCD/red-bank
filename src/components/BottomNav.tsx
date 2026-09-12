import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIcon, SettingsIcon } from '@/src/components/icons';
import { colors, fonts, textMuted } from '@/src/theme/colors';

export function BottomNav( { state, navigation }: BottomTabBarProps ) {
    const insets = useSafeAreaInsets();
    const activeRoute = state.routeNames[ state.index ];
    const homeColor = activeRoute === 'Home' ? colors.accent300 : textMuted(0.55);
    const settingsColor = activeRoute === 'Settings' ? colors.accent300 : textMuted(0.55);

    return (
        <View style={ [styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) + 16 }] }>
            <Pressable style={ styles.item } onPress={ () => navigation.navigate('Home') } hitSlop={ 8 }>
                <HomeIcon size={ 20 } color={ homeColor }/>
                <Text style={ [styles.label, { color: homeColor }] }>Home</Text>
            </Pressable>
            <Pressable style={ styles.item } onPress={ () => navigation.navigate('Settings') } hitSlop={ 8 }>
                <SettingsIcon size={ 20 } color={ settingsColor }/>
                <Text style={ [styles.label, { color: settingsColor }] }>Config</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
        paddingTop: 10,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },
    item: {
        alignItems: 'center',
        gap: 3,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 11,
        fontFamily: fonts.bodyMedium,
    },
});
